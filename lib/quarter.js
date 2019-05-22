const T = require('goblin-nabu/widgets/helpers/t.js');

const quarters = [T('Q1'), T('Q2'), T('Q3'), T('Q4')];

function formatShort(value) {
  return quarters[value - 1] || '';
}

//-----------------------------------------------------------------------------

function getDisplayed(canonicalMonth) {
  if (!canonicalMonth) {
    return '';
  }

  let value = canonicalMonth;
  if (typeof canonicalMonth === 'string') {
    const value = parseInt(canonicalMonth);
    if (isNaN(value)) {
      return '';
    }
  }

  return formatShort(value);
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
};
