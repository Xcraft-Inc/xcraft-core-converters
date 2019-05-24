const T = require('goblin-nabu/widgets/helpers/t.js');

const oneLetterMonthsDescription = 'Première lettre majuscule du nom du mois';
const oneLetterMonths = [
  //- T('month|one-letter|January', oneLetterMonthsDescription),
  //- T('month|one-letter|February', oneLetterMonthsDescription),
  //- T('month|one-letter|March', oneLetterMonthsDescription),
  //- T('month|one-letter|April', oneLetterMonthsDescription),
  //- T('month|one-letter|May', oneLetterMonthsDescription),
  //- T('month|one-letter|June', oneLetterMonthsDescription),
  //- T('month|one-letter|July', oneLetterMonthsDescription),
  //- T('month|one-letter|August', oneLetterMonthsDescription),
  //- T('month|one-letter|September', oneLetterMonthsDescription),
  //- T('month|one-letter|October', oneLetterMonthsDescription),
  //- T('month|one-letter|November', oneLetterMonthsDescription),
  //- T('month|one-letter|December', oneLetterMonthsDescription),
  T('month|one-letter|January'),
  T('month|one-letter|February'),
  T('month|one-letter|March'),
  T('month|one-letter|April'),
  T('month|one-letter|May'),
  T('month|one-letter|June'),
  T('month|one-letter|July'),
  T('month|one-letter|August'),
  T('month|one-letter|September'),
  T('month|one-letter|October'),
  T('month|one-letter|November'),
  T('month|one-letter|December'),
];

const shortCapitalizeMonthsDescription =
  'Nom du mois court (généralement avec 3 lettres), avec la première lettre en majuscule';
const shortCapitalizeMonths = [
  //- T('month|short|January', shortCapitalizeMonthsDescription),
  //- T('month|short|February', shortCapitalizeMonthsDescription),
  //- T('month|short|March', shortCapitalizeMonthsDescription),
  //- T('month|short|April', shortCapitalizeMonthsDescription),
  //- T('month|short|May', shortCapitalizeMonthsDescription),
  //- T('month|short|June', shortCapitalizeMonthsDescription),
  //- T('month|short|July', shortCapitalizeMonthsDescription),
  //- T('month|short|August', shortCapitalizeMonthsDescription),
  //- T('month|short|September', shortCapitalizeMonthsDescription),
  //- T('month|short|October', shortCapitalizeMonthsDescription),
  //- T('month|short|November', shortCapitalizeMonthsDescription),
  //- T('month|short|December', shortCapitalizeMonthsDescription),
  T('month|short|January'),
  T('month|short|February'),
  T('month|short|March'),
  T('month|short|April'),
  T('month|short|May'),
  T('month|short|June'),
  T('month|short|July'),
  T('month|short|August'),
  T('month|short|September'),
  T('month|short|October'),
  T('month|short|November'),
  T('month|short|December'),
];

const shortLowerMonthsDescription =
  'Nom du mois court (généralement avec 3 lettres), tout en minuscules';
const shortLowerMonths = [
  //- T('month|short|january', shortLowerMonthsDescription),
  //- T('month|short|february', shortLowerMonthsDescription),
  //- T('month|short|march', shortLowerMonthsDescription),
  //- T('month|short|april', shortLowerMonthsDescription),
  //- T('month|short|may', shortLowerMonthsDescription),
  //- T('month|short|june', shortLowerMonthsDescription),
  //- T('month|short|july', shortLowerMonthsDescription),
  //- T('month|short|august', shortLowerMonthsDescription),
  //- T('month|short|september', shortLowerMonthsDescription),
  //- T('month|short|october', shortLowerMonthsDescription),
  //- T('month|short|november', shortLowerMonthsDescription),
  //- T('month|short|december', shortLowerMonthsDescription),
  T('month|short|january'),
  T('month|short|february'),
  T('month|short|march'),
  T('month|short|april'),
  T('month|short|may'),
  T('month|short|june'),
  T('month|short|july'),
  T('month|short|august'),
  T('month|short|september'),
  T('month|short|october'),
  T('month|short|november'),
  T('month|short|december'),
];

const longCapitalizeMonthsDescription =
  'Nom complet du mois, avec la première lettre en majuscule';
const longCapitalizeMonths = [
  //- T('month|long|January', longCapitalizeMonthsDescription),
  //- T('month|long|February', longCapitalizeMonthsDescription),
  //- T('month|long|March', longCapitalizeMonthsDescription),
  //- T('month|long|April', longCapitalizeMonthsDescription),
  //- T('month|long|May', longCapitalizeMonthsDescription),
  //- T('month|long|June', longCapitalizeMonthsDescription),
  //- T('month|long|July', longCapitalizeMonthsDescription),
  //- T('month|long|August', longCapitalizeMonthsDescription),
  //- T('month|long|September', longCapitalizeMonthsDescription),
  //- T('month|long|October', longCapitalizeMonthsDescription),
  //- T('month|long|November', longCapitalizeMonthsDescription),
  //- T('month|long|December', longCapitalizeMonthsDescription),
  T('month|long|January'),
  T('month|long|February'),
  T('month|long|March'),
  T('month|long|April'),
  T('month|long|May'),
  T('month|long|June'),
  T('month|long|July'),
  T('month|long|August'),
  T('month|long|September'),
  T('month|long|October'),
  T('month|long|November'),
  T('month|long|December'),
];

const longLowerMonthsDescription = 'Nom complet du mois, tout en minuscules';
const longLowerMonths = [
  //- T('month|long|january', longLowerMonthsDescription),
  //- T('month|long|february', longLowerMonthsDescription),
  //- T('month|long|march', longLowerMonthsDescription),
  //- T('month|long|april', longLowerMonthsDescription),
  //- T('month|long|may', longLowerMonthsDescription),
  //- T('month|long|june', longLowerMonthsDescription),
  //- T('month|long|july', longLowerMonthsDescription),
  //- T('month|long|august', longLowerMonthsDescription),
  //- T('month|long|september', longLowerMonthsDescription),
  //- T('month|long|october', longLowerMonthsDescription),
  //- T('month|long|november', longLowerMonthsDescription),
  //- T('month|long|december', longLowerMonthsDescription),
  T('month|long|january'),
  T('month|long|february'),
  T('month|long|march'),
  T('month|long|april'),
  T('month|long|may'),
  T('month|long|june'),
  T('month|long|july'),
  T('month|long|august'),
  T('month|long|september'),
  T('month|long|october'),
  T('month|long|november'),
  T('month|long|december'),
];

//-----------------------------------------------------------------------------

// canonicalMonth: 1..12
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
    case 'one-letter':
      return oneLetterMonths[value - 1] || '';
    case 'short':
      return shortCapitalizeMonths[value - 1] || '';
    case 'short-lower':
      return shortLowerMonths[value - 1] || '';
    case 'long':
      return longCapitalizeMonths[value - 1] || '';
    case 'long-lower':
      return longLowerMonths[value - 1] || '';
    case 'number':
      if (value < 1 || value > 12) {
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
