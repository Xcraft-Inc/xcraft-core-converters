// https://www.npmjs.com/package/big-number

const BigNumber = require('bignumber.js');
const {weight} = require('xcraft-core-converters');
const WeightConverters = weight;

const parseFormat = {
  decimalSeparator: '.',
  groupSeparator: '',
  groupSize: 0,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
};

const unitsOfLength = {
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

const unitsOfVolume = {
  km3: 1000000000, // kilomètre
  m3: 1, // mètre (canonical unit)
  dm3: 0.001, // décimètre
  l: 0.001, // litre
  cm3: 0.000001, // centimètre
  mm3: 0.000000001, // millimètre
  in3: 0.000016387064, // inch
  ft3: 0.028316846592, // feet
  yd3: 0.764554857984, // yard
  mi3: 4168181825.44, // mile
};

//-----------------------------------------------------------------------------
// Convert a length (input -> canonical -> output).
function convertLength(value, inputUnit, outputUnit, decimals) {
  BigNumber.config({FORMAT: parseFormat, ERRORS: false});
  value = new BigNumber(value);
  value = value.mul(unitsOfLength[inputUnit]); // to canonical unit
  value = value.div(unitsOfLength[outputUnit]); // to output unit
  if (decimals) {
    return value.toFormat(decimals);
  } else {
    return value.toString();
  }
}

function convertVolume(value, inputUnit, outputUnit, decimals) {
  BigNumber.config({FORMAT: parseFormat, ERRORS: false});
  value = new BigNumber(value);
  value = value.mul(unitsOfVolume[inputUnit]); // to canonical unit
  value = value.div(unitsOfVolume[outputUnit]); // to output unit
  if (decimals) {
    return value.toFormat(decimals);
  } else {
    return value.toString();
  }
}

function getUnits(unit) {
  if (!unit) {
    unit = 'm;m3';
  }
  const units = unit.split(';');

  let lengthUnit = 'm';
  let volumeUnit = 'm3';

  if (units.length === 1) {
    lengthUnit = units[0];
    volumeUnit = units[0];
    if (!unitsOfLength[lengthUnit] && !unitsOfVolume[volumeUnit]) {
      throw new Error(`Invalid unit ${lengthUnit}`);
    }
  } else if (units.length === 2) {
    // 'cm;dm3' -> dimensions and volume
    lengthUnit = units[0];
    volumeUnit = units[1];
    if (!unitsOfLength[lengthUnit]) {
      throw new Error(`Invalid length units ${lengthUnit}`);
    }
    if (!unitsOfVolume[volumeUnit]) {
      throw new Error(`Invalid volume units ${volumeUnit}`);
    }
  } else {
    throw new Error(`Invalid units ${displayedUnit}`);
  }

  return {lengthUnit, volumeUnit};
}

//-----------------------------------------------------------------------------
// Return the dimensional weight in kg.
// The unit of canonicalVolume is meter.
// The unit of cm3kg is cm3/kg.
// See https://en.wikipedia.org/wiki/Dimensional_weight
function getCanonicalIATA(canonicalVolume, cm3kg) {
  if (!canonicalVolume) {
    return 0;
  }

  // Detect error in canonical format.
  const p = parseEdited(canonicalVolume);
  if (p.error) {
    return 0;
  }

  BigNumber.config({FORMAT: parseFormat, ERRORS: false});
  const array = canonicalVolume.split(' ');
  let iata = new BigNumber(1);
  if (array.length === 1) {
    iata = new BigNumber(convertVolume(array[0], 'm3', 'cm3'));
  } else {
    for (let i = 0; i < array.length; i++) {
      iata = iata.mul(convertLength(array[i], 'm', 'cm'));
    }
  }
  return iata.div(cm3kg || 5000).toString();
}

//-----------------------------------------------------------------------------
// Return the dimensional weight for displaying in ui.
// With volume = '1 1 1' (1m3), return '200.000kg'.
function getDisplayedIATA(canonicalVolume, cm3kg, displayedUnit, decimals) {
  const iata = getCanonicalIATA(canonicalVolume, cm3kg);
  const value = WeightConverters.convertWeight(
    iata,
    'kg',
    displayedUnit || 'kg',
    decimals || 3
  );
  return value + (displayedUnit || 'kg');
}

//-----------------------------------------------------------------------------
// With volume = '0.12 0.13 1.4' and unit = 'cm', return '12 × 13 × 140 cm'.
// With volume = '0.012' and unit = 'dm3', return '12dm3'.
function getDisplayed(canonicalVolume, displayedUnit) {
  if (!canonicalVolume) {
    return null;
  }

  // Detect error in canonical format.
  const p = parseEdited(canonicalVolume, 'm;m3');
  if (p.error) {
    return `Erreur (${canonicalVolume})`;
  }

  const units = getUnits(displayedUnit);
  const array = canonicalVolume.split(' ');
  if (array.length === 1) {
    // One value -> volume.
    const value = convertVolume(array[0], 'm3', units.volumeUnit);
    return value + units.volumeUnit;
  } else {
    // Three values -> dimensions.
    const result = [];
    for (let i = 0; i < array.length; i++) {
      const value = convertLength(array[i], 'm', units.lengthUnit);
      result.push(value.toString());
    }
    return result.join(' × ') + ' ' + units.lengthUnit; // U+00D7 (signe multiplication)
  }
}

//-----------------------------------------------------------------------------
// With volume = '1x20 300' and unit = 'cm', return '0.01 0.2 3' (to canonical unit 'm').
// With volume = '10 20 30 cm' and unit = 'in', return '0.1 0.2 0.3' (ignore unit).
// With volume = '12 13 14' and unit = 'm' (canonical format), return the same.
function parseEdited(editedVolume, defaultUnit) {
  if (!editedVolume || editedVolume === '') {
    return {value: null, error: null};
  }

  // Transform '1 2 3 M' to '1 2 3 m'.
  editedVolume = editedVolume.toLowerCase();

  // If line is ended by 'a-z|3', suppress the last '3'.
  // By example '123dm3' -> '123dm' with endedBy3 = true.
  const endedBy3 =
    editedVolume.length >= 2 &&
    editedVolume[editedVolume.length - 1] === '3' &&
    editedVolume[editedVolume.length - 2] >= 'a' &&
    editedVolume[editedVolume.length - 2] <= 'z';
  if (endedBy3) {
    editedVolume = editedVolume.substring(0, editedVolume.length - 1); // suppress last '3'
  }

  // Scan line and extract all values.
  const array = [];
  let index = -1;
  let exist = false;
  for (let i = 0; i < editedVolume.length; i++) {
    const c = editedVolume[i];
    if ((c >= '0' && c <= '9') || c === '.' || c === '-' || c === 'e') {
      // Accept numbers '123.4' and '12e-9'.
      if (!exist) {
        array.push('');
        index++;
      }
      array[index] += c;
      exist = true;
    } else {
      exist = false;
    }
  }

  if (array.length === 0) {
    return {value: null, error: null};
  }

  // Check all values. By example, reject '12.3.4'.
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (new BigNumber(value).isNaN()) {
      return {value: null, error: `"${value}" incorrect`};
    }
  }

  // Scan end of line and extract editedUnit.
  let editedUnit = '';
  for (let i = editedVolume.length - 1; i >= 0; i--) {
    const c = editedVolume[i];
    if (c >= 'a' && c <= 'z') {
      editedUnit = c + editedUnit;
    } else {
      break;
    }
  }
  if (editedUnit !== '' && endedBy3) {
    editedUnit += '3';
  }

  // Determined units for volume or dimensions. Priority to editedUnit.
  let lengthUnit = 'm';
  let volumeUnit = 'm3';
  let isEditedLengthUnit = false;
  let isEditedVolumeUnit = false;
  if (editedUnit === '') {
    // If no unit is in edited string, use specified.
    if (defaultUnit) {
      const units = getUnits(defaultUnit);
      lengthUnit = units.lengthUnit;
      volumeUnit = units.volumeUnit;
    }
  } else {
    // Use unit founded in edited string.
    if (unitsOfVolume[editedUnit]) {
      volumeUnit = editedUnit;
      isEditedVolumeUnit = true;
    } else if (unitsOfLength[editedUnit]) {
      lengthUnit = editedUnit;
      isEditedLengthUnit = true;
    } else {
      return {value: null, error: `Unité "${editedUnit}" incorrecte`};
    }
  }

  // Build canonical value(s).
  if (isEditedVolumeUnit || array.length === 1) {
    // One value -> volume in 'm3'.
    if (isEditedLengthUnit) {
      return {value: null, error: `Unité "${lengthUnit}" incorrecte`};
    }
    const value = convertVolume(array[0], volumeUnit, 'm3');

    if (array.length > 1) {
      return {value: value, error: `Trop de dimensions (${array[1]})`};
    }

    return {value: value, error: null};
  } else {
    // Three values -> dimensions in 'm'.
    if (isEditedVolumeUnit) {
      return {value: null, error: `Unité "${volumeUnit}" incorrecte`};
    }
    if (array.length < 3) {
      return {value: null, error: 'Incomplet'};
    }

    const result = [];
    for (let i = 0; i < Math.min(array.length, 3); i++) {
      result.push(convertLength(array[i], lengthUnit, 'm'));
    }
    const value = result.join(' ');

    if (array.length > 3) {
      return {value: value, error: `Trop de dimensions (${array[3]})`};
    }

    return {value: value, error: null};
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  convertLength,
  getDisplayed,
  getDisplayedIATA,
  getCanonicalIATA,
  parseEdited,
};
