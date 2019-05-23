const T = require('goblin-nabu/widgets/helpers/t.js');

const shortCapitalizeDowsDescription = 'Jour de la semaine en minuscule';
const shortCapitalizeDows = [
  T('dow|short|capitalize|Lun', shortCapitalizeDowsDescription),
  T('dow|short|capitalize|Mar', shortCapitalizeDowsDescription),
  T('dow|short|capitalize|Mer', shortCapitalizeDowsDescription),
  T('dow|short|capitalize|Jeu', shortCapitalizeDowsDescription),
  T('dow|short|capitalize|Ven', shortCapitalizeDowsDescription),
  T('dow|short|capitalize|Sam', shortCapitalizeDowsDescription),
  T('dow|short|capitalize|Dim', shortCapitalizeDowsDescription),
];

const shortLowerDowsDescription = 'Jour de la semaine en minuscule';
const shortLowerDows = [
  T('dow|short|lower|lun', shortLowerDowsDescription),
  T('dow|short|lower|mar', shortLowerDowsDescription),
  T('dow|short|lower|mer', shortLowerDowsDescription),
  T('dow|short|lower|jeu', shortLowerDowsDescription),
  T('dow|short|lower|ven', shortLowerDowsDescription),
  T('dow|short|lower|sam', shortLowerDowsDescription),
  T('dow|short|lower|dim', shortLowerDowsDescription),
];

const longCapitalizeDowsDescription = 'Jour de la semaine en minuscule';
const longCapitalizeDows = [
  T('dow|long|capitalize|Lundi', longCapitalizeDowsDescription),
  T('dow|long|capitalize|Mardi', longCapitalizeDowsDescription),
  T('dow|long|capitalize|Mercredi', longCapitalizeDowsDescription),
  T('dow|long|capitalize|Jeudi', longCapitalizeDowsDescription),
  T('dow|long|capitalize|Vendredi', longCapitalizeDowsDescription),
  T('dow|long|capitalize|Samedi', longCapitalizeDowsDescription),
  T('dow|long|capitalize|Dimanche', longCapitalizeDowsDescription),
];

const longLowerDowsDescription = 'Jour de la semaine en minuscule';
const longLowerDows = [
  T('dow|long|lower|lundi', longLowerDowsDescription),
  T('dow|long|lower|mardi', longLowerDowsDescription),
  T('dow|long|lower|mercredi', longLowerDowsDescription),
  T('dow|long|lower|jeudi', longLowerDowsDescription),
  T('dow|long|lower|vendredi', longLowerDowsDescription),
  T('dow|long|lower|samedi', longLowerDowsDescription),
  T('dow|long|lower|dimanche', longLowerDowsDescription),
];

//-----------------------------------------------------------------------------

// canonicalDow: 1..7
function getDisplayed(canonicalDow, format) {
  if (!canonicalDow) {
    return '';
  }

  format = format || 'long'; // default format

  let value = canonicalDow;
  if (typeof canonicalDow === 'string') {
    const value = parseInt(canonicalDow);
    if (isNaN(value)) {
      return '';
    }
  }

  switch (format) {
    case 'short':
      return shortCapitalizeDows[value - 1] || '';
    case 'short-lower':
      return shortLowerDows[value - 1] || '';
    case 'long':
      return longCapitalizeDows[value - 1] || '';
    case 'long-lower':
      return longLowerDows[value - 1] || '';
    case 'number':
      if (value < 1 || value > 7) {
        return '';
      } else {
        return value + '';
      }
    default:
      throw new Error(`Unknown month format "${format}"`);
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
};
