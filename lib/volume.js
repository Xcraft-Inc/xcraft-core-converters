// With volume = '12x13x14', return same.
function getDisplayed (volume, format) {
  if (!volume) {
    return null;
  }

  return volume;
}

exports.getDisplayed = getDisplayed;

// With editedVolume = '12 13 14', return '12x13x14'.
function parseEdited (editedVolume) {
  if (!editedVolume || editedVolume === '') {
    return {value: null, error: null};
  }

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

  if (array.length == 0) {
    return null;
  } else if (array.length < 3) {
    return {value: null, error: 'Incomplet'};
  } else if (array.length > 3) {
    return {value: null, error: 'Trop de dimensions'};
  }

  const result = array.join (' × '); // U+00D7 (signe multiplication)
  return {value: result, error: null};
}

exports.parseEdited = parseEdited;
