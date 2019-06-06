const T = require('goblin-nabu/widgets/helpers/t.js');

const shortCapitalizeDowsDescription =
  'Nom court du jour de la semaine (généralement avec 3 lettres), avec la première lettre en majuscule';
const shortCapitalizeDows = [
  //- T('dow|short|monday|Lun', shortCapitalizeDowsDescription),
  //- T('dow|short|tuesday|Mar', shortCapitalizeDowsDescription),
  //- T('dow|short|wednesday|Mer', shortCapitalizeDowsDescription),
  //- T('dow|short|thursday|Jeu', shortCapitalizeDowsDescription),
  //- T('dow|short|friday|Ven', shortCapitalizeDowsDescription),
  //- T('dow|short|saturday|Sam', shortCapitalizeDowsDescription),
  //- T('dow|short|sunday|Dim', shortCapitalizeDowsDescription),
  T('dow|short|monday|Lun'),
  T('dow|short|tuesday|Mar'),
  T('dow|short|wednesday|Mer'),
  T('dow|short|thursday|Jeu'),
  T('dow|short|friday|Ven'),
  T('dow|short|saturday|Sam'),
  T('dow|short|sunday|Dim'),
];

const shortLowerDowsDescription =
  'Nom court du jour de la semaine (généralement avec 3 lettres), tout en minuscules';
const shortLowerDows = [
  //- T('dow|short|monday|lun', shortLowerDowsDescription),
  //- T('dow|short|tuesday|mar', shortLowerDowsDescription),
  //- T('dow|short|wednesday|mer', shortLowerDowsDescription),
  //- T('dow|short|thursday|jeu', shortLowerDowsDescription),
  //- T('dow|short|friday|ven', shortLowerDowsDescription),
  //- T('dow|short|saturday|sam', shortLowerDowsDescription),
  //- T('dow|short|sunday|dim', shortLowerDowsDescription),
  T('dow|short|monday|lun'),
  T('dow|short|tuesday|mar'),
  T('dow|short|wednesday|mer'),
  T('dow|short|thursday|jeu'),
  T('dow|short|friday|ven'),
  T('dow|short|saturday|sam'),
  T('dow|short|sunday|dim'),
];

const longCapitalizeDowsDescription =
  'Nom complet du jour de la semaine, avec la première lettre en majuscule';
const longCapitalizeDows = [
  //- T('dow|long|monday|Lundi', longCapitalizeDowsDescription),
  //- T('dow|long|tuesday|Mardi', longCapitalizeDowsDescription),
  //- T('dow|long|wednesday|Mercredi', longCapitalizeDowsDescription),
  //- T('dow|long|thursday|Jeudi', longCapitalizeDowsDescription),
  //- T('dow|long|friday|Vendredi', longCapitalizeDowsDescription),
  //- T('dow|long|saturday|Samedi', longCapitalizeDowsDescription),
  //- T('dow|long|sunday|Dimanche', longCapitalizeDowsDescription),
  T('dow|long|monday|Lundi'),
  T('dow|long|tuesday|Mardi'),
  T('dow|long|wednesday|Mercredi'),
  T('dow|long|thursday|Jeudi'),
  T('dow|long|friday|Vendredi'),
  T('dow|long|saturday|Samedi'),
  T('dow|long|sunday|Dimanche'),
];

const longLowerDowsDescription =
  'Nom complet du jour de la semaine, tout en minuscules';
const longLowerDows = [
  //- T('dow|long|monday|lundi', longLowerDowsDescription),
  //- T('dow|long|tuesday|mardi', longLowerDowsDescription),
  //- T('dow|long|wednesday|mercredi', longLowerDowsDescription),
  //- T('dow|long|thursday|jeudi', longLowerDowsDescription),
  //- T('dow|long|friday|vendredi', longLowerDowsDescription),
  //- T('dow|long|saturday|samedi', longLowerDowsDescription),
  //- T('dow|long|sunday|dimanche', longLowerDowsDescription),
  T('dow|long|monday|lundi'),
  T('dow|long|tuesday|mardi'),
  T('dow|long|wednesday|mercredi'),
  T('dow|long|thursday|jeudi'),
  T('dow|long|friday|vendredi'),
  T('dow|long|saturday|samedi'),
  T('dow|long|sunday|dimanche'),
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
