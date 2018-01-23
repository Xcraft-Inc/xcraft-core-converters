function getEmpty () {
  return '00:00:00';
}

function isEmpty (time) {
  return !time || time === getEmpty ();
}

function tryParseInt (text) {
  if (typeof text === 'string') {
    text = text.trim ();
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

function pad (n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array (width - n.length + 1).join (z) + n;
}

// value =  '1', decimals = 3  -> return '001'
// value =  'a', decimals = 3  -> return null
// value =    5, decimals = 3  -> return '005'
// value =   12, decimals = 3  -> return '012'
// value = 1234, decimals = 3  -> return null
function padding (value, decimals) {
  if (typeof value === 'string') {
    value = parseInt (value);
    if (isNaN (value)) {
      return null;
    }
  }
  const result = pad (value, decimals);
  if (result.length > decimals) {
    return null;
  } else {
    return result;
  }
}

function jsToCanonical (time) {
  return (
    padding (time.getHours (), 2) +
    ':' +
    padding (time.getMinutes (), 2) +
    ':' +
    padding (time.getSeconds (), 2)
  );
}

function canonicalToJs (time) {
  if (typeof time === 'string') {
    const s = split (time);
    return new Date (2000, 1, 1, s.hour, s.minute, s.second);
  } else if (time !== null && typeof time === 'object') {
    return new Date (2000, 1, 1, time.hour, time.minute, time.second);
  } else {
    throw new Error (`Bad time '${time}'`);
  }
}

function addHours (time, n) {
  const d = canonicalToJs (time);
  const nd = new Date (
    2000,
    1,
    1,
    d.getHours () + n,
    d.getMinutes (),
    d.getSeconds ()
  );
  return jsToCanonical (nd);
}

function addMinutes (time, n) {
  const d = canonicalToJs (time);
  const nd = new Date (
    2000,
    1,
    1,
    d.getHours (),
    d.getMinutes () + n,
    d.getSeconds ()
  );
  return jsToCanonical (nd);
}

function addSeconds (time, n) {
  const d = canonicalToJs (time);
  const nd = new Date (
    2000,
    1,
    1,
    d.getHours (),
    d.getMinutes (),
    d.getSeconds () + n
  );
  return jsToCanonical (nd);
}

function getHours (time) {
  const d = canonicalToJs (time);
  return d.getHours (); // 0..23
}

function getMinutes (time) {
  const d = canonicalToJs (time);
  return d.getMinutes (); // 0..59
}

function getSeconds (time) {
  const d = canonicalToJs (time);
  return d.getSeconds (); // 0..59
}

// With '12:34:56', return {hour: 12, minute: 34, second: 56}.
function split (canonicalTime) {
  if (
    !canonicalTime ||
    canonicalTime.length !== 8 ||
    canonicalTime[2] !== ':' ||
    canonicalTime[5] !== ':'
  ) {
    throw new Error (
      `Bad canonical time '${canonicalTime}' (must be 'hh:mm:ss')`
    );
  }
  let hour = parseInt (canonicalTime.substring (0, 2));
  let minute = parseInt (canonicalTime.substring (3, 5));
  let second = parseInt (canonicalTime.substring (6, 8));
  return {
    hour: hour,
    minute: minute,
    second: second,
  };
}

// With {hour: 12, minute: 34, second: 56}, return '12:34:56'.
function joinTime (time) {
  return (
    padding (time.hour, 2) +
    ':' +
    padding (time.minute, 2) +
    ':' +
    padding (time.second, 2)
  );
}

// With ' 12/3 ', return [12, 3].
function tryParseTime (editedTime) {
  const result = [];
  if (editedTime) {
    editedTime = editedTime.trim ();
    editedTime = editedTime.replace (/:|;|-|,|\.|\/| /g, ':');
    if (editedTime) {
      const p = editedTime.split (':');
      for (var n of p) {
        result.push (tryParseInt (n));
      }
    }
  }
  return result;
}

function getTimeFromMinutes (minutes) {
  const hour = Math.floor (minutes / 60);
  const minute = minutes % 60;
  return joinTime ({hour: hour, minute: minute, second: 0});
}

function getTotalMinutes (time) {
  const s = split (time);
  return s.hour * 60 + s.minute;
}

// With time = '12:34:56', return '12:34'.
function getDisplayed (time, format) {
  if (!time || isEmpty (time)) {
    return null;
  }
  const d = split (time);
  if (d) {
    if (format === 'hms') {
      return (
        padding (d.hour, 2) +
        ':' +
        padding (d.minute, 2) +
        ':' +
        padding (d.second, 2)
      );
    } else if (format === 'h') {
      return padding (d.hour, 2);
    } else {
      return padding (d.hour, 2) + ':' + padding (d.minute, 2);
    }
  } else {
    return null;
  }
}

// With editedTime = '12', return '12:00:00'.
function parseEdited (
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
    defaultCanonicalTime = getNowCanonical ();
  }
  const time = split (defaultCanonicalTime);
  const edited = tryParseTime (editedTime);
  let incorrectHour = false;
  let incorrectMinute = false;
  let incorrectSecond = false;
  let incorrectArgs = false;
  if (edited.length > 0) {
    if (isNaN (edited[0])) {
      incorrectHour = true;
    } else {
      time.hour = edited[0];
    }
  }
  if (edited.length > 1) {
    if (isNaN (edited[1])) {
      incorrectMinute = true;
    } else {
      time.minute = edited[1];
    }
  }
  if (edited.length > 2) {
    if (isNaN (edited[2])) {
      incorrectSecond = true;
    } else {
      time.second = edited[2];
    }
  }
  if (edited.length > 3) {
    incorrectArgs = true;
  }

  const jsTime = canonicalToJs (time);
  if (isNaN (jsTime)) {
    return {value: null, error: 'Heure invalide'};
  }
  let result = jsToCanonical (jsTime);
  const r = split (result);
  let error = null;
  if (time.hour < 0 || time.hour > 23) {
    error = 'Heure incorrecte';
  } else if (time.minute < 0 || time.minute > 59) {
    error = 'Minutes incorrectes';
  } else if (time.second < 0 || time.second > 59) {
    error = 'Secondes incorrectes';
  } else if (minCanonicalTime && result < minCanonicalTime) {
    if (mode === 'hard') {
      // Reject a time out of range, force correct value.
      result = minCanonicalTime;
      error = 'Heure trop éloignée';
    } else {
      // Accept a time out of range, but reports a warning.
      error = `Minimum conseillé: ${getDisplayed (minCanonicalTime)}`;
    }
  } else if (maxCanonicalTime && result > maxCanonicalTime) {
    if (mode === 'hard') {
      // Reject a time out of range, force correct value.
      result = maxCanonicalTime;
      error = 'Heure trop éloignée';
    } else {
      // Accept a time out of range, but reports a warning.
      error = `Maximum conseillé: ${getDisplayed (maxCanonicalTime)}`;
    }
  } else {
    if (time.hour !== r.hour) {
      incorrectHour = true;
    } else if (time.minute !== r.minute) {
      incorrectMinute = true;
    } else if (time.second !== r.second) {
      incorrectSecond = true;
    }
    if (incorrectHour) {
      error = 'Heure incorrecte';
    } else if (incorrectMinute) {
      error = 'Minutes incorrectes';
    } else if (incorrectSecond) {
      error = 'Secondes incorrectes';
    } else if (incorrectArgs) {
      error = "Trop d'arguments";
    }
  }

  return {value: result, error: error};
}

function getPeriodDescription (fromTime, toTime, format) {
  if (fromTime && toTime) {
    const fh = getHours (fromTime);
    const fm = getMinutes (fromTime);
    const th = getHours (toTime);
    const tm = getMinutes (toTime);
    if (fh === th && fm === tm) {
      return getDisplayed (fromTime);
    } else {
      if (format === 'ft') {
        return getDisplayed (fromTime) + ' ' + getDisplayed (toTime);
      } else if (format === 'f-t') {
        return getDisplayed (fromTime) + '—' + getDisplayed (toTime);
      } else if (format === 'f - t') {
        return getDisplayed (fromTime) + ' — ' + getDisplayed (toTime);
      } else {
        return getDisplayed (fromTime) + ' → ' + getDisplayed (toTime);
      }
    }
  } else {
    return getDisplayed (fromTime || toTime);
  }
}

function getMinutesBetweenTwoTimes (time1, time2) {
  const oneMinute = 60 * 1000;
  const t1 = canonicalToJs (time1);
  const t2 = canonicalToJs (time2);
  return Math.round ((t2.getTime () - t1.getTime ()) / oneMinute);
}

function getSecondsBetweenTwoTimes (time1, time2) {
  const oneMinute = 1000;
  const t1 = canonicalToJs (time1);
  const t2 = canonicalToJs (time2);
  return Math.round ((t2.getTime () - t1.getTime ()) / oneMinute);
}

function getDisplayedBetweenTwoTimes (time1, time2, format) {
  const n = getSecondsBetweenTwoTimes (time1, time2);
  const a = Math.abs (n);
  const h = Math.floor (a / (60 * 60));
  const m = Math.floor (a % (60 * 60) / 60);
  const s = a % 60;
  const d = [];
  if (h > 0) {
    d.push (`${h} heure${h > 1 ? 's' : ''}`);
  }
  if (m > 0) {
    d.push (`${m} minute${m > 1 ? 's' : ''}`);
  }
  if (format === 'hms' && s > 0) {
    d.push (`${s} seconde${s > 1 ? 's' : ''}`);
  }
  const t = d.join (' ');

  if (n === 0) {
    return 'Maintenant';
  } else if (n > 0) {
    return `Dans ${t}`;
  } else if (n < 0) {
    return `Dépassé de ${t}`;
  }
}

function getNowCanonical () {
  return jsToCanonical (new Date (Date.now ()));
}

// time='14:30:00' exp='-2h' -> return '12:30:00'
// time='14:30:00' exp='10m' -> return '14:20:00'
// time='14:30:00' exp='2s' -> return '14:20:02'
function getCalcTime (time, exp) {
  if (time && exp && exp.length > 1) {
    const n = parseInt (exp.substring (0, exp.length - 1));
    const c = exp[exp.length - 1];
    if (c === 'h') {
      return addHours (time, n);
    }
    if (c === 'm') {
      return addMinutes (time, n);
    }
    if (c === 's') {
      return addSeconds (time, n);
    }
  }
  return null;
}

//-----------------------------------------------------------------------------
exports.jsToCanonical = jsToCanonical;
exports.addHours = addHours;
exports.addMinutes = addMinutes;
exports.addSeconds = addSeconds;
exports.getHours = getHours;
exports.getMinutes = getMinutes;
exports.getSeconds = getSeconds;
exports.getNowCanonical = getNowCanonical;
exports.getPeriodDescription = getPeriodDescription;
exports.split = split;
exports.getTimeFromMinutes = getTimeFromMinutes;
exports.getTotalMinutes = getTotalMinutes;
exports.getMinutesBetweenTwoTimes = getMinutesBetweenTwoTimes;
exports.getSecondsBetweenTwoTimes = getSecondsBetweenTwoTimes;
exports.getDisplayedBetweenTwoTimes = getDisplayedBetweenTwoTimes;
exports.getCalcTime = getCalcTime;
exports.getDisplayed = getDisplayed;
exports.parseEdited = parseEdited;
