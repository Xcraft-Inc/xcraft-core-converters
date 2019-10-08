const T = require('goblin-nabu/widgets/helpers/t.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

const MonthConverters = require('./month.js');
const DowConverters = require('./dow.js');

//-----------------------------------------------------------------------------

// month is 1 to 12 (1 = january, 12=december).
function getMonthDescription(month, format) {
  return MonthConverters.getDisplayed(month, format);
}

function getDowDescription(canonicalDate, format) {
  const w = canonicalToJs(canonicalDate).getDay(); // 0..6 (0 = Sunday)
  return DowConverters.getDisplayed(((w + 6) % 7) + 1, format);
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
// With '2017-03-31T00:00:00', return {year: 2017, month: 03, day: 31}.
function split(canonicalDate) {
  if (
    canonicalDate &&
    canonicalDate.length === 19 &&
    canonicalDate[10] === 'T' &&
    canonicalDate[13] === ':' &&
    canonicalDate[16] === ':'
  ) {
    canonicalDate = canonicalDate.substring(0, 10);
  }

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
        if (n && n !== '0') {
          result.push(tryParseInt(n));
        }
      }
    }
  }
  return result;
}

// With date = '2017-03-31', return '31.03.2017'.
// IMPORTANT NOTE: When getDisplayed is called without any format, the
// result must not contain any T. It must be a simple string!
function getDisplayed(canonicalDate, format) {
  if (!canonicalDate) {
    return '';
  }
  const d = split(canonicalDate);
  if (d) {
    if (format === 'y') {
      return padding(d.year, 4);
    } else if (format === 'My') {
      return StringBuilder.joinWords(
        getMonthDescription(d.month),
        padding(d.year, 4)
      );
    } else if (format === 'm') {
      return getMonthDescription(d.month, 'long-lower');
    } else if (format === 'M') {
      return getMonthDescription(d.month, 'long');
    } else if (format === 'm3') {
      return getMonthDescription(d.month, 'short-lower');
    } else if (format === 'M3') {
      return getMonthDescription(d.month, 'short');
    } else if (format === 'W') {
      return getDowDescription(canonicalDate);
    } else if (format === 'Wd') {
      return StringBuilder.joinWords(
        getDowDescription(canonicalDate, 'short'),
        padding(d.day, 2)
      );
    } else if (format === 'd') {
      return padding(d.day, 2);
    } else if (format === 'Wdm') {
      return StringBuilder.combine(
        getDowDescription(canonicalDate, 'short'),
        ' ',
        padding(d.day, 2),
        '.',
        padding(d.month, 2)
      );
    } else if (format === 'Wdmy') {
      return StringBuilder.combine(
        getDowDescription(canonicalDate, 'short'),
        ' ',
        padding(d.day, 2),
        '.',
        padding(d.month, 2),
        '.',
        padding(d.year, 4)
      );
    } else if (format === 'WdMy') {
      return StringBuilder.joinWords(
        getDowDescription(canonicalDate),
        padding(d.day, 2),
        getMonthDescription(d.month, 'long-lower'),
        padding(d.year, 4)
      );
    } else if (format === 'dMy,W') {
      return StringBuilder.combine(
        padding(d.day, 2),
        ' ',
        getMonthDescription(d.month, 'long-lower'),
        ' ',
        padding(d.year, 4),
        ', ',
        getDowDescription(canonicalDate)
      );
    } else if (format === 'dMy') {
      return StringBuilder.joinWords(
        d.day,
        getMonthDescription(d.month, 'long-lower'),
        padding(d.year, 4)
      );
    } else if (format === 'dM3y') {
      return StringBuilder.joinWords(
        d.day,
        getMonthDescription(d.month, 'short-lower'),
        padding(d.year, 4)
      );
    } else if (format === 'W dmy') {
      return StringBuilder.combine(
        getDowDescription(canonicalDate),
        ' ',
        padding(d.day, 2),
        '.',
        padding(d.month, 2),
        '.',
        padding(d.year, 4)
      );
    } else if (format === 'W3') {
      return getDowDescription(canonicalDate, 'short');
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
    if (isNaN(edited[0]) || edited[0] > 31) {
      incorrectDay = true;
    } else {
      date.day = edited[0];
    }
  }
  if (edited.length > 1) {
    if (isNaN(edited[1]) || edited[1] > 12) {
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
      error = StringBuilder.joinWords(
        T('Minimum conseillé:'),
        getDisplayed(minCanonicalDate)
      );
    }
  } else if (maxCanonicalDate && result > maxCanonicalDate) {
    if (mode === 'hard') {
      // Reject a date out of range, force correct value.
      result = minCanonicalDate;
      error = T('Date trop éloignée');
    } else {
      // Accept a date out of range, but reports a warning.
      error = StringBuilder.joinWords(
        T('Maximum conseillé:'),
        getDisplayed(maxCanonicalDate)
      );
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
function getPeriodDescription(fromDate, toDate, format, separator) {
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
    separator = separator || ' \u2192 '; // \u2192 = right arrow "→"
    return StringBuilder.join([f, t], separator);
  }
}

function getNowCanonical() {
  return jsToCanonical(new Date(Date.now()));
}

// If clip=true:
// year=2019, month=2, day=31 -> return "2019-02-28"
function getDate(year, month, day, clip) {
  if (clip) {
    const endOfMonth = addDays(getDate(year, month + 1, 1), -1);
    day = Math.min(day, getDay(endOfMonth));
  }
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
    return StringBuilder.joinWords(
      T('date|between-two-dates|Dans'),
      a,
      T('date|between-two-dates|jours')
    );
  } else if (n < 0) {
    return StringBuilder.joinWords(
      T('date|between-two-dates|Dépassé de'),
      a,
      T('date|between-two-dates|jours')
    );
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
