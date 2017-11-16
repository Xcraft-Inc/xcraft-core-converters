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

const units = {
  km: 100000, // kilomètre
  m: 100, // mètre
  dm: 10, // décimètre
  cm: 1, // centimètre (default unit)
  mm: 0.1, // millimètre
  in: 2.54, // inch
  ft: 30.48, // feet
  yd: 91.44, // yard
  mi: 160934.4, // mile
};

//-----------------------------------------------------------------------------
function getIATA (canonicalVolume, mass) {
  if (!canonicalVolume) {
    return null;
  }

  // Detect error in canonical format.
  const p = parseEdited (canonicalVolume);
  if (p.error) {
    return '0';
  }

  BigNumber.config ({FORMAT: parseFormat, ERRORS: false});

  const array = canonicalVolume.split (' ');
  let iata = new BigNumber (1);
  for (let i = 0; i < array.length; i++) {
    const value = new BigNumber (array[i]);
    iata = iata.mul (value);
  }
  return iata.div (mass || 6000).toString ();
}

exports.getIATA = getIATA;
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
function getDisplayedIATA (canonicalVolume) {
  BigNumber.config ({FORMAT: parseFormat, ERRORS: false});
  const iata = new BigNumber (getIATA (canonicalVolume));
  return iata.toFormat (3) + 'kg';
}

exports.getDisplayedIATA = getDisplayedIATA;
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// With volume = '12 13 14', return '12 × 13 × 14 cm'.
function getDisplayed (canonicalVolume, format) {
  if (!canonicalVolume) {
    return null;
  }

  // Detect error in canonical format.
  const p = parseEdited (canonicalVolume);
  if (p.error) {
    return `Erreur (${canonicalVolume})`;
  }

  const array = canonicalVolume.split (' ');
  return array.join (' × ') + ' cm'; // U+00D7 (signe multiplication)
}

exports.getDisplayed = getDisplayed;
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// With editedVolume = '1x0.2 0.3m', return '100 20 30'.
// With editedVolume = '12 13 14' (canonical format), return the same.
function parseEdited (editedVolume) {
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
    unit = 'cm'; // default unit
  }

  let factor = units[unit];
  if (!factor && factor !== 0) {
    return {value: null, error: 'Unité incorrecte'};
  }

  BigNumber.config ({FORMAT: parseFormat, ERRORS: false});
  const result = [];
  for (let i = 0; i < array.length; i++) {
    let value = array[i];
    value = value.replace (/ |'|/g, ''); // remove spaces and quotes
    value = new BigNumber (value);
    if (value.isNaN ()) {
      return {value: null, error: 'Incorrect'};
    }
    result.push (value.mul (factor).toString ());
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

exports.parseEdited = parseEdited;
//-----------------------------------------------------------------------------
