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
// "5.1" return "5.1"
// "007" return "7"
// "0.300" return "0.3"
// "12.000" return "12"
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
function check(canonical, strict) {
  if (typeof canonical === 'number') {
    return true;
  }
  if (strict) {
    // If strict, reject string and other.
    return false;
  }
  if (canonical === null || canonical === '') {
    return true;
  }
  if (typeof canonical !== 'string') {
    return false;
  }
  const regex = /^[-+]?[0-9]*\.?[0-9]*$/;
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
// Return a native number (canonical values are always native numbers).
function parseEdited(editedNumber, minCanonical, maxCanonical) {
  if (
    !editedNumber ||
    editedNumber === '' ||
    typeof editedNumber !== 'string'
  ) {
    return {value: null, error: null};
  }

  editedNumber = editedNumber + ''; // convert to string
  editedNumber = editedNumber.replace(/ |'|/g, ''); // remove spaces and quotes

  const regex = /^[-+]?[0-9]*\.?[0-9]*$/;
  if (!regex.test(editedNumber)) {
    return {value: null, error: T('Incorrect')};
  }

  let sign = 1;
  if (editedNumber.startsWith('+')) {
    editedNumber = editedNumber.substring(1);
  }
  if (editedNumber.startsWith('-')) {
    editedNumber = editedNumber.substring(1);
    sign = -1;
  }

  const value = parseFloat(
    removeZeros(editedNumber, true).replace(/[']+/g, '')
  );

  BigNumber.config({FORMAT: parseFormat, DECIMAL_PLACES: 9});
  if (new BigNumber(value).isNaN()) {
    return {
      value: null,
      error: StringBuilder.joinWords(`"${value}"`, T('incorrect')),
    };
  }

  const canonical = value * sign;

  if (minCanonical !== undefined && canonical < minCanonical) {
    return {value: minCanonical, error: T('Valeur trop petite')};
  }
  if (maxCanonical !== undefined && canonical > maxCanonical) {
    return {value: maxCanonical, error: T('Valeur trop grande')};
  }

  return {value: canonical, error: null};
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
    let newValue = value + direction * step;
    newValue = Math.round(newValue * 1000) / 1000;

    newValue = Math.max(newValue, min);
    newValue = Math.min(newValue, max);

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
  getDisplayed,
  parseEdited,
  incEdited,
};
