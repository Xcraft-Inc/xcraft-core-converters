const T = require('goblin-nabu/widgets/helpers/t.js');

//-----------------------------------------------------------------------------
function check(canonical) {
  if (typeof canonical !== 'string') {
    return false;
  }
  const regex = /^[-+]?[0-9][0-9]*px$/;
  return regex.test(canonical);
}

//-----------------------------------------------------------------------------
function getDisplayed(canonical) {
  if (typeof canonical === 'string' && canonical.endsWith('px')) {
    const len = canonical.length;
    return canonical.substring(0, len - 2) + ' px';
  }
  return canonical;
}

//-----------------------------------------------------------------------------
function parseEdited(edited, minCanonical, maxCanonical) {
  if (!edited || edited === '') {
    return {value: null, error: null};
  }

  edited = edited.toLowerCase();

  let sign = 1;
  if (edited.startsWith('+')) {
    edited = edited.substring(1);
  }
  if (edited.startsWith('-')) {
    edited = edited.substring(1);
    sign = -1;
  }

  if (edited.endsWith('px')) {
    edited = edited.substring(0, edited.length - 2);
  }

  if (minCanonical && minCanonical.endsWith('px')) {
    minCanonical = minCanonical.substring(0, minCanonical.length - 2);
  }

  if (maxCanonical && maxCanonical.endsWith('px')) {
    maxCanonical = maxCanonical.substring(0, maxCanonical.length - 2);
  }

  let error = null;
  let n = '';
  let skip = false;
  for (let i = 0; i < edited.length; i++) {
    const c = edited[i];
    if (c >= '0' && c <= '9') {
      if (!skip) {
        n += c;
      }
    } else if (c === ' ') {
      // do nothing
    } else if (c === '.') {
      skip = true;
      error = T("N'accepte pas les nombres fractionnaires");
    } else {
      error = T('Incorrect');
    }
  }
  if (n === '') {
    n = '0';
    error = T('Il manque la valeur');
  }
  let value = sign * n;

  if (minCanonical && value < minCanonical) {
    return {value: minCanonical + 'px', error: T('Trop petit')};
  }
  if (maxCanonical && value > maxCanonical) {
    return {value: maxCanonical + 'px', error: T('Trop grand')};
  }

  value += 'px';

  return {value, error};
}

function incEdited(
  edited,
  cursorPosition,
  direction,
  step = 1,
  min = 0,
  max = 10000
) {
  let newEdited = null;
  let selectionStart = -1;
  let selectionEnd = -1;

  const {value, error} = this.parseEdited(edited);
  if (!error) {
    const v = value ? parseInt(value.substring(0, value.length - 2)) : 0;
    let newValue = v + direction * step;
    newValue = Math.round(newValue);

    newValue = Math.max(newValue, min);
    newValue = Math.min(newValue, max);

    newEdited = getDisplayed(newValue + 'px');
    selectionStart = 0;
    selectionEnd = newEdited.length - 3;
  }

  return {
    edited: newEdited,
    selectionStart,
    selectionEnd,
  };
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  getDisplayed,
  parseEdited,
  incEdited,
};
