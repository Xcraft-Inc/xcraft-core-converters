const T = require('goblin-nabu/widgets/helpers/t.js');

//-----------------------------------------------------------------------------
function check(canonical) {
  return typeof canonical === 'boolean';
}

//-----------------------------------------------------------------------------
function getDisplayed(canonicalBool, format) {
  if (canonicalBool === undefined) {
    return null;
  }

  switch (format) {
    case 'brut':
      return canonicalBool ? T('True') : T('False');
    default:
      return canonicalBool ? T('Oui') : T('Non');
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  getDisplayed,
};
