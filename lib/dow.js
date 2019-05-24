const T = require('goblin-nabu/widgets/helpers/t.js');

const shortCapitalizeDowsDescription = 'Jour de la semaine en minuscule';
const shortCapitalizeDows = [
  //- T('dow|Lun', shortCapitalizeDowsDescription),
  //- T('dow|Mar', shortCapitalizeDowsDescription),
  //- T('dow|Mer', shortCapitalizeDowsDescription),
  //- T('dow|Jeu', shortCapitalizeDowsDescription),
  //- T('dow|Ven', shortCapitalizeDowsDescription),
  //- T('dow|Sam', shortCapitalizeDowsDescription),
  //- T('dow|Dim', shortCapitalizeDowsDescription),
  T('dow|Lun'),
  T('dow|Mar'),
  T('dow|Mer'),
  T('dow|Jeu'),
  T('dow|Ven'),
  T('dow|Sam'),
  T('dow|Dim'),
];

const shortLowerDowsDescription = 'Jour de la semaine en minuscule';
const shortLowerDows = [
  //- T('dow|lun', shortLowerDowsDescription),
  //- T('dow|mar', shortLowerDowsDescription),
  //- T('dow|mer', shortLowerDowsDescription),
  //- T('dow|jeu', shortLowerDowsDescription),
  //- T('dow|ven', shortLowerDowsDescription),
  //- T('dow|sam', shortLowerDowsDescription),
  //- T('dow|dim', shortLowerDowsDescription),
  T('dow|lun'),
  T('dow|mar'),
  T('dow|mer'),
  T('dow|jeu'),
  T('dow|ven'),
  T('dow|sam'),
  T('dow|dim'),
];

const longCapitalizeDowsDescription = 'Jour de la semaine en minuscule';
const longCapitalizeDows = [
  //- T('dow|Lundi', longCapitalizeDowsDescription),
  //- T('dow|Mardi', longCapitalizeDowsDescription),
  //- T('dow|Mercredi', longCapitalizeDowsDescription),
  //- T('dow|Jeudi', longCapitalizeDowsDescription),
  //- T('dow|Vendredi', longCapitalizeDowsDescription),
  //- T('dow|Samedi', longCapitalizeDowsDescription),
  //- T('dow|Dimanche', longCapitalizeDowsDescription),
  T('dow|Lundi'),
  T('dow|Mardi'),
  T('dow|Mercredi'),
  T('dow|Jeudi'),
  T('dow|Vendredi'),
  T('dow|Samedi'),
  T('dow|Dimanche'),
];

const longLowerDowsDescription = 'Jour de la semaine en minuscule';
const longLowerDows = [
  //- T('dow|lundi', longLowerDowsDescription),
  //- T('dow|mardi', longLowerDowsDescription),
  //- T('dow|mercredi', longLowerDowsDescription),
  //- T('dow|jeudi', longLowerDowsDescription),
  //- T('dow|vendredi', longLowerDowsDescription),
  //- T('dow|samedi', longLowerDowsDescription),
  //- T('dow|dimanche', longLowerDowsDescription),
  T('dow|lundi'),
  T('dow|mardi'),
  T('dow|mercredi'),
  T('dow|jeudi'),
  T('dow|vendredi'),
  T('dow|samedi'),
  T('dow|dimanche'),
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
