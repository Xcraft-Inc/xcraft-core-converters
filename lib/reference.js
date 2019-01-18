const {date} = require('./index.js');
const DateConverters = date;

//-----------------------------------------------------------------------------
// Adds zeros or deletes digits to get a set length.
// Examples with length = 5:
// 12 return '00012'
// 123456 return '23456'
function pad(n, length) {
  n = n + ''; // to string
  return n.length >= length
    ? n.substring(n.length - length) // deletes digits
    : new Array(length - n.length + 1).join('0') + n; // adds zeros
}

//-----------------------------------------------------------------------------
// With clientNumber = '123', date = '2018-12-25', number='1', return '00123.1812.1'.
function generate(clientNumber, date, number, subnumber) {
  const c = pad(clientNumber, 5);
  const y = pad(DateConverters.getYear(date), 2);
  const m = pad(DateConverters.getMonth(date), 2);
  const n = pad(number, 1);
  const s = subnumber ? '-' + pad(subnumber, 1) : '';
  return `${c}.${y}${m}.${n}${s}`;
}

//-----------------------------------------------------------------------------
// With reference = '00123.1812.1', return '00123.1812'.
// With reference = '00123.1812.1-1', return '00123.1812'.
function getWithoutNumber(canonicalReference) {
  if (!canonicalReference) {
    return null;
  }

  const p = canonicalReference.split('.');
  if (p.length === 3) {
    return [p[0], p[1]].join('.');
  } else {
    return canonicalReference;
  }
}

//-----------------------------------------------------------------------------
// subnumber = 5:
// With reference = '00123.1812.1', return '00123.1812.1-5'.
// With reference = '00123.1812.1-4', return '00123.1812.1-5'.
function updateSubnumber(canonicalReference, subnumber) {
  if (!canonicalReference) {
    return null;
  }

  const p = canonicalReference.split('-');
  return `${p[0]}-${subnumber}`;
}

//-----------------------------------------------------------------------------
// With reference = '123.1812.1', return '00123.1812.1'.
// With reference = '123456.1812.1', return '23456.1812.1'.
// With reference = '00123.1812.1', return '00123.1812.1'.
// With reference = '00123.1812.1-1', return '00123.1812.1-1'.
function getDisplayed(canonicalReference) {
  if (!canonicalReference) {
    return null;
  }

  const p = canonicalReference.split('.');
  if (p.length === 3) {
    return [pad(p[0], 5), p[1], p[2]].join('.');
  } else {
    return canonicalReference;
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  generate,
  getWithoutNumber,
  updateSubnumber,
  getDisplayed,
};
