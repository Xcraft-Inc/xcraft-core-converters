const T = require('goblin-nabu/widgets/helpers/t.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

const DateConverters = require('./date.js');
const TimeConverters = require('./time.js');

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
  const regex = /^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]T[0-9][0-9]:[0-9][0-9]:[0-9][0-9].[0-9][0-9][0-9]Z$/g;
  return regex.test(canonical);
}

function unixTimestampToCanonical(timestamp) {
  const date = new Date(timestamp * 1000);
  return jsToCanonical(date);
}

function jsToCanonical(datetime) {
  return (
    padding(datetime.getFullYear(), 4) +
    '-' +
    padding(datetime.getMonth() + 1, 2) +
    '-' +
    padding(datetime.getDate(), 2) +
    'T' +
    padding(datetime.getHours(), 2) +
    ':' +
    padding(datetime.getMinutes(), 2) +
    ':' +
    padding(datetime.getSeconds(), 2) +
    '.000Z'
  );
}

function canonicalToJs(datetime) {
  if (typeof datetime === 'string') {
    const s = split(datetime);
    return new Date(s.year, s.month - 1, s.day, s.hours, s.minutes, s.seconds);
  } else if (datetime !== null && typeof datetime === 'object') {
    return new Date(
      datetime.year,
      datetime.month - 1,
      datetime.day,
      datetime.hours,
      datetime.minutes,
      datetime.seconds
    );
  } else {
    throw new Error(`Bad datetime '${datetime}'`);
  }
}

function mapToJs(datetime) {
  return new Date(
    datetime.year,
    datetime.month - 1,
    datetime.day,
    datetime.hours,
    datetime.minutes,
    datetime.seconds
  );
}

function addYears(datetime, n) {
  const d = canonicalToJs(datetime);
  const nd = new Date(
    d.getFullYear() + n,
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  );
  return jsToCanonical(nd);
}

function addMonths(datetime, n) {
  const d = canonicalToJs(datetime);
  const nd = new Date(
    d.getFullYear(),
    d.getMonth() + n,
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  );
  return jsToCanonical(nd);
}

function addDays(datetime, n) {
  const d = canonicalToJs(datetime);
  const nd = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate() + n,
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  );
  return jsToCanonical(nd);
}

function addHours(datetime, n) {
  const d = canonicalToJs(datetime);
  const nd = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours() + n,
    d.getMinutes(),
    d.getSeconds()
  );
  return jsToCanonical(nd);
}

function addMinutes(datetime, n) {
  const d = canonicalToJs(datetime);
  const nd = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes() + n,
    d.getSeconds()
  );
  return jsToCanonical(nd);
}

function addSeconds(datetime, n) {
  const d = canonicalToJs(datetime);
  const nd = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds() + n
  );
  return jsToCanonical(nd);
}

function getYear(datetime) {
  const d = canonicalToJs(datetime);
  return d.getFullYear(); // 2017..
}

function getMonth(datetime) {
  const d = canonicalToJs(datetime);
  return d.getMonth() + 1; // 1..12
}

function getDay(datetime) {
  const d = canonicalToJs(datetime);
  return d.getDate(); // 1..31
}

function getHours(datetime) {
  const d = canonicalToJs(datetime);
  return d.getHours(); // 0..23
}

function getMinutes(datetime) {
  const d = canonicalToJs(datetime);
  return d.getMinutes(); // 0..59
}

function getSeconds(datetime) {
  const d = canonicalToJs(datetime);
  return d.getSeconds(); // 0..59
}

function getDayOfWeek(datetime) {
  const d = canonicalToJs(datetime);
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

// With '2017-03-31T12:48:00', return {year: 2017, month: 03, day: 31, hours: 14, minutes: 48, seconds: 00}.
// With '2017-03-31T12:48:00.000Z', return {year: 2017, month: 03, day: 31, hours: 14, minutes: 48, seconds: 00}.
// With '2019-05-11T15:33:50+02:00', return {year: 2019, month: 05, day: 11, hours: 13, minutes: 33, seconds: 50}.
// With '2019-05-11T15:33:50.271+02:00', return {year: 2019, month: 05, day: 11, hours: 13, minutes: 33, seconds: 50}.
// With '2019-08-11T15:33:50.1417918+02:00', return {year: 2019, month: 05, day: 11, hours: 13, minutes: 33, seconds: 50}.
function split(canonicalDateTime, locale = false) {
  let timezone = [0, 0];

  if (canonicalDateTime.length === 20 && canonicalDateTime[19] === 'Z') {
    canonicalDateTime = canonicalDateTime.substring(0, 19);
  }

  if (
    canonicalDateTime &&
    canonicalDateTime.length === 19 &&
    canonicalDateTime[4] === '-' &&
    canonicalDateTime[7] === '-' &&
    canonicalDateTime[10] === 'T' &&
    canonicalDateTime[13] === ':' &&
    canonicalDateTime[16] === ':'
  ) {
    canonicalDateTime += '.000Z';
  }

  if (
    canonicalDateTime &&
    canonicalDateTime.length >= 25 &&
    canonicalDateTime[4] === '-' &&
    canonicalDateTime[7] === '-' &&
    canonicalDateTime[10] === 'T' &&
    canonicalDateTime[13] === ':' &&
    canonicalDateTime[16] === ':' &&
    (canonicalDateTime[19] === '.' ||
      canonicalDateTime[19] === '+' ||
      canonicalDateTime[19] === '-') &&
    (canonicalDateTime.includes('+') || canonicalDateTime.includes('-'))
  ) {
    // Convert '2019-05-11T15:33:50.271+02:00' to '2019-05-11T13:33:50.271Z'.
    // Convert '2019-05-11T15:33:50+02:00'     to '2019-05-11T13:33:50.000Z'.
    if (locale) {
      let op = 1;
      let idx = canonicalDateTime.lastIndexOf('+');
      if (idx === -1) {
        idx = canonicalDateTime.lastIndexOf('-');
        if (idx !== -1) {
          op = -1;
        }
      } else {
        op = +1;
      }
      if (op) {
        timezone = canonicalDateTime
          .substring(idx + 1)
          .split(':')
          .map((v) => parseInt(v) * op);
      }
    }
    canonicalDateTime = new Date(
      Date.parse(canonicalDateTime) +
        timezone[0] * 3600 * 1000 +
        timezone[1] * 60 * 1000
    ).toJSON();
  }

  if (
    !canonicalDateTime ||
    canonicalDateTime.length !== 24 ||
    canonicalDateTime[4] !== '-' ||
    canonicalDateTime[7] !== '-' ||
    canonicalDateTime[10] !== 'T' ||
    canonicalDateTime[13] !== ':' ||
    canonicalDateTime[16] !== ':' ||
    canonicalDateTime[19] !== '.' ||
    canonicalDateTime[23] !== 'Z'
  ) {
    throw new Error(
      `Bad canonical datetime '${canonicalDateTime}' (must be 'yyyy-mm-ddThh:mm:ss.000Z')`
    );
  }
  const year = parseInt(canonicalDateTime.substring(0, 4));
  const month = parseInt(canonicalDateTime.substring(5, 7));
  const day = parseInt(canonicalDateTime.substring(8, 10));
  const hours = parseInt(canonicalDateTime.substring(11, 13));
  const minutes = parseInt(canonicalDateTime.substring(14, 16));
  const seconds = parseInt(canonicalDateTime.substring(17, 19));
  return {
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
  };
}

// With ' 12/3 ', return [12, 3].
function tryParseDateTime(editedDateTime) {
  const result = [];
  if (editedDateTime) {
    editedDateTime = editedDateTime.trim();
    editedDateTime = editedDateTime.replace(/:|;|-|,|\.|\/| /g, ':');
    if (editedDateTime) {
      const p = editedDateTime.split(':');
      let index = 0;
      for (var n of p) {
        if (n && (index >= 3 || n !== '0')) {
          result.push(tryParseInt(n));
        }
        index++;
      }
    }
  }
  return result;
}

function _getDisplay(canonicalDateTime, format) {
  if (canonicalDateTime) {
    if (format === 'date') {
      return (
        padding(canonicalDateTime.day, 2) +
        '.' +
        padding(canonicalDateTime.month, 2) +
        '.' +
        padding(canonicalDateTime.year, 4)
      );
    } else if (format === 'time') {
      return (
        padding(canonicalDateTime.hours, 2) +
        ':' +
        padding(canonicalDateTime.minutes, 2)
      );
    } else {
      return (
        padding(canonicalDateTime.day, 2) +
        '.' +
        padding(canonicalDateTime.month, 2) +
        '.' +
        padding(canonicalDateTime.year, 4) +
        ' ' +
        padding(canonicalDateTime.hours, 2) +
        ':' +
        padding(canonicalDateTime.minutes, 2)
      );
    }
  } else {
    return canonicalDateTime; // return the initial text if it's not a valid date
  }
}

// With date = '2017-03-31T12:48:00Z', return '31.03.2017 14:48'.
// With date = '2017-03-31T12:48:00.000Z', return '31.03.2017 14:48'.
// With date = '2019-05-11T15:33:50+02:00', return '11.05.2019 13:33'.
// With date = '2019-05-11T15:33:50.271+02:00', return '11.05.2019 13:33'.
// With date = '2019-08-11T15:33:50.1417918+02:00', return '11.05.2019 13:33'.
function getDisplayed(canonicalDateTime, format) {
  if (!canonicalDateTime) {
    return null;
  }
  return _getDisplay(split(canonicalDateTime), format);
}

// With date = '2017-03-31T12:48:00Z', return '31.03.2017 14:48'.
// With date = '2017-03-31T12:48:00.000Z', return '31.03.2017 14:48'.
// With date = '2019-05-11T15:33:50+02:00', return '11.05.2019 15:33'.
// With date = '2019-05-11T15:33:50.271+02:00', return '11.05.2019 15:33'.
// With date = '2019-08-11T15:33:50.1417918+02:00', return '11.05.2019 15:33'.
function getLocaleDisplayed(canonicalDateTime, format) {
  if (!canonicalDateTime) {
    return null;
  }
  return _getDisplay(split(canonicalDateTime, true), format);
}

// With editedDate = '31 3 2017 14 48', return '2017-03-31T12:48:00.000Z'.
function parseEdited(
  editedDateTime,
  defaultCanonicalDateTime,
  defaultCanonicalDate,
  defaultCanonicalTime,
  minCanonicalDateTime,
  maxCanonicalDateTime,
  mode
) {
  if (!editedDateTime || editedDateTime === '') {
    return {value: null, error: null};
  }
  if (!defaultCanonicalDateTime) {
    defaultCanonicalDateTime = getNowCanonical(
      defaultCanonicalDate,
      defaultCanonicalTime
    );
  }
  const datetime = split(defaultCanonicalDateTime);
  const edited = tryParseDateTime(editedDateTime);
  let incorrectDay = false;
  let incorrectMonth = false;
  let incorrectYear = false;
  let incorrectHours = false;
  let incorrectMinutes = false;
  let incorrectSeconds = false;
  let incorrectArgs = false;
  if (edited.length > 0) {
    if (isNaN(edited[0]) || edited[0] > 31) {
      incorrectDay = true;
    } else {
      datetime.day = edited[0];
    }
  }
  if (edited.length > 1) {
    if (isNaN(edited[1]) || edited[1] > 12) {
      incorrectMonth = true;
    } else {
      datetime.month = edited[1];
    }
  }
  if (edited.length > 2) {
    if (isNaN(edited[2])) {
      incorrectYear = true;
    } else {
      if (edited[2] >= 1900 && edited[2] <= 2100) {
        datetime.year = edited[2];
      } else if (edited[2] >= 0 && edited[2] <= 99) {
        datetime.year = 2000 + edited[2];
      } else {
        incorrectYear = true;
      }
    }
  }
  if (edited.length > 3) {
    if (isNaN(edited[3]) || edited[3] > 24) {
      incorrectHours = true;
    } else {
      datetime.hours = edited[3];
    }
  }
  if (edited.length > 4) {
    if (isNaN(edited[4]) || edited[4] > 59) {
      incorrectMinutes = true;
    } else {
      datetime.minutes = edited[4];
    }
  }
  if (edited.length > 5) {
    if (isNaN(edited[5]) || edited[5] > 59) {
      incorrectSeconds = true;
    } else {
      datetime.seconds = edited[5];
    }
  }
  if (edited.length > 6) {
    incorrectArgs = true;
  }

  const jsDateTime = mapToJs(datetime);
  if (isNaN(jsDateTime)) {
    return {value: null, error: T('Date ou heure invalide')};
  }
  let result = jsToCanonical(jsDateTime);
  const r = split(result);
  let error = null;
  if (datetime.day < 1 || datetime.day > 31) {
    error = T('Jour incorrect');
  } else if (datetime.month < 1 || datetime.month > 12) {
    error = T('Mois incorrect');
  } else if (datetime.year < 1900 || datetime.year > 2100) {
    error = T('Année incorrecte');
  } else if (minCanonicalDateTime && result < minCanonicalDateTime) {
    if (mode === 'hard') {
      // Reject a date out of range, force correct value.
      result = minCanonicalDateTime;
      error = T('Date trop éloignée');
    } else {
      // Accept a date out of range, but reports a warning.
      error = StringBuilder.joinWords(
        T('Minimum conseillé:'),
        getDisplayed(minCanonicalDateTime)
      );
    }
  } else if (datetime.hours < 0 || datetime.hours > 23) {
    error = T('Heure incorrecte');
  } else if (datetime.minutes < 0 || datetime.minutes > 59) {
    error = T('Minutes incorrectes');
  } else if (datetime.seconds < 0 || datetime.seconds > 59) {
    error = T('Secondes incorrectes');
  } else if (maxCanonicalDateTime && result > maxCanonicalDateTime) {
    if (mode === 'hard') {
      // Reject a date out of range, force correct value.
      result = minCanonicalDateTime;
      error = T('Date trop éloignée');
    } else {
      // Accept a date out of range, but reports a warning.
      error = StringBuilder.joinWords(
        T('Maximum conseillé:'),
        getDisplayed(maxCanonicalDateTime)
      );
    }
  } else {
    if (datetime.day !== r.day) {
      incorrectDay = true;
    } else if (datetime.month !== r.month) {
      incorrectMonth = true;
    } else if (datetime.year !== r.year) {
      incorrectYear = true;
    } else if (datetime.hours !== r.hours) {
      incorrectHours = true;
    } else if (datetime.minutes !== r.minutes) {
      incorrectMinutes = true;
    } else if (datetime.seconds !== r.seconds) {
      incorrectSeconds = true;
    }
    if (incorrectDay) {
      error = T('Jour incorrect');
    } else if (incorrectMonth) {
      error = T('Mois incorrect');
    } else if (incorrectYear) {
      error = T('Année incorrecte');
    } else if (incorrectHours) {
      error = T('Heure incorrecte');
    } else if (incorrectMinutes) {
      error = T('Minutes incorrectes');
    } else if (incorrectSeconds) {
      error = T('Secondes incorrectes');
    } else if (incorrectArgs) {
      error = T("Trop d'arguments");
    }
  }

  return {value: result, error: error};
}

function getNowCanonical(canonicalDate, canonicalTime) {
  const now = split(jsToCanonical(new Date(Date.now())));

  if (canonicalDate) {
    const date = DateConverters.split(canonicalDate);
    now.year = date.year;
    now.month = date.month;
    now.day = date.day;
  }

  if (canonicalTime) {
    const time = TimeConverters.split(canonicalTime);
    now.hours = time.hours;
    now.minutes = time.minutes;
    now.seconds = time.seconds;
  }

  return jsToCanonical(mapToJs(now));
}

function getDate(year, month, day, hours, minutes, seconds) {
  const d = new Date(year, month - 1, day, hours, minutes, seconds);
  return jsToCanonical(d);
}

function extractCanonicalDate(datetime) {
  const js = canonicalToJs(datetime);
  const year = js.getFullYear();
  const month = js.getMonth() + 1;
  const day = js.getDate();
  return padding(year, 4) + '-' + padding(month, 2) + '-' + padding(day, 2);
}

function extractCanonicalTime(datetime) {
  const js = canonicalToJs(datetime);
  const hours = js.getHours();
  const minutes = js.getMinutes();
  const seconds = js.getSeconds();
  return (
    padding(hours, 2) + ':' + padding(minutes, 2) + ':' + padding(seconds, 2)
  );
}

function getPeriodDescription(fromDatetime, toDatetime) {
  if (!fromDatetime) {
    fromDatetime = '2000-01-01T00:00:00.000Z';
  }
  if (!toDatetime) {
    toDatetime = '2100-12-31T00:00:00.000Z';
  }

  const fromDate = extractCanonicalDate(fromDatetime);
  const fromTime = extractCanonicalTime(fromDatetime);
  const toDate = extractCanonicalDate(toDatetime);
  const toTime = extractCanonicalTime(toDatetime);

  const timePeriod = TimeConverters.getPeriodDescription(fromTime, toTime);
  const cadratin = ' '; // U+2001

  if (fromDate === toDate) {
    const date = DateConverters.getDisplayed(fromDate, 'dMy');
    return `${date}${cadratin}${timePeriod}`;
  } else {
    const datePeriod = DateConverters.getPeriodDescription(fromDate, toDate);
    return `${datePeriod}${cadratin}${timePeriod}`;
  }
}

function getMinutesBetweenTwoDatetimes(datetime1, datetime2) {
  const oneMinute = 60 * 1000;
  const t1 = canonicalToJs(datetime1);
  const t2 = canonicalToJs(datetime2);
  return Math.abs(Math.round((t2.getTime() - t1.getTime()) / oneMinute));
}

function getDisplayedBetweenToDatetimes(datetime1, datetime2) {
  const m = getMinutesBetweenTwoDatetimes(datetime1, datetime2);
  const days = Math.floor(m / (24 * 60));
  const hours = Math.floor(m / 60) % 24;
  const minutes = m % 60;
  const seconds = 0;
  const time =
    padding(hours, 2) + ':' + padding(minutes, 2) + ':' + padding(seconds, 2);
  const timeDuration = TimeConverters.getDisplayed(time, 'duration') || '';
  if (days === 0) {
    return timeDuration; // by examble '2h30'
  } else {
    return `${days}j ` + timeDuration; // by example '1j 12h15'
  }
}

function getDisplayedDelta(datetime1, datetime2, sameDay = true) {
  if (!datetime2) {
    datetime2 = getNowCanonical();
  }

  const date1 = datetime1.substring(0, 10);
  const date2 = datetime2.substring(0, 10);

  if (date1 === date2 && sameDay === true) {
    // Same day.
    const m = getMinutesBetweenTwoDatetimes(datetime1, datetime2);
    const days = Math.floor(m / (24 * 60));
    const hours = Math.floor(m / 60) % 24;
    const minutes = m % 60;

    if (days === 0 && hours === 0 && minutes === 0) {
      return T('Maintenant');
    }

    if (days === 0 && hours === 0 && minutes === 1) {
      return T('Il y a une minute');
    }

    if (days === 0 && hours === 0 && minutes > 1) {
      return StringBuilder.joinWords(T('Il y a'), minutes, T('minutes'));
    }

    if (days === 0 && hours === 1) {
      return T('Il y a une heure');
    }

    if (days === 0 && hours > 0) {
      return StringBuilder.joinWords(T('Il y a'), hours, T('heures'));
    }
  }

  const n = DateConverters.getDaysBetweenTwoDates(date1, date2);
  const time1 = datetime1.substring(11, 19);

  if (n === 0 && sameDay === false) {
    return TimeConverters.getDisplayed(time1);
  }

  if (n === 1) {
    return StringBuilder.joinWords(
      T('Hier à'),
      TimeConverters.getDisplayed(time1)
    );
  }

  if (n === 2) {
    return StringBuilder.joinWords(
      T('Avant-hier à'),
      TimeConverters.getDisplayed(time1)
    );
  }

  const y1 = DateConverters.getYear(date1);
  const y2 = DateConverters.getYear(date2);

  if (y1 === y2) {
    // Same year.
    return DateConverters.getDisplayed(date1, 'dM');
  }

  return DateConverters.getDisplayed(date1, 'dMy');
}

function incEdited(edited, cursorPosition, inc, step, min, max) {
  return null; // TODO
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  unixTimestampToCanonical,
  jsToCanonical,
  canonicalToJs,
  addYears,
  addMonths,
  addDays,
  addHours,
  addMinutes,
  addSeconds,
  getYear,
  getMonth,
  getDay,
  getHours,
  getMinutes,
  getSeconds,
  getDayOfWeek,
  getWeekOfYear,
  split,
  getPeriodDescription,
  getMinutesBetweenTwoDatetimes,
  getDisplayedBetweenToDatetimes,
  getDisplayedDelta,
  getNowCanonical,
  getDate,
  getDisplayed,
  getLocaleDisplayed,
  parseEdited,
  incEdited,
};
