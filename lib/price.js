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
const defaultOptions = {
  decimal: '.',
  thousands: "'",
  minus: '−',
  precision: '0.01', // '0.01', '0.05' or '1M',
  unitSeparator: ' ',
  unit: '',
};

function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

function formatMoney(options) {
  options = {...defaultOptions, ...options};

  // See http://mikemcl.github.io/bignumber.js/#format
  const bnFormat = {
    prefix: '',
    decimalSeparator: options.decimal,
    groupSeparator: options.thousands,
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
    suffix: '',
  };

  const bnRounding = BigNumber.ROUND_HALF_CEIL;

  return value => {
    if (isEmpty(value)) {
      return '';
    }
    let num = new BigNumber(value);
    if (num.isNaN()) {
      console.warn(`Cannot parse value ${value}.`);
      return value;
    }

    // Prefix
    let prefix = '';
    if (num.isNegative()) {
      prefix = options.minus;
      num = num.abs();
    }

    let decimalPrecision = 2;
    let metricPrefix = ''; // k, M, G, ... (https://en.wikipedia.org/wiki/Metric_prefix)
    // Apply precision
    if (options.precision === '0.05' || options.precision === '1M') {
      num = num
        .times(20)
        .integerValue(bnRounding)
        .div(20);
      if (options.precision === '1M') {
        if (num.gte(1000000)) {
          num = num.div(1000000);
          metricPrefix = 'M';
          if (num.gte(100)) {
            decimalPrecision = 0;
          } else if (num.gte(10)) {
            decimalPrecision = 1;
          } else {
            decimalPrecision = 2;
          }
        } else if (num.gte(1000)) {
          decimalPrecision = 0;
        }
      }
    }
    num = num.toFormat(decimalPrecision, bnRounding, bnFormat);

    // Suffix
    let suffix = '';
    if (metricPrefix || options.unit) {
      suffix = options.unitSeparator + metricPrefix + options.unit;
    }

    return `${prefix}${num}${suffix}`;
  };
}

// With price = '1234.5', return "1'234.50".
function getDisplayed(canonicalPrice, format, options) {
  if (isEmpty(canonicalPrice)) {
    return '';
  }

  if (format === 'money') {
    const format = formatMoney(options);
    return format(canonicalPrice);
  }

  BigNumber.config({FORMAT: displayedFormat, DECIMAL_PLACES: 2});

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

  BigNumber.config({FORMAT: parseFormat, DECIMAL_PLACES: 2});

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
