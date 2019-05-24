const T = require('goblin-nabu/widgets/helpers/t.js');

const shortCapitalizeDowsDescription =
  'Nom court du jour de la semaine (généralement avec 3 lettres), avec la première lettre en majuscule';
const shortCapitalizeDows = [
  //- T('dow|short|Monday', shortCapitalizeDowsDescription),
  //- T('dow|short|Tuesday', shortCapitalizeDowsDescription),
  //- T('dow|short|Wednesday', shortCapitalizeDowsDescription),
  //- T('dow|short|Thursday', shortCapitalizeDowsDescription),
  //- T('dow|short|Friday', shortCapitalizeDowsDescription),
  //- T('dow|short|Saturday', shortCapitalizeDowsDescription),
  //- T('dow|short|Sunday', shortCapitalizeDowsDescription),
  T('dow|short|Monday'),
  T('dow|short|Tuesday'),
  T('dow|short|Wednesday'),
  T('dow|short|Thursday'),
  T('dow|short|Friday'),
  T('dow|short|Saturday'),
  T('dow|short|Sunday'),
];

const shortLowerDowsDescription =
  'Nom court du jour de la semaine (généralement avec 3 lettres), tout en minuscules';
const shortLowerDows = [
  //- T('dow|short|monday', shortLowerDowsDescription),
  //- T('dow|short|tuesday', shortLowerDowsDescription),
  //- T('dow|short|wednesday', shortLowerDowsDescription),
  //- T('dow|short|thursday', shortLowerDowsDescription),
  //- T('dow|short|friday', shortLowerDowsDescription),
  //- T('dow|short|saturday', shortLowerDowsDescription),
  //- T('dow|short|sunday', shortLowerDowsDescription),
  T('dow|short|monday'),
  T('dow|short|tuesday'),
  T('dow|short|wednesday'),
  T('dow|short|thursday'),
  T('dow|short|friday'),
  T('dow|short|saturday'),
  T('dow|short|sunday'),
];

const longCapitalizeDowsDescription =
  'Nom complet du jour de la semaine, avec la première lettre en majuscule';
const longCapitalizeDows = [
  //- T('dow|long|Monday', longCapitalizeDowsDescription),
  //- T('dow|long|Tuesday', longCapitalizeDowsDescription),
  //- T('dow|long|Wednesday', longCapitalizeDowsDescription),
  //- T('dow|long|Thursday', longCapitalizeDowsDescription),
  //- T('dow|long|Friday', longCapitalizeDowsDescription),
  //- T('dow|long|Saturday', longCapitalizeDowsDescription),
  //- T('dow|long|Sunday', longCapitalizeDowsDescription),
  T('dow|long|Monday'),
  T('dow|long|Tuesday'),
  T('dow|long|Wednesday'),
  T('dow|long|Thursday'),
  T('dow|long|Friday'),
  T('dow|long|Saturday'),
  T('dow|long|Sunday'),
];

const longLowerDowsDescription =
  'Nom complet du jour de la semaine, tout en minuscules';
const longLowerDows = [
  //- T('dow|long|monday', longLowerDowsDescription),
  //- T('dow|long|tuesday', longLowerDowsDescription),
  //- T('dow|long|wednesday', longLowerDowsDescription),
  //- T('dow|long|thursday', longLowerDowsDescription),
  //- T('dow|long|friday', longLowerDowsDescription),
  //- T('dow|long|saturday', longLowerDowsDescription),
  //- T('dow|long|sunday', longLowerDowsDescription),
  T('dow|long|monday'),
  T('dow|long|tuesday'),
  T('dow|long|wednesday'),
  T('dow|long|thursday'),
  T('dow|long|friday'),
  T('dow|long|saturday'),
  T('dow|long|sunday'),
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
