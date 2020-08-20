const T = require('goblin-nabu/widgets/helpers/t.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

// https://www.npmjs.com/package/big-number

const BigNumber = require('bignumber.js');

const parseFormat = {
  decimalSeparator: '.',
  groupSeparator: '',
  groupSize: 0,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
};

//-----------------------------------------------------------------------------
function getNumber(value) {
  if (typeof value === 'string') {
    return parseFloat(value);
  }
  return value;
}

//-----------------------------------------------------------------------------
// Removes non-significant zeros.
// 5.1 return 5.1
// 0.300 return 0.3
// 12.000 return 12
function removeZeros(value) {
  if (typeof value === 'string' && value.indexOf('.') !== -1) {
    while (value[value.length - 1] === '0') {
      value = value.substring(0, value.length - 1);
    }
    if (value[value.length - 1] === '.') {
      value = value.substring(0, value.length - 1);
    }
  }
  return value;
}

//-----------------------------------------------------------------------------
function check(canonical) {
  if (typeof canonical === 'number') {
    return true;
  }
  if (canonical === '' || typeof canonical !== 'string') {
    return false;
  }
  const regex = /^[-]?[0-9]*\.?[0-9]*$/g;
  return regex.test(canonical);
}

//-----------------------------------------------------------------------------
// With percent = '0.12', return '12%'.
function getDisplayed(canonical, decimals, scale = 100) {
  if (!canonical) {
    return null;
  }

  if (scale === 1 && canonical.length > 1 && canonical.endsWith('%')) {
    canonical = canonical.substring(0, canonical.length - 1);
  }

  BigNumber.config({
    FORMAT: parseFormat,
    DECIMAL_PLACES: decimals || 3,
  });
  const value = new BigNumber(canonical);
  if (value.isNaN()) {
    return `Erreur (${canonical})`;
  }

  const m = value.times(scale);
  return removeZeros(m.toFormat(decimals || 3)) + '%';
}

//-----------------------------------------------------------------------------
// With editedPercent = '45%', return '0.45'.
function parseEdited(edited, minCanonical, maxCanonical, scale = 100) {
  if (!edited || edited === '') {
    return {value: null, error: null};
  }

  let sign = '';
  if (edited.startsWith('+')) {
    edited = edited.substring(1);
  }
  if (edited.startsWith('-')) {
    edited = edited.substring(1);
    sign = '-';
  }

  let factor = 1;
  if (edited.length > 1 && edited.endsWith('%')) {
    edited = edited.substring(0, edited.length - 1);
    factor = scale;
  }

  let value = '';
  for (let i = 0; i < edited.length; i++) {
    const c = edited[i];
    if ((c >= '0' && c <= '9') || c === '.') {
      value += c;
    } else {
      return {value: null, error: T('Incorrect')};
    }
  }
  if (value === '') {
    value = '0';
  }

  BigNumber.config({FORMAT: parseFormat, DECIMAL_PLACES: 9});
  value = new BigNumber(value);
  if (value.isNaN()) {
    return {
      value: null,
      error: StringBuilder.joinWords(`"${value}"`, T('incorrect')),
    };
  }

  value = value.div(factor);
  value = removeZeros(value.toString());

  let canonical = sign + value;

  if (
    minCanonical !== undefined &&
    getNumber(canonical) < getNumber(minCanonical)
  ) {
    return {value: minCanonical, error: T('Valeur trop petite')};
  }
  if (
    maxCanonical !== undefined &&
    getNumber(canonical) > getNumber(maxCanonical)
  ) {
    return {value: maxCanonical, error: T('Valeur trop grande')};
  }

  if (scale === 1) {
    canonical += '%';
  }

  return {value: canonical, error: null};
}

function incEdited(
  edited,
  cursorPosition,
  direction,
  step = 1,
  min = -1000000,
  max = 1000000,
  scale = 100
) {
  let newEdited = null;
  let selectionStart = -1;
  let selectionEnd = -1;

  const {value, error} = this.parseEdited(edited, undefined, undefined, scale);
  if (!error) {
    let newValue = getNumber(value) + direction * step;

    newValue = Math.max(newValue, getNumber(min));
    newValue = Math.min(newValue, getNumber(max));

    newValue = newValue + '';

    newEdited = getDisplayed(newValue, undefined, scale);
    selectionStart = 0;
    selectionEnd = newEdited.length;
  }

  return {
    edited: newEdited,
    selectionStart,
    selectionEnd,
  };
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  getDisplayed,
  parseEdited,
  incEdited,
};
