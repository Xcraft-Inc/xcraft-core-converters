const StringBuilder = require('goblin-nabu/lib/string-builder.js');
const MonthConverters = require('./month.js');
const DateConverters = require('./date.js');

/**
 * @typedef {string} yearMonth
 * @typedef {string} plainDate
 */

/**
 * @param {yearMonth} yearMonth
 * @returns {[number, number]}
 */
function parse(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number);
  return [year, month];
}

/**
 * @param {number} year
 * @param {number} month
 * @returns {yearMonth}
 */
function from(year, month) {
  return `${year}-${month.toString().padStart(2, '0')}`;
}

/**
 * @param {plainDate} plainDate
 * @returns {yearMonth}
 */
function fromDate(plainDate) {
  return plainDate.split('-', 2).join('-');
}

/**
 * @param {yearMonth} yearMonth
 * @param {number} count
 * @returns {yearMonth}
 */
function addMonths(yearMonth, count) {
  const [year, month] = parse(yearMonth);
  const newMonthNum = month - 1 + count;
  const newMonth = (((newMonthNum % 12) + 12) % 12) + 1;
  const newYear = year + Math.floor(newMonthNum / 12);
  return from(newYear, newMonth);
}

/**
 * @param {yearMonth} yearMonth
 * @param {number} count
 * @returns {yearMonth}
 */
function addYears(yearMonth, count) {
  const [year, month] = parse(yearMonth);
  return from(year + count, month);
}

/**
 * @param {yearMonth} yearMonth
 * @param {Intl.LocalesArgument} [locale]
 * @returns {string}
 */
function toLocaleString(yearMonth, locale) {
  const text = new Date(`${yearMonth}-01`).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * @param {yearMonth} canonicalMonth
 * @param {'short' | 'long'} [format]
 * @returns {string}
 */
function getDisplayed(canonicalMonth, format) {
  if (!canonicalMonth || canonicalMonth === '') {
    return '';
  }
  if (typeof canonicalMonth === 'string') {
    let value = canonicalMonth.split('-');
    if (value.length === 2) {
      let year = value[0];
      let month = parseInt(value[1]);
      switch (format) {
        case 'long':
          month = MonthConverters.getDisplayed(month, format);
          return StringBuilder.join([month, year], ' - ');
        case 'short':
        default:
          year = year.substring(2, 4);
          return `${month}.${year}`;
      }
    }
  }
  return '';
}

function getNowCanonical() {
  return fromDate(DateConverters.getNowCanonical());
}

//-----------------------------------------------------------------------------

module.exports = {
  parse,
  from,
  fromDate,
  addMonths,
  addYears,
  toLocaleString,
  getDisplayed,
  getNowCanonical,
};
