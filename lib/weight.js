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
  t: 3, // tonne
  q: 2, // quintal
  kg: 0, // kilogramme
  hg: -1, // hectogramme
  dag: -2, // décagramme
  g: -3, // gramme
  dg: -4, // décigramme
  cg: -5, // centigramme
  mg: -6, // milligramme
};

////////////////////////////////////////////////////////////////////////////
// With weight = '12', return '12kg'.
function getDisplayed (weight, format) {
  if (!weight) {
    return null;
  }

  return weight + 'kg';
}

exports.getDisplayed = getDisplayed;
////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////
// With editedWeight = '123 G', return '0.123'.
function parseEdited (editedWeight) {
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
    unit = 'kg';
  }

  BigNumber.config ({FORMAT: parseFormat, DECIMAL_PLACES: 2, ERRORS: false});

  value = value.replace (/ |'|/g, ''); // remove spaces and quotes
  value = new BigNumber (value);
  if (value.isNaN ()) {
    return {value: null, error: 'Incorrect'};
  }

  let power = units[unit];
  if (!power && power !== 0) {
    return {value: null, error: 'Unité incorrecte'};
  }
  value = value.shift (power);

  return {value: value.toString (), error: null};
}

exports.parseEdited = parseEdited;
////////////////////////////////////////////////////////////////////////////
