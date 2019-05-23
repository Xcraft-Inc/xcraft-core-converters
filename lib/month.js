const T = require('goblin-nabu/widgets/helpers/t.js');

const oneLetterMonthsDescription = 'Première lettre majuscule du nom du mois';
const oneLetterMonths = [
  T('month|one-letter|J', oneLetterMonthsDescription),
  T('month|one-letter|F', oneLetterMonthsDescription),
  T('month|one-letter|M', oneLetterMonthsDescription),
  T('month|one-letter|A', oneLetterMonthsDescription),
  T('month|one-letter|M', oneLetterMonthsDescription),
  T('month|one-letter|J', oneLetterMonthsDescription),
  T('month|one-letter|J', oneLetterMonthsDescription),
  T('month|one-letter|A', oneLetterMonthsDescription),
  T('month|one-letter|S', oneLetterMonthsDescription),
  T('month|one-letter|O', oneLetterMonthsDescription),
  T('month|one-letter|N', oneLetterMonthsDescription),
  T('month|one-letter|D', oneLetterMonthsDescription),
];

const shortCapitalizeMonthsDescription =
  'Nom du mois court (généralement avec 3 lettres), avec la première lettre en majuscule';
const shortCapitalizeMonths = [
  T('month|short|capitalize|Jan', shortCapitalizeMonthsDescription),
  T('month|short|capitalize|Fév', shortCapitalizeMonthsDescription),
  T('month|short|capitalize|Mars', shortCapitalizeMonthsDescription),
  T('month|short|capitalize|Avr', shortCapitalizeMonthsDescription),
  T('month|short|capitalize|Mai', shortCapitalizeMonthsDescription),
  T('month|short|capitalize|Juin', shortCapitalizeMonthsDescription),
  T('month|short|capitalize|Juil', shortCapitalizeMonthsDescription),
  T('month|short|capitalize|Août', shortCapitalizeMonthsDescription),
  T('month|short|capitalize|Sept', shortCapitalizeMonthsDescription),
  T('month|short|capitalize|Oct', shortCapitalizeMonthsDescription),
  T('month|short|capitalize|Nov', shortCapitalizeMonthsDescription),
  T('month|short|capitalize|Déc', shortCapitalizeMonthsDescription),
];

const shortLowerMonthsDescription =
  'Nom du mois court (généralement avec 3 lettres), avec la première lettre en minuscule';
const shortLowerMonths = [
  T('month|short|lower|jan', shortLowerMonthsDescription),
  T('month|short|lower|fév', shortLowerMonthsDescription),
  T('month|short|lower|mars', shortLowerMonthsDescription),
  T('month|short|lower|avr', shortLowerMonthsDescription),
  T('month|short|lower|mai', shortLowerMonthsDescription),
  T('month|short|lower|juin', shortLowerMonthsDescription),
  T('month|short|lower|juil', shortLowerMonthsDescription),
  T('month|short|lower|août', shortLowerMonthsDescription),
  T('month|short|lower|sept', shortLowerMonthsDescription),
  T('month|short|lower|oct', shortLowerMonthsDescription),
  T('month|short|lower|nov', shortLowerMonthsDescription),
  T('month|short|lower|déc', shortLowerMonthsDescription),
];

const longCapitalizeMonthsDescription =
  'Nom complet du mois, avec la première lettre en majuscule';
const longCapitalizeMonths = [
  T('month|long|capitalize|Janvier', longCapitalizeMonthsDescription),
  T('month|long|capitalize|Février', longCapitalizeMonthsDescription),
  T('month|long|capitalize|Mars', longCapitalizeMonthsDescription),
  T('month|long|capitalize|Avril', longCapitalizeMonthsDescription),
  T('month|long|capitalize|Mai', longCapitalizeMonthsDescription),
  T('month|long|capitalize|Juin', longCapitalizeMonthsDescription),
  T('month|long|capitalize|Juillet', longCapitalizeMonthsDescription),
  T('month|long|capitalize|Août', longCapitalizeMonthsDescription),
  T('month|long|capitalize|Septembre', longCapitalizeMonthsDescription),
  T('month|long|capitalize|Octobre', longCapitalizeMonthsDescription),
  T('month|long|capitalize|Novembre', longCapitalizeMonthsDescription),
  T('month|long|capitalize|Décembre', longCapitalizeMonthsDescription),
];

const longLowerMonthsDescription =
  'Nom complet du mois, avec la première lettre en minuscule';
const longLowerMonths = [
  T('month|long|lower|janvier', longLowerMonthsDescription),
  T('month|long|lower|février', longLowerMonthsDescription),
  T('month|long|lower|mars', longLowerMonthsDescription),
  T('month|long|lower|avril', longLowerMonthsDescription),
  T('month|long|lower|mai', longLowerMonthsDescription),
  T('month|long|lower|juin', longLowerMonthsDescription),
  T('month|long|lower|juillet', longLowerMonthsDescription),
  T('month|long|lower|août', longLowerMonthsDescription),
  T('month|long|lower|septembre', longLowerMonthsDescription),
  T('month|long|lower|octobre', longLowerMonthsDescription),
  T('month|long|lower|novembre', longLowerMonthsDescription),
  T('month|long|lower|décembre', longLowerMonthsDescription),
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
