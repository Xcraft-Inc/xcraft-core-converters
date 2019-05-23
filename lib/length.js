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

const unitsOfLength = {
  km: 1000, // km
  m: 1, // m (canonical unit)
  dm: 0.1, // dm
  cm: 0.01, // cm
  mm: 0.001, // mm
};

//-----------------------------------------------------------------------------
// Removes non-significant zeros.
// 5.1 return 5.1
// 0.300 return 0.3
// 12.000 return 12
function removeZeros(value) {
  if (value.indexOf('.') !== -1) {
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
  if (typeof canonical !== 'string') {
    return false;
  }
  const regex = /^[0-9]*\.?[0-9]*$/g;
  return regex.test(canonical);
}

//-----------------------------------------------------------------------------
// Convert a length (input -> canonical -> output).
function convertLength(value, inputUnit, outputUnit, decimals) {
  BigNumber.config({
    FORMAT: parseFormat,
    DECIMAL_PLACES: decimals || 3,
  });
  value = new BigNumber(value);
  value = value.times(unitsOfLength[inputUnit]); // to canonical unit
  value = value.div(unitsOfLength[outputUnit]); // to output unit
  return removeZeros(value.toFormat(decimals || 3));
}

//-----------------------------------------------------------------------------
// With length = '12' and unit = 'km', return '12000m'.
function getDisplayed(canonicalLength, displayedUnit) {
  if (!canonicalLength) {
    return null;
  }

  // Detect error in canonical format.
  BigNumber.config({FORMAT: parseFormat, DECIMAL_PLACES: 3});
  if (new BigNumber(canonicalLength).isNaN()) {
    return `Erreur (${canonicalLength})`;
  }

  if (!displayedUnit) {
    displayedUnit = 'm';
  }

  const value = convertLength(canonicalLength, 'm', displayedUnit);
  return value + displayedUnit;
}

//-----------------------------------------------------------------------------
// With length = '123' and unit = 'cm', return '1.23' (to canonical unit 'm').
// With length = '12' and unit = 'm' (canonical format), return the same.
// With length = '2km' and unit = 'mm', return '2000' (ignore unit).
function parseEdited(editedLength, editedUnit) {
  if (!editedLength || editedLength === '') {
    return {value: null, error: null};
  }

  editedLength = editedLength.toLowerCase();

  let value = '';
  let unit = '';
  let valuePart = true;
  for (let i = 0; i < editedLength.length; i++) {
    const c = editedLength[i];
    if ((c >= '0' && c <= '9') || c === '.') {
      if (!valuePart) {
        return {value: null, error: T('length|Incorrect')};
      }
      value += c;
    } else {
      valuePart = false;
      if (c !== ' ') {
        unit += c;
      }
    }
  }
  if (value === '') {
    value = '0';
  }

  if (unit === '') {
    if (!editedUnit) {
      editedUnit = 'm';
    }
    unit = editedUnit;
  }
  if (!unitsOfLength[unit]) {
    return {
      value: null,
      error: StringBuilder.joinWords([
        T('Unité'),
        `"${unit}"`,
        T('incorrecte'),
      ]),
    };
  }

  BigNumber.config({FORMAT: parseFormat, DECIMAL_PLACES: 9});
  if (new BigNumber(value).isNaN()) {
    return {
      value: null,
      error: StringBuilder.joinWords([value, T('incorrect')]),
    };
  }

  value = convertLength(value, unit, 'm');
  return {value: value, error: null};
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  convertLength,
  getDisplayed,
  parseEdited,
};
