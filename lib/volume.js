// https://www.npmjs.com/package/big-number

const BigNumber = require ('bignumber.js');
import {weight as WeightConverters} from 'xcraft-core-converters';

const parseFormat = {
  decimalSeparator: '.',
  groupSeparator: '',
  groupSize: 0,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
};

const units = {
  km: 1000, // kilomètre
  m: 1, // mètre (canonical unit)
  dm: 0.1, // décimètre
  cm: 0.01, // centimètre
  mm: 0.001, // millimètre
  in: 0.0254, // inch
  ft: 0.3048, // feet
  yd: 0.9144, // yard
  mi: 1609.344, // mile
};

//-----------------------------------------------------------------------------
// Convert a length.
function convertLength (value, inputUnit, outputUnit, decimals) {
  BigNumber.config ({FORMAT: parseFormat, ERRORS: false});
  value = new BigNumber (value);
  value = value.mul (units[inputUnit]); // to canonical unit
  value = value.div (units[outputUnit]); // to output unit
  if (decimals) {
    return value.toFormat (decimals);
  } else {
    return value.toString ();
  }
}

//-----------------------------------------------------------------------------
// Return volumetric weight in kg.
// The unit of canonicalVolume is meter.
// The unit of cm3kg is cm3/kg.
// See https://en.wikipedia.org/wiki/Dimensional_weight
function getCanonicalIATA (canonicalVolume, cm3kg) {
  if (!canonicalVolume) {
    return 0;
  }

  // Detect error in canonical format.
  const p = parseEdited (canonicalVolume);
  if (p.error) {
    return 0;
  }

  BigNumber.config ({FORMAT: parseFormat, ERRORS: false});
  const array = canonicalVolume.split (' ');
  let iata = new BigNumber (1);
  for (let i = 0; i < array.length; i++) {
    iata = iata.mul (convertLength (array[i], 'm', 'cm'));
  }
  return iata.div (cm3kg || 5000).toString ();
}

//-----------------------------------------------------------------------------
// Return volumetric weight for displaying in ui.
// With volume = '1 1 1', return '200.000kg'.
function getDisplayedIATA (canonicalVolume, cm3kg, displayedUnit, decimals) {
  const iata = getCanonicalIATA (canonicalVolume, cm3kg);
  const value = WeightConverters.convertWeight (
    iata,
    'kg',
    displayedUnit || 'kg',
    decimals || 3
  );
  return value + (displayedUnit || 'kg');
}

//-----------------------------------------------------------------------------
// With volume = '0.12 0.13 1.4' and unit = 'cm', return '12 × 13 × 140 cm'.
function getDisplayed (canonicalVolume, displayedUnit) {
  if (!canonicalVolume) {
    return null;
  }

  // Detect error in canonical format.
  const p = parseEdited (canonicalVolume, 'm');
  if (p.error) {
    return `Erreur (${canonicalVolume})`;
  }

  if (!displayedUnit) {
    displayedUnit = 'm';
  }

  const array = canonicalVolume.split (' ');
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const value = convertLength (array[i], 'm', displayedUnit);
    result.push (value.toString ());
  }
  return result.join (' × ') + ' ' + displayedUnit; // U+00D7 (signe multiplication)
}

//-----------------------------------------------------------------------------
// With volume = '1x20 300' and unit = 'cm', return '0.01 0.2 3' (to canonical unit 'm').
// With volume = '10 20 30 cm' and unit = 'in', return '0.1 0.2 0.3' (ignore unit).
// With volume = '12 13 14' and unit = 'm' (canonical format), return the same.
function parseEdited (editedVolume, editedUnit) {
  if (!editedVolume || editedVolume === '') {
    return {value: null, error: null};
  }

  editedVolume = editedVolume.toLowerCase ();

  const array = [];
  let index = -1;
  let exist = false;
  for (let i = 0; i < editedVolume.length; i++) {
    const c = editedVolume[i];
    if ((c >= '0' && c <= '9') || c === '.') {
      if (!exist) {
        array.push ('');
        index++;
      }
      array[index] += c;
      exist = true;
    } else {
      exist = false;
    }
  }

  let unit = '';
  for (let i = editedVolume.length - 1; i >= 0; i--) {
    const c = editedVolume[i];
    if (c >= 'a' && c <= 'z') {
      unit = c + unit;
    } else {
      break;
    }
  }
  if (unit === '') {
    if (!editedUnit) {
      editedUnit = 'm';
    }
    unit = editedUnit;
  }
  const factor = units[unit];
  if (!factor && factor !== 0) {
    return {value: null, error: 'Unité incorrecte'};
  }

  BigNumber.config ({FORMAT: parseFormat, ERRORS: false});
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (new BigNumber (value).isNaN ()) {
      return {value: null, error: 'Incorrect'};
    }
    result.push (convertLength (value, unit, 'm').toString ());
  }

  if (array.length == 0) {
    return null;
  } else if (array.length < 3) {
    return {value: null, error: 'Incomplet'};
  } else if (array.length > 3) {
    return {value: null, error: 'Trop de dimensions'};
  }

  return {value: result.join (' '), error: null};
}

//-----------------------------------------------------------------------------
exports.convertLength = convertLength;
exports.getDisplayed = getDisplayed;
exports.getDisplayedIATA = getDisplayedIATA;
exports.getCanonicalIATA = getCanonicalIATA;
exports.parseEdited = parseEdited;
