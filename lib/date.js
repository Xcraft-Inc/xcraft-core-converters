const T = require('goblin-nabu/widgets/helpers/t.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

//-----------------------------------------------------------------------------

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

const shortUpperMonthsDescription =
  'Nom du mois court (généralement avec 3 lettres), avec la première lettre en majuscule';
const shortUpperMonths = [
  T('month|short|capitalize|Jan', shortUpperMonthsDescription),
  T('month|short|capitalize|Fév', shortUpperMonthsDescription),
  T('month|short|capitalize|Mars', shortUpperMonthsDescription),
  T('month|short|capitalize|Avr', shortUpperMonthsDescription),
  T('month|short|capitalize|Mai', shortUpperMonthsDescription),
  T('month|short|capitalize|Juin', shortUpperMonthsDescription),
  T('month|short|capitalize|Juil', shortUpperMonthsDescription),
  T('month|short|capitalize|Août', shortUpperMonthsDescription),
  T('month|short|capitalize|Sept', shortUpperMonthsDescription),
  T('month|short|capitalize|Oct', shortUpperMonthsDescription),
  T('month|short|capitalize|Nov', shortUpperMonthsDescription),
  T('month|short|capitalize|Déc', shortUpperMonthsDescription),
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

const longUpperMonthsDescription =
  'Nom complet du mois, avec la première lettre en majuscule';
const longUpperMonths = [
  T('month|long|capitalize|Janvier', longUpperMonthsDescription),
  T('month|long|capitalize|Février', longUpperMonthsDescription),
  T('month|long|capitalize|Mars', longUpperMonthsDescription),
  T('month|long|capitalize|Avril', longUpperMonthsDescription),
  T('month|long|capitalize|Mai', longUpperMonthsDescription),
  T('month|long|capitalize|Juin', longUpperMonthsDescription),
  T('month|long|capitalize|Juillet', longUpperMonthsDescription),
  T('month|long|capitalize|Août', longUpperMonthsDescription),
  T('month|long|capitalize|Septembre', longUpperMonthsDescription),
  T('month|long|capitalize|Octobre', longUpperMonthsDescription),
  T('month|long|capitalize|Novembre', longUpperMonthsDescription),
  T('month|long|capitalize|Décembre', longUpperMonthsDescription),
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

// month is zero based (0 = january).
function getMonthDescription(month, format) {
  if (month < 0 || month > 11) {
    return '';
  }

  switch (format) {
    case '1':
      return oneLetterMonths[month];
    case '3':
      return shortUpperMonths[month];
    case '3l':
      return shortLowerMonths[month];
    case 'l':
      return longLowerMonths[month];
    default:
      return longUpperMonths[month];
  }
}

//-----------------------------------------------------------------------------

const shortUpperDowsDescription = 'Jour de la semaine en minuscule';
const shortUpperDows = [
  T('dow|short|capitalize|Lun', shortUpperDowsDescription),
  T('dow|short|capitalize|Mar', shortUpperDowsDescription),
  T('dow|short|capitalize|Mer', shortUpperDowsDescription),
  T('dow|short|capitalize|Jeu', shortUpperDowsDescription),
  T('dow|short|capitalize|Ven', shortUpperDowsDescription),
  T('dow|short|capitalize|Sam', shortUpperDowsDescription),
  T('dow|short|capitalize|Dim', shortUpperDowsDescription),
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

const longUpperDowsDescription = 'Jour de la semaine en minuscule';
const longUpperDows = [
  T('dow|long|capitalize|Lundi', longUpperDowsDescription),
  T('dow|long|capitalize|Mardi', longUpperDowsDescription),
  T('dow|long|capitalize|Mercredi', longUpperDowsDescription),
  T('dow|long|capitalize|Jeudi', longUpperDowsDescription),
  T('dow|long|capitalize|Vendredi', longUpperDowsDescription),
  T('dow|long|capitalize|Samedi', longUpperDowsDescription),
  T('dow|long|capitalize|Dimanche', longUpperDowsDescription),
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

// dow is zero based (0 = monday).
function getDOWDescription(dow, format) {
  if (dow < 0 || dow > 6) {
    return null;
  }

  switch (format) {
    case 'u3':
      return shortUpperDows[dow];
    case '3':
      return shortLowerDows[dow];
    case 'firstUpperCase':
      return longUpperDows[dow];
    default:
      return longLowerDows[dow];
  }
}

//-----------------------------------------------------------------------------

function tryParseInt(text) {
  if (typeof text === 'string') {
    text = text.trim();
    let result = 0;
    for (var c of text) {
      if (c >= '0' && c <= '9') {
        result *= 10;
        result += c - '0';
      } else {
        return NaN;
      }
    }
    return result;
  } else {
    return NaN;
  }
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// value =  '1', decimals = 3  -> return '001'
// value =  'a', decimals = 3  -> return null
// value =    5, decimals = 3  -> return '005'
// value =   12, decimals = 3  -> return '012'
// value = 1234, decimals = 3  -> return null
function padding(value, decimals) {
  if (typeof value === 'string') {
    value = parseInt(value);
    if (isNaN(value)) {
      return null;
    }
  }
  const result = pad(value, decimals);
  if (result.length > decimals) {
    return null;
  } else {
    return result;
  }
}

function check(canonical) {
  if (!canonical || typeof canonical !== 'string') {
    return false;
  }
  const regex = /^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/g;
  return regex.test(canonical);
}

function jsToCanonical(date) {
  return (
    padding(date.getFullYear(), 4) +
    '-' +
    padding(date.getMonth() + 1, 2) +
    '-' +
    padding(date.getDate(), 2)
  );
}

function canonicalToJs(date) {
  if (typeof date === 'string') {
    const s = split(date);
    return new Date(s.year, s.month - 1, s.day);
  } else if (date !== null && typeof date === 'object') {
    return new Date(date.year, date.month - 1, date.day);
  } else {
    throw new Error(`Bad date '${date}'`);
  }
}

function addDays(date, n) {
  const d = canonicalToJs(date);
  const nd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  return jsToCanonical(nd);
}

function addMonths(date, n) {
  const d = canonicalToJs(date);
  const nd = new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
  return jsToCanonical(nd);
}

function addYears(date, n) {
  const d = canonicalToJs(date);
  const nd = new Date(d.getFullYear() + n, d.getMonth(), d.getDate());
  return jsToCanonical(nd);
}

function getYear(date) {
  const d = canonicalToJs(date);
  return d.getFullYear(); // 2017..
}

function getMonth(date) {
  const d = canonicalToJs(date);
  return d.getMonth() + 1; // 1..12
}

function getDay(date) {
  const d = canonicalToJs(date);
  return d.getDate(); // 1..31
}

function getDayOfWeek(date) {
  const d = canonicalToJs(date);
  return d.getDay(); // 0=sunday, 1=monday, 2=thusday, usw.
}

function getWeekOfYear(date) {
  const d = canonicalToJs(date);
  // Source: https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

// With '2017-03-31', return {year: 2017, month: 03, day: 31}.
function split(canonicalDate) {
  if (
    !canonicalDate ||
    canonicalDate.length !== 10 ||
    canonicalDate[4] !== '-' ||
    canonicalDate[7] !== '-'
  ) {
    throw new Error(
      `Bad canonical date '${canonicalDate}' (must be 'yyyy-mm-dd')`
    );
  }
  const year = parseInt(canonicalDate.substring(0, 4));
  const month = parseInt(canonicalDate.substring(5, 7));
  const day = parseInt(canonicalDate.substring(8, 10));
  return {
    year,
    month,
    day,
  };
}

// With ' 12/3 ', return [12, 3].
function tryParseDate(editedDate) {
  const result = [];
  if (editedDate) {
    editedDate = editedDate.trim();
    editedDate = editedDate.replace(/:|;|-|,|\.|\/| /g, ':');
    if (editedDate) {
      const p = editedDate.split(':');
      for (var n of p) {
        result.push(tryParseInt(n));
      }
    }
  }
  return result;
}

// With date = '2017-03-31', return '31.03.2017'.
function getDisplayed(canonicalDate, format) {
  if (!canonicalDate) {
    return '';
  }
  const d = split(canonicalDate);
  if (d) {
    if (format === 'y') {
      return padding(d.year, 4);
    } else if (format === 'My') {
      return StringBuilder.joinWords([
        getMonthDescription(d.month - 1),
        padding(d.year, 4),
      ]);
    } else if (format === 'm') {
      return getMonthDescription(d.month - 1, 'l');
    } else if (format === 'M') {
      return getMonthDescription(d.month - 1);
    } else if (format === 'm3') {
      return getMonthDescription(d.month - 1, '3l');
    } else if (format === 'M3') {
      return getMonthDescription(d.month - 1, '3');
    } else if (format === 'W') {
      const w = canonicalToJs(canonicalDate).getDay(); // 0..6 (0 = Sunday)
      return getDOWDescription((w + 6) % 7);
    } else if (format === 'Wd') {
      const w = canonicalToJs(canonicalDate).getDay(); // 0..6 (0 = Sunday)
      return StringBuilder.joinWords([
        getDOWDescription((w + 6) % 7, '3'),
        padding(d.day, 2),
      ]);
    } else if (format === 'd') {
      return padding(d.day, 2);
    } else if (format === 'Wdm') {
      const w = canonicalToJs(canonicalDate).getDay(); // 0..6 (0 = Sunday)
      return StringBuilder.join([
        getDOWDescription((w + 6) % 7, '3'),
        ' ',
        padding(d.day, 2),
        '.',
        padding(d.month, 2),
      ]);
    } else if (format === 'Wdmy') {
      const w = canonicalToJs(canonicalDate).getDay(); // 0..6 (0 = Sunday)
      return StringBuilder.join([
        getDOWDescription((w + 6) % 7, '3'),
        ' ',
        padding(d.day, 2),
        '.',
        padding(d.month, 2),
        '.',
        padding(d.year, 4),
      ]);
    } else if (format === 'WdMy') {
      const w = canonicalToJs(canonicalDate).getDay(); // 0..6 (0 = Sunday)
      return StringBuilder.joinWords([
        getDOWDescription((w + 6) % 7, 'firstUpperCase'),
        padding(d.day, 2),
        getMonthDescription(d.month - 1, 'l'),
        padding(d.year, 4),
      ]);
    } else if (format === 'dMy,W') {
      const w = canonicalToJs(canonicalDate).getDay(); // 0..6 (0 = Sunday)
      return StringBuilder.join([
        padding(d.day, 2),
        ' ',
        getMonthDescription(d.month - 1, 'l'),
        ' ',
        padding(d.year, 4),
        ', ',
        getDOWDescription((w + 6) % 7),
      ]);
    } else if (format === 'dMy') {
      return StringBuilder.joinWords([
        d.day,
        getMonthDescription(d.month - 1, 'l'),
        padding(d.year, 4),
      ]);
    } else if (format === 'dM3y') {
      return StringBuilder.joinWords([
        d.day,
        getMonthDescription(d.month - 1, '3l'),
        padding(d.year, 4),
      ]);
    } else if (format === 'W dmy') {
      const w = canonicalToJs(canonicalDate).getDay(); // 0..6 (0 = Sunday)
      return StringBuilder.join([
        getDOWDescription((w + 6) % 7, 'firstUpperCase'),
        ' ',
        padding(d.day, 2),
        '.',
        padding(d.month, 2),
        '.',
        padding(d.year, 4),
      ]);
    } else if (format === 'W3') {
      const w = canonicalToJs(canonicalDate).getDay(); // 0..6 (0 = Sunday)
      return getDOWDescription((w + 6) % 7, 'u3');
    } else {
      return (
        padding(d.day, 2) + '.' + padding(d.month, 2) + '.' + padding(d.year, 4)
      );
    }
  } else {
    return canonicalDate; // return the initial text if it's not a valid date
  }
}

// With editedDate = '31 3 2017', return '2017-03-31'.
function parseEdited(
  editedDate,
  defaultCanonicalDate,
  minCanonicalDate,
  maxCanonicalDate,
  mode
) {
  if (!editedDate || editedDate === '') {
    return {value: null, error: null};
  }
  if (!defaultCanonicalDate) {
    defaultCanonicalDate = getNowCanonical();
  }
  const date = split(defaultCanonicalDate);
  const edited = tryParseDate(editedDate);
  let incorrectDay = false;
  let incorrectMonth = false;
  let incorrectYear = false;
  let incorrectArgs = false;
  if (edited.length > 0) {
    if (isNaN(edited[0])) {
      incorrectDay = true;
    } else {
      date.day = edited[0];
    }
  }
  if (edited.length > 1) {
    if (isNaN(edited[1])) {
      incorrectMonth = true;
    } else {
      date.month = edited[1];
    }
  }
  if (edited.length > 2) {
    if (isNaN(edited[2])) {
      incorrectYear = true;
    } else {
      if (edited[2] >= 1900 && edited[2] <= 2100) {
        date.year = edited[2];
      } else if (edited[2] >= 0 && edited[2] <= 99) {
        date.year = 2000 + edited[2];
      } else {
        incorrectYear = true;
      }
    }
  }
  if (edited.length > 3) {
    incorrectArgs = true;
  }

  const jsDate = canonicalToJs(date);
  if (isNaN(jsDate)) {
    return {value: null, error: T('Date invalide')};
  }
  let result = jsToCanonical(jsDate);
  const r = split(result);
  let error = null;
  if (date.day < 1 || date.day > 31) {
    error = T('Jour incorrect');
  } else if (date.month < 1 || date.month > 12) {
    error = T('Mois incorrect');
  } else if (date.year < 1900 || date.year > 2100) {
    error = T('Année incorrecte');
  } else if (minCanonicalDate && result < minCanonicalDate) {
    if (mode === 'hard') {
      // Reject a date out of range, force correct value.
      result = minCanonicalDate;
      error = T('Date trop éloignée');
    } else {
      // Accept a date out of range, but reports a warning.
      error = StringBuilder.joinWords([
        'Minimum conseillé:',
        getDisplayed(minCanonicalDate),
      ]);
    }
  } else if (maxCanonicalDate && result > maxCanonicalDate) {
    if (mode === 'hard') {
      // Reject a date out of range, force correct value.
      result = minCanonicalDate;
      error = T('Date trop éloignée');
    } else {
      // Accept a date out of range, but reports a warning.
      error = StringBuilder.joinWords([
        'Maximum conseillé:',
        getDisplayed(maxCanonicalDate),
      ]);
    }
  } else {
    if (date.day !== r.day) {
      incorrectDay = true;
    } else if (date.month !== r.month) {
      incorrectMonth = true;
    } else if (date.year !== r.year) {
      incorrectYear = true;
    }
    if (incorrectDay) {
      error = T('Jour incorrect');
    } else if (incorrectMonth) {
      error = T('Mois incorrect');
    } else if (incorrectYear) {
      error = T('Année incorrecte');
    } else if (incorrectArgs) {
      error = T("Trop d'arguments");
    }
  }

  return {value: result, error: error};
}

// Return a nice description for a period.
function getPeriodDescription(fromDate, toDate, format) {
  if (!fromDate) {
    fromDate = '2000-01-01';
  }
  if (!toDate) {
    toDate = '2100-12-31';
  }

  const monthFormat = format && format.includes('3') ? 'm3' : 'm';

  var fd = getDay(fromDate);
  var fm = getDisplayed(fromDate, monthFormat);
  var fy = getDisplayed(fromDate, 'y');

  var td = getDay(toDate);
  var tm = getDisplayed(toDate, monthFormat);
  var ty = getDisplayed(toDate, 'y');

  if (fy <= '2000') {
    fy = '-∞';
  }
  if (ty >= '2100') {
    ty = '∞';
  }

  const nextDate = addDays(toDate, 1);
  if (
    getDay(fromDate) === 1 &&
    getDay(nextDate) === 1 &&
    getMonth(fromDate) === 1 &&
    getMonth(nextDate) === 1
  ) {
    //	Full years.
    fd = null;
    fm = null;
    td = null;
    tm = null;
  } else if (getDay(fromDate) === 1 && getDay(nextDate) === 1) {
    //	Full months.
    fd = null;
    td = null;
  }

  if (fy === ty) {
    fy = null;
    if (fm === tm) {
      fm = null;
      if (fd === td) {
        fd = null;
      }
    }
  }

  const fromList = [];
  const toList = [];

  if (fd !== null) {
    fromList.push(fd);
  }
  if (fm !== null) {
    fromList.push(fm);
  }
  if (fy !== null) {
    fromList.push(fy);
  }

  if (td !== null) {
    toList.push(td);
  }
  if (tm !== null) {
    toList.push(tm);
  }
  if (ty !== null) {
    toList.push(ty);
  }

  const withoutInfinity = format && format.includes('s');
  const f =
    fy === '-∞' && withoutInfinity ? '' : StringBuilder.joinWords(fromList);
  const t =
    ty === '∞' && withoutInfinity ? '' : StringBuilder.joinWords(toList);

  if (f === '') {
    return t;
  } else if (t === '') {
    return f;
  } else {
    return StringBuilder.join([f, t], ' \u2192 '); // \u2192 = right arrow "→"
  }
}

function getNowCanonical() {
  return jsToCanonical(new Date(Date.now()));
}

function getDate(year, month, day) {
  const d = new Date(year, month - 1, day);
  return jsToCanonical(d);
}

function moveAtBeginningOfMonth(date) {
  const month = getMonth(date);
  const year = getYear(date);
  return getDate(year, month, 1);
}

function moveAtEndingOfMonth(date) {
  return addDays(addMonths(moveAtBeginningOfMonth(date), 1), -1);
}

function getDaysBetweenTwoDates(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const d1 = canonicalToJs(date1);
  const d2 = canonicalToJs(date2);
  return Math.round((d2.getTime() - d1.getTime()) / oneDay);
}

function getDisplayedBetweenTwoDates(date1, date2) {
  const n = getDaysBetweenTwoDates(date1, date2);
  const a = Math.abs(n) + '';
  if (n === 0) {
    return T("date|between-two-dates|Aujourd'hui");
  } else if (n === 1) {
    return T('date|between-two-dates|Demain');
  } else if (n === 2) {
    return T('date|between-two-dates|Après-demain');
  } else if (n === -1) {
    return T('date|between-two-dates|Hier');
  } else if (n === -2) {
    return T('date|between-two-dates|Avant-hier');
  } else if (n > 0) {
    return StringBuilder.joinWords([
      T('date|between-two-dates|Dans'),
      a,
      T('date|between-two-dates|jours'),
    ]);
  } else if (n < 0) {
    return StringBuilder.joinWords([
      T('date|between-two-dates|Dépassé de'),
      a,
      T('date|between-two-dates|jours'),
    ]);
  }
}

function getCalendarStartDate(date) {
  const jsDate = canonicalToJs(date);
  const dotw = new Date(jsDate.getFullYear(), jsDate.getMonth(), 1).getDay(); // 0..6 (0 = Sunday)
  const first = -((dotw + 5) % 7);
  const startDate = new Date(jsDate.getFullYear(), jsDate.getMonth(), first);
  return jsToCanonical(startDate);
}

// date='2017-01-05' exp='-2d' -> return '2017-01-03'
// date='2017-01-05' exp='3m' -> return '2017-04-05'
// date='2017-01-05' exp='1y' -> return '2018-01-05'
function getCalcDate(date, exp) {
  if (date && exp && exp.length > 1) {
    const n = parseInt(exp.substring(0, exp.length - 1));
    const c = exp[exp.length - 1];
    if (c === 'y') {
      return addYears(date, n);
    }
    if (c === 'm') {
      return addMonths(date, n);
    }
    if (c === 'd') {
      return addDays(date, n);
    }
  }
  return null;
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  jsToCanonical,
  canonicalToJs,
  addYears,
  addMonths,
  addDays,
  getYear,
  getMonth,
  getDay,
  getDayOfWeek,
  getWeekOfYear,
  getMonthDescription,
  getDOWDescription,
  getCalendarStartDate,
  split,
  getNowCanonical,
  getPeriodDescription,
  getDate,
  moveAtBeginningOfMonth,
  moveAtEndingOfMonth,
  getDaysBetweenTwoDates,
  getDisplayedBetweenTwoDates,
  getCalcDate,
  getDisplayed,
  parseEdited,
};
