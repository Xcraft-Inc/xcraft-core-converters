// https://www.npmjs.com/package/big-number

const BigNumber = require ('bignumber.js');

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
// Convert a weight (input -> canonical -> output).
function convertWeight (value, inputUnit, outputUnit, decimals) {
  BigNumber.config ({FORMAT: parseFormat, ERRORS: false});
  value = new BigNumber (value);
  value = value.mul (unitsOfWeight[inputUnit]); // to canonical unit
  value = value.div (unitsOfWeight[outputUnit]); // to output unit
  let result = value.toFormat (decimals || 3);
  if (result.indexOf ('.') !== -1) {
    while (result[result.length - 1] === '0') {
      result = result.substring (0, result.length - 1);
    }
  }
  return result;
}

//-----------------------------------------------------------------------------
// With weight = '120' and unit = 'g', return '0.12kg'.
function getDisplayed (canonicalWeight, displayedUnit) {
  if (!canonicalWeight) {
    return null;
  }

  // Detect error in canonical format.
  const p = parseEdited (canonicalWeight, 'kg');
  if (p.error) {
    return `Erreur (${canonicalWeight})`;
  }

  if (!displayedUnit) {
    displayedUnit = 'kg';
  }

  const value = convertWeight (canonicalWeight, 'kg', displayedUnit);
  return value + displayedUnit;
}
//function getDisplayedDebug (canonicalWeight, displayedUnit) {
//  const result = getDisplayed2 (canonicalWeight, displayedUnit);
//  console.log (
//    `Converters.getDisplayed: canonicalWeight=${canonicalWeight} displayedUnit=${displayedUnit} result=${result}`
//  );
//  return result;
//}

//-----------------------------------------------------------------------------
// With weight = '123' and unit = 'g', return '0.123' (to canonical unit 'kg').
// With weight = '2t' and unit = 'mg', return '1230' (ignore unit).
// With weight = '12' and unit = 'kg' (canonical format), return the same.
function parseEdited (editedWeight, editedUnit) {
  if (!editedWeight || editedWeight === '') {
    return {value: null, error: null};
  }

  editedWeight = editedWeight.toLowerCase ();

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
    return {value: null, error: `Unité "${unit}" incorrecte`};
  }

  BigNumber.config ({FORMAT: parseFormat, ERRORS: false});
  if (new BigNumber (value).isNaN ()) {
    return {value: null, error: `"${value}" incorrect`};
  }

  value = convertWeight (value, unit, 'kg');
  return {value: value, error: null};
}
//function parseEditedDebug (editedWeight, editedUnit) {
//  const result = parseEdited2 (editedWeight, editedUnit);
//  console.log (
//    `Converters.parseEdited: editedWeight=${editedWeight} editedUnit=${editedUnit} value=${result.value} error=${result.error}`
//  );
//  return result;
//}

//-----------------------------------------------------------------------------
exports.convertWeight = convertWeight;
exports.getDisplayed = getDisplayed;
exports.parseEdited = parseEdited;
