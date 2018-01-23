// month is zero based (0 = january).
function getMonthDescription (month, format) {
  if (month < 0 || month > 11) {
    return null;
  }
  const array = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  let result = array[month];
  if (format) {
    if (format.startsWith ('1')) {
      result = array[month].substring (0, 1);
    } else if (format.startsWith ('2')) {
      result = array[month].substring (0, 2);
    } else if (format.startsWith ('3')) {
      result = array[month].substring (0, 3);
    } else if (format.startsWith ('4')) {
      result = array[month].substring (0, 4);
    } else {
      result = array[month];
    }
    if (format.endsWith ('l')) {
      result = result.toLowerCase ();
    }
  }
  return result;
}

// dow is zero based (0 = monday).
function getDOWDescription (dow, format) {
  if (dow < 0 || dow > 6) {
    return null;
  }
  const array = [
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
    'dimanche',
  ];
  if (format === '3') {
    return array[dow].substring (0, 3);
  } else {
    return array[dow];
  }
}

function getEmpty () {
  return '0001-01-01';
}

function isEmpty (date) {
  return !date || date === getEmpty ();
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

function jsToCanonical (date) {
  return (
    padding (date.getFullYear (), 4) +
    '-' +
    padding (date.getMonth () + 1, 2) +
    '-' +
    padding (date.getDate (), 2)
  );
}

function canonicalToJs (date) {
  if (typeof date === 'string') {
    const s = split (date);
    return new Date (s.year, s.month - 1, s.day);
  } else if (date !== null && typeof date === 'object') {
    return new Date (date.year, date.month - 1, date.day);
  } else {
    throw new Error (`Bad date '${date}'`);
  }
}

function addDays (date, n) {
  const d = canonicalToJs (date);
  const nd = new Date (d.getFullYear (), d.getMonth (), d.getDate () + n);
  return jsToCanonical (nd);
}

function addMonths (date, n) {
  const d = canonicalToJs (date);
  const nd = new Date (d.getFullYear (), d.getMonth () + n, d.getDate ());
  return jsToCanonical (nd);
}

function addYears (date, n) {
  const d = canonicalToJs (date);
  const nd = new Date (d.getFullYear () + n, d.getMonth (), d.getDate ());
  return jsToCanonical (nd);
}

function getYear (date) {
  const d = canonicalToJs (date);
  return d.getFullYear (); // 2017..
}

function getMonth (date) {
  const d = canonicalToJs (date);
  return d.getMonth () + 1; // 1..12
}

function getDay (date) {
  const d = canonicalToJs (date);
  return d.getDate (); // 1..31
}

function getDayOfWeek (date) {
  const d = canonicalToJs (date);
  return d.getDay (); // 0=sunday, 1=monday, 2=thusday, usw.
}

// With '2017-03-31', return {year: 2017, month: 03, day: 31}.
function split (canonicalDate) {
  if (
    !canonicalDate ||
    canonicalDate.length !== 10 ||
    canonicalDate[4] !== '-' ||
    canonicalDate[7] !== '-'
  ) {
    throw new Error (
      `Bad canonical date '${canonicalDate}' (must be 'yyyy-mm-dd')`
    );
  }
  let year = parseInt (canonicalDate.substring (0, 4));
  let month = parseInt (canonicalDate.substring (5, 7));
  let day = parseInt (canonicalDate.substring (8, 10));
  return {
    year: year,
    month: month,
    day: day,
  };
}

// With ' 12/3 ', return [12, 3].
function tryParseDate (editedDate) {
  const result = [];
  if (editedDate) {
    editedDate = editedDate.trim ();
    editedDate = editedDate.replace (/:|;|-|,|\.|\/| /g, ':');
    if (editedDate) {
      const p = editedDate.split (':');
      for (var n of p) {
        result.push (tryParseInt (n));
      }
    }
  }
  return result;
}

// With date = '2017-03-31', return '31.03.2017'.
function getDisplayed (canonicalDate, format) {
  if (!canonicalDate || isEmpty (canonicalDate)) {
    return null;
  }
  const d = split (canonicalDate);
  if (d) {
    if (format === 'y') {
      return padding (d.year, 4);
    } else if (format === 'My') {
      return getMonthDescription (d.month - 1) + ' ' + padding (d.year, 4);
    } else if (format === 'M') {
      return getMonthDescription (d.month - 1);
    } else if (format === 'y') {
      return padding (d.year, 4);
    } else if (format === 'W') {
      const w = canonicalToJs (canonicalDate).getDay (); // 0..6 (0 = Sunday)
      return getDOWDescription ((w + 6) % 7);
    } else if (format === 'Wd') {
      const w = canonicalToJs (canonicalDate).getDay (); // 0..6 (0 = Sunday)
      return getDOWDescription ((w + 6) % 7, '3') + ' ' + padding (d.day, 2);
    } else if (format === 'd') {
      return padding (d.day, 2);
    } else if (format === 'Wdm') {
      const w = canonicalToJs (canonicalDate).getDay (); // 0..6 (0 = Sunday)
      return (
        getDOWDescription ((w + 6) % 7, '3') +
        ' ' +
        padding (d.day, 2) +
        '.' +
        padding (d.month, 2)
      );
    } else if (format === 'Wdmy') {
      const w = canonicalToJs (canonicalDate).getDay (); // 0..6 (0 = Sunday)
      return (
        getDOWDescription ((w + 6) % 7, '3') +
        ' ' +
        padding (d.day, 2) +
        '.' +
        padding (d.month, 2) +
        '.' +
        padding (d.year, 4)
      );
    } else if (format === 'dMy,W') {
      const w = canonicalToJs (canonicalDate).getDay (); // 0..6 (0 = Sunday)
      return (
        padding (d.day, 2) +
        ' ' +
        getMonthDescription (d.month - 1, 'l') +
        ' ' +
        padding (d.year, 4) +
        ', ' +
        getDOWDescription ((w + 6) % 7)
      );
    } else {
      return (
        padding (d.day, 2) +
        '.' +
        padding (d.month, 2) +
        '.' +
        padding (d.year, 4)
      );
    }
  } else {
    return canonicalDate; // return the initial text if it's not a valid date
  }
}

// With editedDate = '31 3 2017', return '2017-03-31'.
function parseEdited (
  editedDate,
  defaultCanonicalDate,
  minCanonicalDate,
  maxCanonicalDate
) {
  if (!editedDate || editedDate === '') {
    return {value: null, error: null};
  }
  if (!defaultCanonicalDate) {
    defaultCanonicalDate = getNowCanonical ();
  }
  const date = split (defaultCanonicalDate);
  const edited = tryParseDate (editedDate);
  let incorrectDay = false;
  let incorrectMonth = false;
  let incorrectYear = false;
  let incorrectArgs = false;
  if (edited.length > 0) {
    if (isNaN (edited[0])) {
      incorrectDay = true;
    } else {
      date.day = edited[0];
    }
  }
  if (edited.length > 1) {
    if (isNaN (edited[1])) {
      incorrectMonth = true;
    } else {
      date.month = edited[1];
    }
  }
  if (edited.length > 2) {
    if (isNaN (edited[2])) {
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

  const jsDate = canonicalToJs (date);
  if (isNaN (jsDate)) {
    return {value: null, error: 'Date invalide'};
  }
  let result = jsToCanonical (jsDate);
  const r = split (result);
  let error = null;
  if (date.day < 1 || date.day > 31) {
    error = 'Jour incorrect';
  } else if (date.month < 1 || date.month > 12) {
    error = 'Mois incorrect';
  } else if (date.year < 1900 || date.year > 2100) {
    error = 'Année incorrecte';
  } else if (minCanonicalDate && result < minCanonicalDate) {
    // Accept a date out of range, but reports a warning.
    // result = minCanonicalDate;
    error = `Date trop éloignée de ${getDisplayed (minCanonicalDate)}`;
  } else if (maxCanonicalDate && result > maxCanonicalDate) {
    // Accept a date out of range, but reports a warning.
    // result = maxCanonicalDate;
    error = `Date trop éloignée de ${getDisplayed (maxCanonicalDate)}`;
  } else {
    if (date.day !== r.day) {
      incorrectDay = true;
    } else if (date.month !== r.month) {
      incorrectMonth = true;
    } else if (date.year !== r.year) {
      incorrectYear = true;
    }
    if (incorrectDay) {
      error = 'Jour incorrect';
    } else if (incorrectMonth) {
      error = 'Mois incorrect';
    } else if (incorrectYear) {
      error = 'Année incorrecte';
    } else if (incorrectArgs) {
      error = "Trop d'arguments";
    }
  }

  return {value: result, error: error};
}

function join (list, separator) {
  var result = '';
  for (var item of list) {
    if (result !== '') {
      result += separator;
    }
    result += item;
  }
  return result;
}

function toFirstUpperCase (s) {
  if (s) {
    const f = s.substring (0, 1);
    const r = s.substring (1);
    return f.toUpperCase () + r.toLowerCase ();
  }
}

//	Return a nice description for a period. Examples:
//	"2017"
//	"2016 → 2017"
//	"Janvier → mars 2017"
//	"Octobre 2016 → février 2017"
//	"10 → 15 juillet 2017"
//	"3 mars → 10 avril 2017"
//	"12 mars 2016 → 24 juin 2017"
function getPeriodDescription (fromDate, toDate) {
  if (!fromDate) {
    fromDate = '2000-01-01';
  }
  if (!toDate) {
    toDate = '2100-12-31';
  }

  var fd = getDay (fromDate);
  var fm = getDisplayed (fromDate, 'M');
  var fy = getDisplayed (fromDate, 'y');

  var td = getDay (toDate);
  var tm = getDisplayed (toDate, 'M');
  var ty = getDisplayed (toDate, 'y');

  if (fy <= '2000') {
    fy = '-∞';
  }
  if (ty >= '2100') {
    ty = '∞';
  }

  const nextDate = addDays (toDate, 1);
  if (
    getDay (fromDate) === 1 &&
    getDay (nextDate) === 1 &&
    getMonth (fromDate) === 1 &&
    getMonth (nextDate) === 1
  ) {
    //	Full years.
    fd = null;
    fm = null;
    td = null;
    tm = null;
  } else if (getDay (fromDate) === 1 && getDay (nextDate) === 1) {
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
    fromList.push (fd);
  }
  if (fm !== null) {
    fromList.push (fm);
  }
  if (fy !== null) {
    fromList.push (fy);
  }

  if (td !== null) {
    toList.push (td);
  }
  if (tm !== null) {
    toList.push (tm);
  }
  if (ty !== null) {
    toList.push (ty);
  }

  const f = join (fromList, ' ');
  const t = join (toList, ' ');

  if (f === '') {
    return toFirstUpperCase (t);
  } else {
    return toFirstUpperCase (f + ' → ' + t); // U+2192 (flèche vers la droite)
  }
}

function getNowCanonical () {
  return jsToCanonical (new Date (Date.now ()));
}

function getDate (year, month, day) {
  const d = new Date (year, month - 1, day);
  return jsToCanonical (d);
}

function moveAtBeginningOfMonth (date) {
  const month = getMonth (date);
  const year = getYear (date);
  return getDate (year, month, 1);
}

function moveAtEndingOfMonth (date) {
  return addDays (addMonths (moveAtBeginningOfMonth (date), 1), -1);
}

function getDaysBetweenTwoDates (date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const d1 = canonicalToJs (date1);
  const d2 = canonicalToJs (date2);
  return Math.round ((d2.getTime () - d1.getTime ()) / oneDay);
}

function getDisplayedBetweenTwoDates (date1, date2) {
  const n = getDaysBetweenTwoDates (date1, date2);
  const a = Math.abs (n);
  if (n === 0) {
    return "Aujourd'hui";
  } else if (n === 1) {
    return 'Demain';
  } else if (n === 2) {
    return 'Après-demain';
  } else if (n === -1) {
    return 'Hier';
  } else if (n === -2) {
    return 'Avant-hier';
  } else if (n > 0) {
    return `Dans ${a} jour${a > 1 ? 's' : ''}`;
  } else if (n < 0) {
    return `Dépassé de ${a} jour${a > 1 ? 's' : ''}`;
  }
}

function getCalendarStartDate (date) {
  const jsDate = canonicalToJs (date);
  const dotw = new Date (
    jsDate.getFullYear (),
    jsDate.getMonth (),
    1
  ).getDay (); // 0..6 (0 = Sunday)
  const first = -((dotw + 5) % 7);
  const startDate = new Date (jsDate.getFullYear (), jsDate.getMonth (), first);
  return jsToCanonical (startDate);
}

// date='2017-01-05' exp='-2d' -> return '2017-01-03'
// date='2017-01-05' exp='3m' -> return '2017-04-05'
// date='2017-01-05' exp='1y' -> return '2018-01-05'
function getCalcDate (date, exp) {
  if (date && exp && exp.length > 1) {
    const n = parseInt (exp.substring (0, exp.length - 1));
    const c = exp[exp.length - 1];
    if (c === 'y') {
      return addYears (date, n);
    }
    if (c === 'm') {
      return addMonths (date, n);
    }
    if (c === 'd') {
      return addDays (date, n);
    }
  }
  return null;
}

//-----------------------------------------------------------------------------
exports.jsToCanonical = jsToCanonical;
exports.canonicalToJs = canonicalToJs;
exports.addYears = addYears;
exports.addMonths = addMonths;
exports.addDays = addDays;
exports.getYear = getYear;
exports.getMonth = getMonth;
exports.getDay = getDay;
exports.getDayOfWeek = getDayOfWeek;
exports.getMonthDescription = getMonthDescription;
exports.getDOWDescription = getDOWDescription;
exports.getCalendarStartDate = getCalendarStartDate;
exports.split = split;
exports.getNowCanonical = getNowCanonical;
exports.getPeriodDescription = getPeriodDescription;
exports.getDate = getDate;
exports.moveAtBeginningOfMonth = moveAtBeginningOfMonth;
exports.moveAtEndingOfMonth = moveAtEndingOfMonth;
exports.getDaysBetweenTwoDates = getDaysBetweenTwoDates;
exports.getDisplayedBetweenTwoDates = getDisplayedBetweenTwoDates;
exports.getCalcDate = getCalcDate;
exports.getDisplayed = getDisplayed;
exports.parseEdited = parseEdited;
