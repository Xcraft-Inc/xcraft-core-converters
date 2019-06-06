const T = require('goblin-nabu/widgets/helpers/t.js');

const oneLetterMonthsDescription = 'Première lettre majuscule du nom du mois';
const oneLetterMonths = [
  //- T('month|one-letter|january|J', oneLetterMonthsDescription),
  //- T('month|one-letter|february|F', oneLetterMonthsDescription),
  //- T('month|one-letter|march|M', oneLetterMonthsDescription),
  //- T('month|one-letter|april|A', oneLetterMonthsDescription),
  //- T('month|one-letter|may|M', oneLetterMonthsDescription),
  //- T('month|one-letter|june|J', oneLetterMonthsDescription),
  //- T('month|one-letter|july|J', oneLetterMonthsDescription),
  //- T('month|one-letter|august|A', oneLetterMonthsDescription),
  //- T('month|one-letter|september|S', oneLetterMonthsDescription),
  //- T('month|one-letter|october|O', oneLetterMonthsDescription),
  //- T('month|one-letter|november|N', oneLetterMonthsDescription),
  //- T('month|one-letter|december|D', oneLetterMonthsDescription),
  T('month|one-letter|january|J'),
  T('month|one-letter|february|F'),
  T('month|one-letter|march|M'),
  T('month|one-letter|april|A'),
  T('month|one-letter|may|M'),
  T('month|one-letter|june|J'),
  T('month|one-letter|july|J'),
  T('month|one-letter|august|A'),
  T('month|one-letter|september|S'),
  T('month|one-letter|october|O'),
  T('month|one-letter|november|N'),
  T('month|one-letter|december|D'),
];

const shortCapitalizeMonthsDescription =
  'Nom du mois court (généralement avec 3 lettres, parfois 4), avec la première lettre en majuscule';
const shortCapitalizeMonths = [
  //- T('month|short|january|Jan', shortCapitalizeMonthsDescription),
  //- T('month|short|february|fév', shortCapitalizeMonthsDescription),
  //- T('month|short|march|Mars', shortCapitalizeMonthsDescription),
  //- T('month|short|april|Avr', shortCapitalizeMonthsDescription),
  //- T('month|short|may|Mai', shortCapitalizeMonthsDescription),
  //- T('month|short|june|Juin', shortCapitalizeMonthsDescription),
  //- T('month|short|july|Juil', shortCapitalizeMonthsDescription),
  //- T('month|short|august|Août', shortCapitalizeMonthsDescription),
  //- T('month|short|september|Sep', shortCapitalizeMonthsDescription),
  //- T('month|short|october|Oct', shortCapitalizeMonthsDescription),
  //- T('month|short|november|Nov', shortCapitalizeMonthsDescription),
  //- T('month|short|december|Déc', shortCapitalizeMonthsDescription),
  T('month|short|january|Jan'),
  T('month|short|february|Fév'),
  T('month|short|march|Mars'),
  T('month|short|april|Avr'),
  T('month|short|may|Mai'),
  T('month|short|june|Juin'),
  T('month|short|july|Juil'),
  T('month|short|august|Août'),
  T('month|short|september|Sep'),
  T('month|short|october|Oct'),
  T('month|short|november|Nov'),
  T('month|short|december|Déc'),
];

const shortLowerMonthsDescription =
  'Nom du mois court (généralement avec 3 lettres, parfois 4), tout en minuscules';
const shortLowerMonths = [
  //- T('month|short|january|jan', shortLowerMonthsDescription),
  //- T('month|short|february|fév', shortLowerMonthsDescription),
  //- T('month|short|march|mars', shortLowerMonthsDescription),
  //- T('month|short|april|avr', shortLowerMonthsDescription),
  //- T('month|short|may|mai', shortLowerMonthsDescription),
  //- T('month|short|june|juin', shortLowerMonthsDescription),
  //- T('month|short|july|juil', shortLowerMonthsDescription),
  //- T('month|short|august|août', shortLowerMonthsDescription),
  //- T('month|short|september|sep', shortLowerMonthsDescription),
  //- T('month|short|october|oct', shortLowerMonthsDescription),
  //- T('month|short|november|nov', shortLowerMonthsDescription),
  //- T('month|short|december|déc', shortLowerMonthsDescription),
  T('month|short|january|jan'),
  T('month|short|february|fév'),
  T('month|short|march|mars'),
  T('month|short|april|avr'),
  T('month|short|may|mai'),
  T('month|short|june|juin'),
  T('month|short|july|juil'),
  T('month|short|august|août'),
  T('month|short|september|sep'),
  T('month|short|october|oct'),
  T('month|short|november|nov'),
  T('month|short|december|déc'),
];

const longCapitalizeMonthsDescription =
  'Nom complet du mois, avec la première lettre en majuscule';
const longCapitalizeMonths = [
  //- T('month|long|january|Janvier', longCapitalizeMonthsDescription),
  //- T('month|long|february|Février', longCapitalizeMonthsDescription),
  //- T('month|long|march|Mars', longCapitalizeMonthsDescription),
  //- T('month|long|april|Avril', longCapitalizeMonthsDescription),
  //- T('month|long|may|Mai', longCapitalizeMonthsDescription),
  //- T('month|long|june|Juin', longCapitalizeMonthsDescription),
  //- T('month|long|july|Juillet', longCapitalizeMonthsDescription),
  //- T('month|long|august|Août', longCapitalizeMonthsDescription),
  //- T('month|long|september|Septembre', longCapitalizeMonthsDescription),
  //- T('month|long|october|Octobre', longCapitalizeMonthsDescription),
  //- T('month|long|november|Novembre', longCapitalizeMonthsDescription),
  //- T('month|long|december|Décembre', longCapitalizeMonthsDescription),
  T('month|long|january|Janvier'),
  T('month|long|february|Février'),
  T('month|long|march|Mars'),
  T('month|long|april|Avril'),
  T('month|long|may|Mai'),
  T('month|long|june|Juin'),
  T('month|long|july|Juillet'),
  T('month|long|august|Août'),
  T('month|long|september|Septembre'),
  T('month|long|october|Octobre'),
  T('month|long|november|Novembre'),
  T('month|long|december|Décembre'),
];

const longLowerMonthsDescription = 'Nom complet du mois, tout en minuscules';
const longLowerMonths = [
  //- T('month|long|january|janvier', longLowerMonthsDescription),
  //- T('month|long|february|février', longLowerMonthsDescription),
  //- T('month|long|march|mars', longLowerMonthsDescription),
  //- T('month|long|april|avril', longLowerMonthsDescription),
  //- T('month|long|may|mai', longLowerMonthsDescription),
  //- T('month|long|june|juin', longLowerMonthsDescription),
  //- T('month|long|july|juillet', longLowerMonthsDescription),
  //- T('month|long|august|août', longLowerMonthsDescription),
  //- T('month|long|september|septembre', longLowerMonthsDescription),
  //- T('month|long|october|octobre', longLowerMonthsDescription),
  //- T('month|long|november|novembre', longLowerMonthsDescription),
  //- T('month|long|december|décembre', longLowerMonthsDescription),
  T('month|long|january|janvier'),
  T('month|long|february|février'),
  T('month|long|march|mars'),
  T('month|long|april|avril'),
  T('month|long|may|mai'),
  T('month|long|june|juin'),
  T('month|long|july|juillet'),
  T('month|long|august|août'),
  T('month|long|september|septembre'),
  T('month|long|october|octobre'),
  T('month|long|november|novembre'),
  T('month|long|december|décembre'),
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
