//? import T from 't';

const shortMonths = [
  //? T('Jan'),
  //? T('Fév'),
  //? T('Mars'),
  //? T('Avr'),
  //? T('Mai'),
  //? T('Juin'),
  //? T('Juil'),
  //? T('Août'),
  //? T('Sept'),
  //? T('Oct'),
  //? T('Nov'),
  //? T('Déc'),
  'Jan',
  'Fév',
  'Mars',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sept',
  'Oct',
  'Nov',
  'Déc',
];

const longMonths = [
  //? T('Janvier'),
  //? T('Février'),
  //? T('Mars'),
  //? T('Avril'),
  //? T('Mai'),
  //? T('Juin'),
  //? T('Juillet'),
  //? T('Août'),
  //? T('Septembre'),
  //? T('Octobre'),
  //? T('Novembre'),
  //? T('Décembre'),
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

function formatShort(value) {
  return shortMonths[value - 1] || '';
}

function formatLong(value) {
  return longMonths[value - 1] || '';
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
    case 'short':
      return formatShort(value);
    case 'long':
      return formatLong(value);
    case 'number':
      return formatNumber(value);
    default:
      throw new Error(`Unknown month format "${format}"`);
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
};
