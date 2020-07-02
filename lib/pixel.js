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
    return canonical.substring(0, len - 2) + ' ' + canonical.substring(len - 2);
  }
  return canonical;
}

//-----------------------------------------------------------------------------
function parseEdited(edited) {
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
  const value = sign * n + 'px';

  return {value, error};
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  getDisplayed,
  parseEdited,
};
