function isDouble (text) {
  let pointCount = 0;
  for (var c of text) {
    if (c >= '0' && c <= '9') {
    } else if (c === '.') {
      pointCount++;
      if (pointCount > 1) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
}

// With weight = '12kg', return same.
function getDisplayed (weight, format) {
  if (!weight) {
    return null;
  }

  return weight;
}

exports.getDisplayed = getDisplayed;

// With editedWeight = '12 Kg', return '12kg'.
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

  if (!isDouble (value)) {
    return {value: null, error: 'Incorrect'};
  }

  if (unit !== 't' && unit !== 'kg' && unit !== 'g' && unit !== 'mg') {
    return {value: null, error: 'Unité incorrecte'};
  }

  const result = value + unit;
  return {value: result, error: null};
}

exports.parseEdited = parseEdited;
