const T = require('goblin-nabu/widgets/helpers/t.js');

const longSemesters = [T('Premier semestre'), T('Deuxième semestre')];

function formatLong(value) {
  return longSemesters[value - 1] || '';
}

function formatNumber(value) {
  if (value < 1 || value > 12) {
    return '';
  } else {
    return value + '';
  }
}

//-----------------------------------------------------------------------------

function getDisplayed(canonicalMonth, format) {
  if (!canonicalMonth) {
    return '';
  }

  format = format || 'long'; // default format

  let value = canonicalMonth;
  if (typeof canonicalMonth === 'string') {
    const value = parseInt(canonicalMonth);
    if (isNaN(value)) {
      return '';
    }
  }

  switch (format) {
    case 'long':
      return formatLong(value);
    case 'number':
      return formatNumber(value);
    default:
      throw new Error(`Unknown semester format "${format}"`);
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
};
