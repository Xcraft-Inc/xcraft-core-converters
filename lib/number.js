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
function getDisplayed(canonicalNumber) {
  if (!canonicalNumber) {
    return null;
  }

  // Detect error in canonical format.
  const p = parseEdited(canonicalNumber);
  if (p.error) {
    return `Erreur (${canonicalNumber})`;
  }

  return canonicalNumber;
}

//-----------------------------------------------------------------------------
function parseEdited(editedNumber) {
  if (!editedNumber || editedNumber === '') {
    return {value: null, error: null};
  }

  for (let i = 0; i < editedNumber.length; i++) {
    const c = editedNumber[i];
    if ((c < '0' || c > '9') && c !== '.') {
      return {value: null, error: 'Incorrect'};
    }
  }

  const value = removeZeros(editedNumber);

  BigNumber.config({FORMAT: parseFormat, ERRORS: false});
  if (new BigNumber(value).isNaN()) {
    return {value: null, error: `"${value}" incorrect`};
  }

  return {value: value, error: null};
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
  parseEdited,
};
