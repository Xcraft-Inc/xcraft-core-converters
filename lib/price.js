const T = require('goblin-nabu/widgets/helpers/t.js');

// https://www.npmjs.com/package/big-number

const {BigNumber} = require('bignumber.js');

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
function check(canonical, strict) {
  const regex = /^[-]?[0-9]*\.?[0-9]?[0-9]?$/;
  if (typeof canonical === 'string' && regex.test(canonical)) {
    return true;
  }
  if (strict) {
    // If strict, reject number and other.
    return false;
  }
  if (canonical === null || canonical === '') {
    return true;
  }
  return typeof canonical === 'number';
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
  thousands: '\u202f', // narrow no-break space
  minus: '\u2212', // minus
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
    groupSeparator: options.thousands === '\u202f' ? options.thousands : "'", // see (*)
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
    suffix: '',
  };
  // (*) The library BigNumber cannot work with a unicode character for the thousands separator.
  // It is therefore replaced by a single apostrophe, which will be replaced by the desired
  // unicode character on output.

  const bnRounding = BigNumber.ROUND_HALF_CEIL;

  return (value) => {
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
      num = num.times(20).integerValue(bnRounding).div(20);
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

    let s = `${prefix}${num}${suffix}`;

    if (options.thousands === '\u202f') {
      s = s.replace(/'/g, '\u202f'); // replace thousands by narrow no-break space, see (*)
    }

    return s;
  };
}

// With price = '1234.5', return "1'234.50".
function getDisplayed(canonicalPrice, format) {
  const precision =
    format && format.startsWith('p-') ? format.substring(2) : null;

  const options = {
    decimal: '.',
    thousands: '\u202f', // narrow no-break space
    minus: '\u2212', // minus
    precision: precision,
    unitSeparator: ' ',
    unit: '',
  };

  const f = formatMoney(options);
  return f(canonicalPrice);
}

//-----------------------------------------------------------------------------
// With editedPrice = '12.666', return '12.67'.
// With editedPrice = '12', return '12.00'.
function parseEdited(editedPrice, minCanonical, maxCanonical) {
  if (!editedPrice || editedPrice === '') {
    return {value: null, error: null};
  }

  BigNumber.config({FORMAT: parseFormat, DECIMAL_PLACES: 2});

  editedPrice = editedPrice.replace(/ |'|/g, ''); // remove spaces and quotes
  editedPrice = editedPrice.replace('−', '-'); // replace minus \u2212 by simple dash
  const x = new BigNumber(editedPrice, 10); // base 10 for rounding to 2 decimals
  if (x.isNaN()) {
    return {value: null, error: T('Montant incorrect')};
  }

  if (
    minCanonical !== undefined &&
    getNumber(x.toString()) < getNumber(minCanonical)
  ) {
    return {value: minCanonical, error: T('Prix trop bas')};
  }
  if (
    maxCanonical !== undefined &&
    getNumber(x.toString()) > getNumber(maxCanonical)
  ) {
    return {value: maxCanonical, error: T('Prix trop élévé')};
  }

  return {value: x.toString(), error: null};
}

function incEdited(
  edited,
  cursorPosition,
  direction,
  step = 1,
  min = -1000000,
  max = 1000000
) {
  let newEdited = null;
  let selectionStart = -1;
  let selectionEnd = -1;

  const {value, error} = this.parseEdited(edited);
  if (!error) {
    let newValue = BigNumber(value || 0).plus(
      getNumber(direction) * getNumber(step)
    );

    if (newValue.isLessThan(getNumber(min))) {
      newValue = BigNumber(min);
    }

    if (newValue.isGreaterThan(getNumber(max))) {
      newValue = BigNumber(max);
    }

    newValue = newValue.toString();

    newEdited = getDisplayed(newValue);
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
  getSortable,
  getDisplayed,
  parseEdited,
  incEdited,
};
