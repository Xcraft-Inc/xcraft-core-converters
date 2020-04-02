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
    case 'yes-no':
      return canonicalBool ? T('Oui') : T('Non');
    case 'localized':
      return canonicalBool ? T('Vrai') : T('Faux');
    default:
      return canonicalBool ? T('True') : T('False');
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  getDisplayed,
};
