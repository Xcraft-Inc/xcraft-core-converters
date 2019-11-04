const StringBuilder = require('goblin-nabu/lib/string-builder.js');

function getDisplayed(canonicalWeek, format) {
  if (!canonicalWeek || canonicalWeek === '') {
    return '';
  }
  if (typeof canonicalWeek === 'string') {
    let value = canonicalWeek.split('-');
    if (value.length === 2) {
      let year = value[0];
      let week = parseInt(value[1]);
      let string = '';
      switch (format) {
        case 'long':
          string = StringBuilder.join([week, year], ' - ');
          return string;
        case 'short':
        default:
          year = year.substring(2, 4);
          return `${week}-${year}`;
      }
    }
    return '';
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
};
