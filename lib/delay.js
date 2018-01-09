// https://www.npmjs.com/package/big-number

const BigNumber = require ('bignumber.js');

const parseFormat = {
  decimalSeparator: '.',
  groupSeparator: '',
  groupSize: 0,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
};

//-----------------------------------------------------------------------------
// Removes non-significant zeros.
// 5.1 return 5.1
// 0.300 return 0.3
// 12.000 return 12
function removeZeros (value) {
  if (value && value.indexOf ('.') !== -1) {
    while (value[value.length - 1] === '0') {
      value = value.substring (0, value.length - 1);
    }
    if (value[value.length - 1] === '.') {
      value = value.substring (0, value.length - 1);
    }
  }
  return value;
}

//-----------------------------------------------------------------------------
// With delay = '* * 4 * * * *', return '4h'.
function getDisplayed (canonicalDelay) {
  if (!canonicalDelay) {
    return null;
  }

  const items = canonicalDelay.split (' ');
  if (items.length !== 7) {
    return `Erreur (${canonicalDelay})`;
  }

  const result = [];

  if (items[6] !== '*') {
    result.push (items[6] + 'a');
  }
  if (items[4] !== '*') {
    result.push (items[4] + 'mo');
  }
  if (items[3] !== '*') {
    result.push (items[3] + 'j');
  }
  if (items[2] !== '*') {
    result.push (items[2] + 'h');
  }
  if (items[1] !== '*') {
    result.push (items[1] + 'm');
  }
  if (items[0] !== '*') {
    result.push (items[0] + 's');
  }

  return result.join (' ');
}

//-----------------------------------------------------------------------------
// With delay = '1a',          return '* * * * * * 1'.
// With delay = '2m',          return '* * * * 2 * *'.
// With delay = '3.5j',        return '* * * 3.5 * * *'.
// With delay = '4 h',         return '* * 4 * * * *'.
// With delay = '5min',        return '* 5 * * * * *'.
// With delay = '30s',         return '30 * * * * * *'.
// With delay = '2j 3h 10min', return '* 10 3 2 * * *'.
function parseEdited (editedDelay) {
  if (!editedDelay || editedDelay === '') {
    return {value: null, error: null};
  }

  editedDelay = editedDelay.toLowerCase ();

  // Scan line and extract all values.
  const array = [];
  let mode = 'start';
  for (let i = 0; i < editedDelay.length; i++) {
    const c = editedDelay[i];
    const isDigit = (c >= '0' && c <= '9') || c === '.' || c === '-';

    if (c === ' ') {
      mode = 'start';
    } else {
      if (isDigit) {
        if (mode !== 'number') {
          mode = 'number';
          array.push ('');
        }
      } else {
        if (mode !== 'unit') {
          mode = 'unit';
          array.push ('');
        }
      }
      array[array.length - 1] = array[array.length - 1] + c;
    }
  }

  if (array.length === 0) {
    return {value: null, error: null};
  }

  if (array.length % 2 !== 0) {
    // Must by even (pairs of numbers/units).
    return {value: null, error: 'Incorrect'};
  }

  BigNumber.config ({FORMAT: parseFormat, ERRORS: false});
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (i % 2 === 0) {
      // Number if even.
      const value = new BigNumber (item);
      if (value.isNaN ()) {
        return {value: null, error: `"${item}" incorrect`};
      }
      array[i] = removeZeros (value.toFormat (2));
    } else {
      // Unit if odd.
      if (
        (item[0] >= '0' && item[0] <= '9') ||
        item[0] === '.' ||
        item[0] === '-'
      ) {
        return {value: null, error: `"${item}" incorrect`};
      }
    }
  }

  const cron = [];
  cron.push ('*'); // 0: seconds
  cron.push ('*'); // 1: minutes
  cron.push ('*'); // 2: hours
  cron.push ('*'); // 3: day
  cron.push ('*'); // 4: month
  cron.push ('*'); // 5: day of week
  cron.push ('*'); // 6: year

  for (let i = 0; i < array.length; i += 2) {
    const value = array[i + 0];
    const unit = array[i + 1];
    switch (unit) {
      case 'a':
      case 'an':
      case 'ans':
      case 'année':
      case 'années':
      case 'y': // year
        cron[6] = value;
        break;
      case 'mo': // mois or month
      case 'mois':
        cron[4] = value;
        break;
      case 'j':
      case 'jour':
      case 'jours':
      case 'd': // day
        cron[3] = value;
        break;
      case 'h': // heure or hour
      case 'heure':
      case 'heures':
        cron[2] = value;
        break;
      case 'm':
      case 'min':
      case 'minute':
      case 'minutes':
      case '"':
        cron[1] = value;
        break;
      case 's':
      case 'sec':
      case 'seconde':
      case 'secondes':
      case "'":
        cron[0] = value;
        break;
      default:
        return {value: null, error: `"${unit}" incorrect`};
    }
  }

  return {value: cron.join (' '), error: null};
}

//-----------------------------------------------------------------------------
exports.getDisplayed = getDisplayed;
exports.parseEdited = parseEdited;
