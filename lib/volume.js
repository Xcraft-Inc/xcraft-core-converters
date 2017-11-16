// https://github.com/MikeMcl/bignumber.js/

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
  km: 5, // kilomètre
  m: 2, // kilogramme
  dm: 1, // décimètre
  cm: 0, // centimètre (default unit)
  mm: -1, // millimètre
};

////////////////////////////////////////////////////////////////////////////
// With volume = '12 13 14', return '12 × 13 × 14 cm'.
function getDisplayed (volume, format) {
  if (!volume) {
    return null;
  }

  const array = volume.split (' ');
  if (array.length !== 3) {
    return null;
  }

  return array.join (' × ') + ' cm'; // U+00D7 (signe multiplication)
}

exports.getDisplayed = getDisplayed;
////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////
// With editedVolume = '1x0.2 0.3m', return '100 20 30'.
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
    unit = 'cm';
  }

  let power = units[unit];
  if (!power && power !== 0) {
    return {value: null, error: 'Unité incorrecte'};
  }

  const result = [];
  for (let i = 0; i < array.length; i++) {
    let value = array[i];
    value = value.replace (/ |'|/g, ''); // remove spaces and quotes
    value = new BigNumber (value);
    if (value.isNaN ()) {
      return {value: null, error: 'Incorrect'};
    }
    result.push (value.shift (power).toString ());
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
////////////////////////////////////////////////////////////////////////////
