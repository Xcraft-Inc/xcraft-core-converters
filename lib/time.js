const T = require('goblin-nabu/widgets/helpers/t.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

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
  const regex = /^[0-9][0-9]:[0-9][0-9]:[0-9][0-9]$/g;
  return regex.test(canonical);
}

function jsToCanonical(time) {
  return (
    padding(time.getHours(), 2) +
    ':' +
    padding(time.getMinutes(), 2) +
    ':' +
    padding(time.getSeconds(), 2)
  );
}

function canonicalToJs(time) {
  if (typeof time === 'string') {
    const s = split(time);
    return new Date(2000, 0, 1, s.hours, s.minutes, s.seconds);
  } else if (time !== null && typeof time === 'object') {
    return new Date(2000, 0, 1, time.hours, time.minutes, time.seconds);
  } else {
    throw new Error(`Bad time '${time}'`);
  }
}

function addHours(time, n) {
  const d = canonicalToJs(time);
  const nd = new Date(
    2000,
    0,
    1,
    d.getHours() + n,
    d.getMinutes(),
    d.getSeconds()
  );
  return jsToCanonical(nd);
}

function addMinutes(time, n) {
  const d = canonicalToJs(time);
  const nd = new Date(
    2000,
    0,
    1,
    d.getHours(),
    d.getMinutes() + n,
    d.getSeconds()
  );
  return jsToCanonical(nd);
}

function addSeconds(time, n) {
  const d = canonicalToJs(time);
  const nd = new Date(
    2000,
    0,
    1,
    d.getHours(),
    d.getMinutes(),
    d.getSeconds() + n
  );
  return jsToCanonical(nd);
}

function getHours(time) {
  const d = canonicalToJs(time);
  return d.getHours(); // 0..23
}

function getMinutes(time) {
  const d = canonicalToJs(time);
  return d.getMinutes(); // 0..59
}

function getSeconds(time) {
  const d = canonicalToJs(time);
  return d.getSeconds(); // 0..59
}

// With '12:34:56', return {hours: 12, minutes: 34, seconds: 56}.
function split(canonicalTime) {
  if (
    !canonicalTime ||
    canonicalTime.length !== 8 ||
    canonicalTime[2] !== ':' ||
    canonicalTime[5] !== ':'
  ) {
    throw new Error(
      `Bad canonical time '${canonicalTime}' (must be 'hh:mm:ss')`
    );
  }
  const hours = parseInt(canonicalTime.substring(0, 2));
  const minutes = parseInt(canonicalTime.substring(3, 5));
  const seconds = parseInt(canonicalTime.substring(6, 8));
  return {
    hours,
    minutes,
    seconds,
  };
}

// With {hours: 12, minutes: 34, seconds: 56}, return '12:34:56'.
function joinTime(time) {
  return (
    padding(time.hours, 2) +
    ':' +
    padding(time.minutes, 2) +
    ':' +
    padding(time.seconds, 2)
  );
}

// With ' 12/3 ', return [12, 3].
function tryParseTime(editedTime) {
  const result = [];
  if (editedTime) {
    editedTime = editedTime.trim();
    editedTime = editedTime.replace(/:|;|-|,|\.|\/| /g, ':');
    if (editedTime) {
      const p = editedTime.split(':');
      for (var n of p) {
        result.push(tryParseInt(n));
      }
    }
  }
  return result;
}

function getTimeFromMinutes(minutes) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const s = 0;
  return joinTime({hours: h, minutes: m, seconds: s});
}

function getTotalMinutes(time) {
  const s = split(time);
  return s.hours * 60 + s.minutes;
}

// Return sortable time, without seconds according to current display format.
function getSortable(time) {
  if (!time) {
    return null;
  }
  const d = split(time);
  if (d) {
    return padding(d.hours, 2) + padding(d.minutes, 2);
  } else {
    return null;
  }
}

// With time = '12:34:56', return '12:34'.
function getDisplayed(time, format) {
  if (!time) {
    return null;
  }
  const d = split(time);
  if (d) {
    if (format === 'hms') {
      return (
        padding(d.hours, 2) +
        ':' +
        padding(d.minutes, 2) +
        ':' +
        padding(d.seconds, 2)
      );
    } else if (format === 'h') {
      return padding(d.hours, 2);
    } else if (format === 'Hm') {
      let h = '';
      if (d.hours > 1) {
        h = `${d.hours} heures`;
      } else if (d.hours === 1) {
        h = '1 heure';
      }
      let m = '';
      if (d.minutes > 0) {
        m = d.minutes + '';
      }
      if (h && m) {
        return `${h} ${m}`;
      } else {
        return `${h}${m}`;
      }
    } else if (format === 'duration') {
      if (d.hours > 0 && d.minutes > 0) {
        return `${d.hours}h${d.minutes}`;
      } else if (d.hours > 0) {
        return `${d.hours}h`;
      } else if (d.minutes > 0) {
        return `${d.minutes}min`;
      } else {
        return '';
      }
    } else {
      return padding(d.hours, 2) + ':' + padding(d.minutes, 2);
    }
  } else {
    return null;
  }
}

// With editedTime = '12', return '12:00:00'.
// With editedTime = '930', return '09:30:00'.
function parseEdited(
  editedTime,
  defaultCanonicalTime,
  minCanonicalTime,
  maxCanonicalTime,
  mode
) {
  if (!editedTime || editedTime === '') {
    return {value: null, error: null};
  }
  if (!defaultCanonicalTime) {
    //? defaultCanonicalTime = getNowCanonical();
    defaultCanonicalTime = '00:00:00';
  }
  const time = split(defaultCanonicalTime);
  const edited = tryParseTime(editedTime);
  let incorrectHour = false;
  let incorrectMinute = false;
  let incorrectSecond = false;
  let incorrectArgs = false;
  if (edited.length > 0) {
    if (isNaN(edited[0])) {
      incorrectHour = true;
    } else {
      time.hours = edited[0];
    }
  }
  if (edited.length > 1) {
    if (isNaN(edited[1])) {
      incorrectMinute = true;
    } else {
      time.minutes = edited[1];
    }
  }
  if (edited.length > 2) {
    if (isNaN(edited[2])) {
      incorrectSecond = true;
    } else {
      time.seconds = edited[2];
    }
  }
  if (edited.length > 3) {
    incorrectArgs = true;
  }

  if (edited.length === 1 && time.hours >= 100) {
    // Transform '930' to '09:30'.
    // Transform '959' to '09:59'.
    // Transform '960' to '09:60' (Minutes incorrectes).
    // Transform '1510' to '15:10'.
    time.minutes = time.hours % 100;
    time.hours = Math.floor(time.hours / 100);
  }

  const jsTime = canonicalToJs(time);
  if (isNaN(jsTime)) {
    return {value: null, error: T('Heure invalide')};
  }
  let result = jsToCanonical(jsTime);
  const r = split(result);
  let error = null;
  if (time.hours < 0 || time.hours > 23) {
    error = T('Heure incorrecte');
  } else if (time.minutes < 0 || time.minutes > 59) {
    error = T('Minutes incorrectes');
  } else if (time.seconds < 0 || time.seconds > 59) {
    error = T('Secondes incorrectes');
  } else if (minCanonicalTime && result < minCanonicalTime) {
    if (mode === 'hard') {
      // Reject a time out of range, force correct value.
      result = minCanonicalTime;
      error = T('Heure trop éloignée');
    } else {
      // Accept a time out of range, but reports a warning.
      error = StringBuilder.joinWords([
        'Minimum conseillé:',
        getDisplayed(minCanonicalTime),
      ]);
    }
  } else if (maxCanonicalTime && result > maxCanonicalTime) {
    if (mode === 'hard') {
      // Reject a time out of range, force correct value.
      result = maxCanonicalTime;
      error = T('Heure trop éloignée');
    } else {
      // Accept a time out of range, but reports a warning.
      error = StringBuilder.joinWords([
        'Maximum conseillé:',
        getDisplayed(maxCanonicalTime),
      ]);
    }
  } else {
    if (time.hours !== r.hours) {
      incorrectHour = true;
    } else if (time.minutes !== r.minutes) {
      incorrectMinute = true;
    } else if (time.seconds !== r.seconds) {
      incorrectSecond = true;
    }
    if (incorrectHour) {
      error = T('Heure incorrecte');
    } else if (incorrectMinute) {
      error = T('Minutes incorrectes');
    } else if (incorrectSecond) {
      error = T('Secondes incorrectes');
    } else if (incorrectArgs) {
      error = T("Trop d'arguments");
    }
  }

  return {value: result, error: error};
}

function getPeriodDescription(fromTime, toTime, format) {
  if (fromTime && toTime) {
    const fh = getHours(fromTime);
    const fm = getMinutes(fromTime);
    const th = getHours(toTime);
    const tm = getMinutes(toTime);
    if (fh === th && fm === tm) {
      return getDisplayed(fromTime);
    } else {
      if (format === 'ft') {
        return getDisplayed(fromTime) + ' ' + getDisplayed(toTime);
      } else if (format === 'f-t') {
        return getDisplayed(fromTime) + '—' + getDisplayed(toTime);
      } else if (format === 'f - t') {
        return getDisplayed(fromTime) + ' — ' + getDisplayed(toTime);
      } else {
        return getDisplayed(fromTime) + ' → ' + getDisplayed(toTime);
      }
    }
  } else {
    return getDisplayed(fromTime || toTime);
  }
}

function getMinutesBetweenTwoTimes(time1, time2) {
  const oneMinute = 60 * 1000;
  const t1 = canonicalToJs(time1);
  const t2 = canonicalToJs(time2);
  return Math.round((t2.getTime() - t1.getTime()) / oneMinute);
}

function getSecondsBetweenTwoTimes(time1, time2) {
  const oneMinute = 1000;
  const t1 = canonicalToJs(time1);
  const t2 = canonicalToJs(time2);
  return Math.round((t2.getTime() - t1.getTime()) / oneMinute);
}

function getDisplayedBetweenTwoTimes(time1, time2, format) {
  const n = getSecondsBetweenTwoTimes(time1, time2);
  const a = Math.abs(n);
  const h = Math.floor(a / (60 * 60));
  const m = Math.floor((a % (60 * 60)) / 60);
  const s = a % 60;
  const d = [];
  if (h > 0) {
    d.push(`${h} heure${h > 1 ? 's' : ''}`);
  }
  if (m > 0) {
    d.push(`${m} minute${m > 1 ? 's' : ''}`);
  }
  if (format === 'hms' && s > 0) {
    d.push(`${s} seconde${s > 1 ? 's' : ''}`);
  }
  const t = d.join(' ');

  if (n === 0) {
    return 'Maintenant';
  } else if (n > 0) {
    return `Dans ${t}`;
  } else if (n < 0) {
    return `Dépassé de ${t}`;
  }
}

function getNowCanonical(mode) {
  const now = jsToCanonical(new Date(Date.now()));
  if (mode === 'exact') {
    return now;
  } else {
    const p = now.split(':');
    return [p[0], p[1], '00'].join(':');
  }
}

// time='14:30:00' exp='-2h' -> return '12:30:00'
// time='14:30:00' exp='10m' -> return '14:40:00'
// time='14:30:00' exp='2s' -> return '14:30:02'
function getCalcTime(time, exp) {
  if (time && exp && exp.length > 1) {
    const n = parseInt(exp.substring(0, exp.length - 1));
    const c = exp[exp.length - 1];
    if (c === 'h') {
      return addHours(time, n);
    }
    if (c === 'm') {
      return addMinutes(time, n);
    }
    if (c === 's') {
      return addSeconds(time, n);
    }
  }
  return null;
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  jsToCanonical,
  canonicalToJs,
  addHours,
  addMinutes,
  addSeconds,
  getHours,
  getMinutes,
  getSeconds,
  getNowCanonical,
  getPeriodDescription,
  split,
  getTimeFromMinutes,
  getTotalMinutes,
  getMinutesBetweenTwoTimes,
  getSecondsBetweenTwoTimes,
  getDisplayedBetweenTwoTimes,
  getCalcTime,
  getSortable,
  getDisplayed,
  parseEdited,
};
