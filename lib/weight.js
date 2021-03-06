const T = require('goblin-nabu/widgets/helpers/t.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

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

const unitsOfWeight = {
  t: 1000, // tonne
  q: 100, // quintal
  kg: 1, // kilogramme (canonical unit)
  hg: 0.1, // hectogramme
  dag: 0.01, // décagramme
  g: 0.001, // gramme
  dg: 0.0001, // décigramme
  cg: 0.00001, // centigramme
  mg: 0.000001, // milligramme
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
// Convert a weight (input -> canonical -> output).
function convertWeight(value, inputUnit, outputUnit, decimals) {
  decimals = !decimals && decimals !== 0 ? 3 : decimals;
  BigNumber.config({
    FORMAT: parseFormat,
    DECIMAL_PLACES: decimals,
  });
  value = new BigNumber(value);
  value = value.times(unitsOfWeight[inputUnit]); // to canonical unit
  value = value.div(unitsOfWeight[outputUnit]); // to output unit
  return removeZeros(value.toFormat(decimals));
}

//-----------------------------------------------------------------------------
// With a canonical weight, return a sortable string.
// Does not handle negative weights!
// 12 return '00000012000000'
// 1.666666667 return '00000001666666'
function getSortable(weight) {
  if (weight < 0) {
    console.log(`Do not support negative weights '${weight}'`);
  } else if (weight > 99999999) {
    console.log(`Do not support overweight '${weight}'`);
  }
  let n = weight * 1000000; // to milligramme
  n = n + ''; // to string
  const i = n.indexOf('.');
  if (i >= 0) {
    n = n.substring(0, i); // strip fractional part if exist
  }
  return pad(n, 14); // up to 99'999'999.999'999 kg
}

//-----------------------------------------------------------------------------
// With weight = '120' and unit = 'g', return '0.12kg'.
function getDisplayed(canonicalWeight, displayedUnit) {
  if (!canonicalWeight) {
    return null;
  }

  // Detect error in canonical format.
  BigNumber.config({FORMAT: parseFormat, DECIMAL_PLACES: 2});
  if (new BigNumber(canonicalWeight).isNaN()) {
    return StringBuilder.joinWords(T('Erreur'), `(${canonicalWeight})`);
  }
  //? const p = parseEdited (canonicalWeight, 'kg');
  //? if (p.error) {
  //?   return `Erreur (${canonicalWeight})`;
  //? }

  if (!displayedUnit) {
    displayedUnit = 'kg';
  }

  const value = convertWeight(canonicalWeight, 'kg', displayedUnit);
  return value + displayedUnit;
}

//-----------------------------------------------------------------------------
// With weight = '123' and unit = 'g', return '0.123' (to canonical unit 'kg').
// With weight = '2t' and unit = 'mg', return '2000' (ignore unit).
// With weight = '12' and unit = 'kg' (canonical format), return the same.
function parseEdited(editedWeight, editedUnit) {
  if (!editedWeight || editedWeight === '') {
    return {value: null, error: null};
  }

  editedWeight = editedWeight.toLowerCase();

  let value = '';
  let unit = '';
  let valuePart = true;
  for (let i = 0; i < editedWeight.length; i++) {
    const c = editedWeight[i];
    if ((c >= '0' && c <= '9') || c === '.') {
      if (!valuePart) {
        return {value: null, error: 'Incorrect'};
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
      editedUnit = 'kg';
    }
    unit = editedUnit;
  }
  if (!unitsOfWeight[unit]) {
    return {
      value: null,
      error: StringBuilder.joinWords(T('Unité'), `"${unit}"`, T('incorrecte')),
    };
  }

  BigNumber.config({FORMAT: parseFormat, DECIMAL_PLACES: 9});
  if (new BigNumber(value).isNaN()) {
    return {
      value: null,
      error: StringBuilder.joinWords(`"${value}"`, T('incorrect')),
    };
  }

  value = convertWeight(value, unit, 'kg');
  return {value: value, error: null};
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  convertWeight,
  getSortable,
  getDisplayed,
  parseEdited,
};
