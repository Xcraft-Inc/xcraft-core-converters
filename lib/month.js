const T = require('goblin-nabu/widgets/helpers/t.js');

const oneLetterMonthsDescription = 'Première lettre majuscule du nom du mois';
const oneLetterMonths = [
  //- T('month|J', oneLetterMonthsDescription),
  //- T('month|F', oneLetterMonthsDescription),
  //- T('month|M', oneLetterMonthsDescription),
  //- T('month|A', oneLetterMonthsDescription),
  //- T('month|M', oneLetterMonthsDescription),
  //- T('month|J', oneLetterMonthsDescription),
  //- T('month|J', oneLetterMonthsDescription),
  //- T('month|A', oneLetterMonthsDescription),
  //- T('month|S', oneLetterMonthsDescription),
  //- T('month|O', oneLetterMonthsDescription),
  //- T('month|N', oneLetterMonthsDescription),
  //- T('month|D', oneLetterMonthsDescription),
  T('month|J'),
  T('month|F'),
  T('month|M'),
  T('month|A'),
  T('month|M'),
  T('month|J'),
  T('month|J'),
  T('month|A'),
  T('month|S'),
  T('month|O'),
  T('month|N'),
  T('month|D'),
];

const shortCapitalizeMonthsDescription =
  'Nom du mois court (généralement avec 3 lettres), avec la première lettre en majuscule';
const shortCapitalizeMonths = [
  //- T('month|Jan', shortCapitalizeMonthsDescription),
  //- T('month|Fév', shortCapitalizeMonthsDescription),
  //- T('month|Mars', shortCapitalizeMonthsDescription),
  //- T('month|Avr', shortCapitalizeMonthsDescription),
  //- T('month|Mai', shortCapitalizeMonthsDescription),
  //- T('month|Juin', shortCapitalizeMonthsDescription),
  //- T('month|Juil', shortCapitalizeMonthsDescription),
  //- T('month|Août', shortCapitalizeMonthsDescription),
  //- T('month|Sept', shortCapitalizeMonthsDescription),
  //- T('month|Oct', shortCapitalizeMonthsDescription),
  //- T('month|Nov', shortCapitalizeMonthsDescription),
  //- T('month|Déc', shortCapitalizeMonthsDescription),
  T('month|Jan'),
  T('month|Fév'),
  T('month|Mars'),
  T('month|Avr'),
  T('month|Mai'),
  T('month|Juin'),
  T('month|Juil'),
  T('month|Août'),
  T('month|Sept'),
  T('month|Oct'),
  T('month|Nov'),
  T('month|Déc'),
];

const shortLowerMonthsDescription =
  'Nom du mois court (généralement avec 3 lettres), avec la première lettre en minuscule';
const shortLowerMonths = [
  //- T('month|jan', shortLowerMonthsDescription),
  //- T('month|fév', shortLowerMonthsDescription),
  //- T('month|mars', shortLowerMonthsDescription),
  //- T('month|avr', shortLowerMonthsDescription),
  //- T('month|mai', shortLowerMonthsDescription),
  //- T('month|juin', shortLowerMonthsDescription),
  //- T('month|juil', shortLowerMonthsDescription),
  //- T('month|août', shortLowerMonthsDescription),
  //- T('month|sept', shortLowerMonthsDescription),
  //- T('month|oct', shortLowerMonthsDescription),
  //- T('month|nov', shortLowerMonthsDescription),
  //- T('month|déc', shortLowerMonthsDescription),
  T('month|jan'),
  T('month|fév'),
  T('month|mars'),
  T('month|avr'),
  T('month|mai'),
  T('month|juin'),
  T('month|juil'),
  T('month|août'),
  T('month|sept'),
  T('month|oct'),
  T('month|nov'),
  T('month|déc'),
];

const longCapitalizeMonthsDescription =
  'Nom complet du mois, avec la première lettre en majuscule';
const longCapitalizeMonths = [
  //- T('month|Janvier', longCapitalizeMonthsDescription),
  //- T('month|Février', longCapitalizeMonthsDescription),
  //- T('month|Mars', longCapitalizeMonthsDescription),
  //- T('month|Avril', longCapitalizeMonthsDescription),
  //- T('month|Mai', longCapitalizeMonthsDescription),
  //- T('month|Juin', longCapitalizeMonthsDescription),
  //- T('month|Juillet', longCapitalizeMonthsDescription),
  //- T('month|Août', longCapitalizeMonthsDescription),
  //- T('month|Septembre', longCapitalizeMonthsDescription),
  //- T('month|Octobre', longCapitalizeMonthsDescription),
  //- T('month|Novembre', longCapitalizeMonthsDescription),
  //- T('month|Décembre', longCapitalizeMonthsDescription),
  T('month|Janvier'),
  T('month|Février'),
  T('month|Mars'),
  T('month|Avril'),
  T('month|Mai'),
  T('month|Juin'),
  T('month|Juillet'),
  T('month|Août'),
  T('month|Septembre'),
  T('month|Octobre'),
  T('month|Novembre'),
  T('month|Décembre'),
];

const longLowerMonthsDescription =
  'Nom complet du mois, avec la première lettre en minuscule';
const longLowerMonths = [
  //- T('month|janvier', longLowerMonthsDescription),
  //- T('month|février', longLowerMonthsDescription),
  //- T('month|mars', longLowerMonthsDescription),
  //- T('month|avril', longLowerMonthsDescription),
  //- T('month|mai', longLowerMonthsDescription),
  //- T('month|juin', longLowerMonthsDescription),
  //- T('month|juillet', longLowerMonthsDescription),
  //- T('month|août', longLowerMonthsDescription),
  //- T('month|septembre', longLowerMonthsDescription),
  //- T('month|octobre', longLowerMonthsDescription),
  //- T('month|novembre', longLowerMonthsDescription),
  //- T('month|décembre', longLowerMonthsDescription),
  T('month|janvier'),
  T('month|février'),
  T('month|mars'),
  T('month|avril'),
  T('month|mai'),
  T('month|juin'),
  T('month|juillet'),
  T('month|août'),
  T('month|septembre'),
  T('month|octobre'),
  T('month|novembre'),
  T('month|décembre'),
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
