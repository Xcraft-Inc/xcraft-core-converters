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
function check(canonical) {
  const regex = /^[0-9]*\.?[0-9]*$/g;
  return regex.test(canonical);
}

//-----------------------------------------------------------------------------
// With percent = '0.12', return '12%'.
function getDisplayed(canonicalPercent, decimals) {
  if (!canonicalPercent) {
    return null;
  }

  BigNumber.config({FORMAT: parseFormat, ERRORS: false});
  const value = new BigNumber(canonicalPercent);
  if (value.isNaN()) {
    return `Erreur (${canonicalPercent})`;
  }

  const m = value.mul(100);
  return removeZeros(m.toFormat(decimals || 3)) + '%';
}

//-----------------------------------------------------------------------------
// With editedPercent = '45%', return '0.45'.
function parseEdited(editedPercent) {
  if (!editedPercent || editedPercent === '') {
    return {value: null, error: null};
  }

  let factor = 1;
  if (editedPercent.length > 1 && editedPercent.endsWith('%')) {
    editedPercent = editedPercent.substring(0, editedPercent.length - 1);
    factor = 100;
  }

  let value = '';
  for (let i = 0; i < editedPercent.length; i++) {
    const c = editedPercent[i];
    if ((c >= '0' && c <= '9') || c === '.') {
      value += c;
    } else {
      return {value: null, error: 'Incorrect'};
    }
  }
  if (value === '') {
    value = '0';
  }

  BigNumber.config({FORMAT: parseFormat, DECIMAL_PLACES: 9, ERRORS: false});
  value = new BigNumber(value);
  if (value.isNaN()) {
    return {value: null, error: `"${value}" incorrect`};
  }

  value = value.div(factor);
  value = removeZeros(value.toString());
  return {value: value, error: null};
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  getDisplayed,
  parseEdited,
};
