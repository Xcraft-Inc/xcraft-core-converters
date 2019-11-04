const StringBuilder = require('goblin-nabu/lib/string-builder.js');
const converter = require('./month.js');

function getDisplayed(canonicalMonth, format) {
  if (!canonicalMonth || canonicalMonth === '') {
    return '';
  }
  let value = canonicalMonth.split('-');
  if (value.length === 2) {
    let year = value[0];
    let month = parseInt(value[1]);
    switch (format) {
      case 'long':
        month = converter.getDisplayed(month, format);
        return StringBuilder.join([month, year], ' - ');
      case 'short':
      default:
        year = year.substring(2, 4);
        return `${month}.${year}`;
    }
  }
  return '';
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
};
