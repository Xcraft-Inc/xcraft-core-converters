const {date, time} = require('./index.js');
const DateConverters = date;
const TimeConverters = time;

function getEmpty() {
  return '0001-01-01T00:00:00.000Z';
}

function isEmpty(date) {
  return !date || date === getEmpty();
}

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

// Canonical datetime is always a UTC value!
function jsToCanonical(datetime) {
  return datetime.toISOString(); // by example '2011-10-05T14:48:00.000Z'
}

function canonicalToJs(datetime) {
  if (typeof datetime === 'string') {
    const ms = Date.parse(datetime);
    return new Date(ms);
  } else if (datetime !== null && typeof datetime === 'object') {
    const s =
      padding(datetime.year, 4) +
      '-' +
      padding(datetime.month, 2) +
      '-' +
      padding(datetime.day, 2) +
      'T' +
      padding(datetime.hours, 2) +
      ':' +
      padding(datetime.minutes, 2) +
      ':' +
      padding(datetime.seconds, 2) +
      '.000Z';
    const ms = Date.parse(s);
    return new Date(ms);
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

// With '2017-03-31T14:48:00.000Z', return {year: 2017, month: 03, day: 31, hours: 14, minutes: 48, seconds: 00}.
function split(canonicalDateTime) {
  const js = canonicalToJs(canonicalDateTime);
  if (isNaN(js)) {
    throw new Error(
      `Bad canonical datetime '${canonicalDateTime}' (must be 'yyyy-mm-ddThh:mm:ss.tttZ')`
    );
  }
  return {
    year: js.getFullYear(),
    month: js.getMonth() + 1,
    day: js.getDate(),
    hours: js.getHours(),
    minutes: js.getMinutes(),
    seconds: js.getSeconds(),
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
      for (var n of p) {
        result.push(tryParseInt(n));
      }
    }
  }
  return result;
}

// With date = '2017-03-31T14:48:00.000Z', return '31.03.2017 14:48'.
function getDisplayed(canonicalDateTime, format) {
  if (!canonicalDateTime || isEmpty(canonicalDateTime)) {
    return null;
  }
  const d = split(canonicalDateTime);
  if (d) {
    if (format === 'date') {
      return (
        padding(d.day, 2) + '.' + padding(d.month, 2) + '.' + padding(d.year, 4)
      );
    } else if (format === 'time') {
      return padding(d.hours, 2) + ':' + padding(d.minutes, 2);
    } else {
      return (
        padding(d.day, 2) +
        '.' +
        padding(d.month, 2) +
        '.' +
        padding(d.year, 4) +
        ' ' +
        padding(d.hours, 2) +
        ':' +
        padding(d.minutes, 2)
      );
    }
  } else {
    return canonicalDateTime; // return the initial text if it's not a valid date
  }
}

// With editedDate = '31 3 2017 14 48', return '2017-03-31T14:48:00.000Z'.
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
    if (isNaN(edited[0])) {
      incorrectDay = true;
    } else {
      datetime.day = edited[0];
    }
  }
  if (edited.length > 1) {
    if (isNaN(edited[1])) {
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
    if (isNaN(edited[3])) {
      incorrectHours = true;
    } else {
      datetime.hours = edited[3];
    }
  }
  if (edited.length > 4) {
    if (isNaN(edited[4])) {
      incorrectMinutes = true;
    } else {
      datetime.minutes = edited[4];
    }
  }
  if (edited.length > 5) {
    if (isNaN(edited[5])) {
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
    return {value: null, error: 'Date ou heure invalide'};
  }
  let result = jsToCanonical(jsDateTime);
  const r = split(result);
  let error = null;
  if (datetime.day < 1 || datetime.day > 31) {
    error = 'Jour incorrect';
  } else if (datetime.month < 1 || datetime.month > 12) {
    error = 'Mois incorrect';
  } else if (datetime.year < 1900 || datetime.year > 2100) {
    error = 'Année incorrecte';
  } else if (minCanonicalDateTime && result < minCanonicalDateTime) {
    if (mode === 'hard') {
      // Reject a date out of range, force correct value.
      result = minCanonicalDateTime;
      error = 'Date trop éloignée';
    } else {
      // Accept a date out of range, but reports a warning.
      error = `Minimum conseillé: ${getDisplayed(minCanonicalDateTime)}`;
    }
  } else if (datetime.hours < 0 || datetime.hours > 23) {
    error = 'Heure incorrecte';
  } else if (datetime.minutes < 0 || datetime.minutes > 59) {
    error = 'Minutes incorrectes';
  } else if (datetime.seconds < 0 || datetime.seconds > 59) {
    error = 'Secondes incorrectes';
  } else if (maxCanonicalDateTime && result > maxCanonicalDateTime) {
    if (mode === 'hard') {
      // Reject a date out of range, force correct value.
      result = minCanonicalDateTime;
      error = 'Date trop éloignée';
    } else {
      // Accept a date out of range, but reports a warning.
      error = `Maximum conseillé: ${getDisplayed(maxCanonicalDateTime)}`;
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
      error = 'Jour incorrect';
    } else if (incorrectMonth) {
      error = 'Mois incorrect';
    } else if (incorrectYear) {
      error = 'Année incorrecte';
    } else if (incorrectHours) {
      error = 'Heure incorrecte';
    } else if (incorrectMinutes) {
      error = 'Minutes incorrectes';
    } else if (incorrectSeconds) {
      error = 'Secondes incorrectes';
    } else if (incorrectArgs) {
      error = "Trop d'arguments";
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
    now.hours = time.hour;
    now.minutes = time.minute;
    now.seconds = time.second;
  }

  return jsToCanonical(mapToJs(now));
  //????? return jsToCanonical(new Date(Date.now()));
}

function getDate(year, month, day, hours, minutes, seconds) {
  const d = new Date(year, month - 1, day, hours, minutes, seconds);
  return jsToCanonical(d);
}

//-----------------------------------------------------------------------------

module.exports = {
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
  getNowCanonical,
  getDate,
  getDisplayed,
  parseEdited,
};
