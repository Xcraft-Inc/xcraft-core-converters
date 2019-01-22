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
// Adds zeros or deletes digits to get a set length.
// Examples with width = 5:
// 12 return '00012'
// 123456 return '23456'
function pad(n, length) {
  n = n + ''; // to string
  return n.length >= length
    ? n.substring(n.length - length) // deletes digits
    : new Array(length - n.length + 1).join('0') + n; // adds zeros
}

//-----------------------------------------------------------------------------
function check(canonical) {
  if (typeof canonical !== 'string') {
    return false;
  }
  const regex = /^[-]?[0-9]*\.?[0-9]?[0-9]?$/g;
  return regex.test(canonical);
}

//-----------------------------------------------------------------------------
// With a canonical price, return a sortable string.
// Does not handle negative prices!
// 12 return '0000001200'
// 1234.55 return '0000123455'
// 1.666666667 return '0000000166'
function getSortable(price) {
  if (price < 0) {
    console.log(`Do not support negative prices '${price}'`);
  } else if (price > 99999999) {
    console.log(`Do not support too big prices '${price}'`);
  }
  let n = price * 100; // to centimes
  n = n + ''; // to string
  const i = n.indexOf('.');
  if (i >= 0) {
    n = n.substring(0, i); // strip fractional part if exist
  }
  return pad(n, 10); // up to 99'999'999.99 francs
}

//-----------------------------------------------------------------------------
// With price = '1234.5', return "1'234.50".
function getDisplayed(canonicalPrice, format) {
  if (!canonicalPrice) {
    return null;
  }

  BigNumber.config({FORMAT: displayedFormat, DECIMAL_PLACES: 2, ERRORS: false});

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
  check,
  getSortable,
  getDisplayed,
  parseEdited,
};
