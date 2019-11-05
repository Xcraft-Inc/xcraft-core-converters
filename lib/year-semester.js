const StringBuilder = require('goblin-nabu/lib/string-builder.js');
const converter = require('./semester.js');

function getDisplayed(canonicalSemester, format) {
  if (!canonicalSemester || canonicalSemester === '') {
    return '';
  }
  if (typeof canonicalSemester === 'string') {
    let value = canonicalSemester.split('-');
    if (value.length === 2) {
      let year = value[0];
      let semester = parseInt(value[1]);
      let string = '';
      switch (format) {
        case 'long':
          semester = converter.getDisplayed(value[1], format);
          string = StringBuilder.join([semester, year], ' - ');
          return string;
        case 'short':
        default:
          year = year.substring(2, 4);
          return `${semester}-${year}`;
      }
    }
  }
  return '';
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
};
