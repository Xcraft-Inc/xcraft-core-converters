const T = require('goblin-nabu/widgets/helpers/t.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

// https://www.npmjs.com/package/big-number

const BigNumber = require('bignumber.js');

const displayedFormat = {
  decimalSeparator: '.',
  groupSeparator: "'",
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
};

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
// 007 return 7
// 0.300 return 0.3
// 12.000 return 12
function removeZeros(value, postfix) {
  if (postfix && typeof value === 'string') {
    while (value.length > 1 && value[0] === '0') {
      value = value.substring(1);
    }
  }
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
function getDisplayed(canonicalNumber, decimals) {
  if (!canonicalNumber && canonicalNumber !== 0) {
    return null;
  }

  BigNumber.config({
    FORMAT: displayedFormat,
    DECIMAL_PLACES: decimals || 3,
  });

  const x = new BigNumber(canonicalNumber);
  return removeZeros(x.toFormat(decimals || 3), false);
}

//-----------------------------------------------------------------------------
function parseEdited(editedNumber) {
  if (!editedNumber || editedNumber === '') {
    return {value: null, error: null};
  }

  editedNumber = editedNumber.replace(/ |'|/g, ''); // remove spaces and quotes

  let sign = '';
  if (editedNumber.startsWith('+')) {
    editedNumber = editedNumber.substring(1);
  }
  if (editedNumber.startsWith('-')) {
    editedNumber = editedNumber.substring(1);
    sign = '-';
  }

  for (let i = 0; i < editedNumber.length; i++) {
    const c = editedNumber[i];
    if ((c < '0' || c > '9') && c !== '.' && c !== "'") {
      return {value: null, error: T('Incorrect')};
    }
  }

  const value = removeZeros(editedNumber, true).replace(/[']+/g, '');

  BigNumber.config({FORMAT: parseFormat, DECIMAL_PLACES: 9});
  if (new BigNumber(value).isNaN()) {
    return {
      value: null,
      error: StringBuilder.joinWords(`"${value}"`, T('incorrect')),
    };
  }

  return {value: sign + value, error: null};
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  getDisplayed,
  parseEdited,
};
