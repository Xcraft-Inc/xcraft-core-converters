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
function pad(n, width) {
  n = n + ''; // to string
  return n.length >= width
    ? n.substring(0, width)
    : new Array(width - n.length + 1).join('0') + n;
}

//-----------------------------------------------------------------------------
function getSortable(price) {
  let n = price * 100;
  n = n + ''; // to string
  const i = n.indexOf('.');
  if (i >= 0) {
    n = n.substring(0, i); // strip fractional part
  }
  return pad(n, 10);
}

//-----------------------------------------------------------------------------
// With price = '1234.5', return "1'234.50".
function getDisplayed(canonicalPrice, format) {
  if (!canonicalPrice) {
    return null;
  }

  BigNumber.config({FORMAT: displayedFormat, ERRORS: false});

  const x = new BigNumber(canonicalPrice);
  return x.toFormat(2); // 2 decimals
}

//-----------------------------------------------------------------------------
// With editedPrice = '12.666', return '12.67'.
// With editedPrice = '12', return '12.00'.
function parseEdited(editedPrice) {
  if (!editedPrice || editedPrice === '') {
    return {value: null, error: null};
  }

  BigNumber.config({FORMAT: parseFormat, DECIMAL_PLACES: 2, ERRORS: false});

  editedPrice = editedPrice.replace(/ |'|/g, ''); // remove spaces and quotes
  const x = new BigNumber(editedPrice, 10); // base 10 for rounding to 2 decimals
  if (x.isNaN()) {
    return {value: null, error: 'Montant incorrect'};
  } else {
    return {value: x.toString(), error: null};
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  getSortable,
  getDisplayed,
  parseEdited,
};
