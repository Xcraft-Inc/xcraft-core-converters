const StringBuilder = require('goblin-nabu/lib/string-builder.js');
const converter = require('./quarter.js');

function getDisplayed(canonicalQuarter, format) {
  if (!canonicalQuarter || canonicalQuarter === '') {
    return '';
  }
  if (typeof canonicalQuarter === 'string') {
    let value = canonicalQuarter.split('-');
    if (value.length === 2) {
      let year = value[0];
      let quarter = parseInt(value[1]);
      quarter = converter.getDisplayed(quarter, format);
      switch (format) {
        case 'long':
          return StringBuilder.join([quarter, year], ' - ');
        case 'short':
        default:
          year = year.substring(2, 4);
          return StringBuilder.join([quarter, year], '.');
      }
    }
  }
  return '';
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
};
