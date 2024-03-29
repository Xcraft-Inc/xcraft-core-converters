'use strict';

const assert = require('assert');
const DateConverters = require('../lib/date.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

function getDisplayed(canonical, format, shift) {
  const s = DateConverters.getDisplayed(canonical, format, shift);
  return StringBuilder._toFlatten(s);
}

function getPeriodDescription(fromDate, toDate, format) {
  const s = DateConverters.getPeriodDescription(fromDate, toDate, format);
  return StringBuilder._toFlatten(s);
}

function getDisplayedBetweenTwoDates(date1, date2) {
  const s = DateConverters.getDisplayedBetweenTwoDates(date1, date2);
  return StringBuilder._toFlatten(s);
}

function getDescription(fromDate, toDate) {
  fromDate = DateConverters.getDisplayed(fromDate);
  toDate = DateConverters.getDisplayed(toDate);
  return `${fromDate} -> ${toDate}`;
}

function testChangePeriod(
  fromDate,
  toDate,
  direction,
  hopeFromDate,
  honeToDate
) {
  fromDate = DateConverters.parseEdited(fromDate).value;
  toDate = DateConverters.parseEdited(toDate).value;
  hopeFromDate = DateConverters.parseEdited(hopeFromDate).value;
  honeToDate = DateConverters.parseEdited(honeToDate).value;

  const r = DateConverters.changePeriod(fromDate, toDate, direction);
  const input = getDescription(fromDate, toDate);
  const hope = getDescription(hopeFromDate, honeToDate);
  const result = getDescription(r.fromDate, r.toDate);
  assert.strictEqual(
    result,
    hope,
    `Normal: input=${input}, direction=${direction}, message=${r.message}`
  );

  const rr = DateConverters.changePeriod(hopeFromDate, honeToDate, -direction);
  const rResult = getDescription(rr.fromDate, rr.toDate);
  assert.strictEqual(
    rResult,
    input,
    `Reverse: input=${hope}, direction=${-direction}, message=${rr.message}`
  );
}

//-----------------------------------------------------------------------------

describe('xcraft.converters.date', function () {
  it('parseEdited', function () {
    let result;

    result = DateConverters.parseEdited('');
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = DateConverters.parseEdited('31 3 2017');
    assert.strictEqual(result.value, '2017-03-31');
    assert.strictEqual(result.error, null);

    result = DateConverters.parseEdited('17');
    assert.strictEqual(result.error, null);

    result = DateConverters.parseEdited('17.');
    assert.strictEqual(result.error, null);

    result = DateConverters.parseEdited('31.03.');
    assert.strictEqual(result.error, null);

    result = DateConverters.parseEdited('0', '2019-03-31');
    assert.strictEqual(result.value, '2019-03-31');
    assert.strictEqual(result.error, null);

    result = DateConverters.parseEdited('05 0', '2019-03-31');
    assert.strictEqual(result.value, '2019-03-05');
    assert.strictEqual(result.error, null);

    result = DateConverters.parseEdited('31', '2017-03-10');
    assert.strictEqual(result.value, '2017-03-31');
    assert.strictEqual(result.error, null);

    result = DateConverters.parseEdited(
      '30 6',
      '2021-01-01',
      null,
      null,
      null,
      -1
    );
    assert.strictEqual(result.value, '2021-07-01');
    assert.strictEqual(result.error, null);
  });

  // prettier-ignore
  it('invalid parseEdited', function() {
    let result;

    result = DateConverters.parseEdited('31 2 2017');
    assert.strictEqual(result.value, '2017-03-03');
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Jour incorrect}');

    const now = DateConverters.getNowCanonical();

    result = DateConverters.parseEdited('100');
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Jour incorrect}');
    assert.strictEqual(result.value, now);

    result = DateConverters.parseEdited('1000');
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Jour incorrect}');
    assert.strictEqual(result.value, now);

    result = DateConverters.parseEdited('10000');
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Jour incorrect}');
    assert.strictEqual(result.value, now);

    result = DateConverters.parseEdited('100000');
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Jour incorrect}');
    assert.strictEqual(result.value, now);

    result = DateConverters.parseEdited('1000000');
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Jour incorrect}');
    assert.strictEqual(result.value, now);

    result = DateConverters.parseEdited('10000000');
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Jour incorrect}');
    assert.strictEqual(result.value, now);

    result = DateConverters.parseEdited('100000000');
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Jour incorrect}');
    assert.strictEqual(result.value, now);

    result = DateConverters.parseEdited('1000000000');
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Jour incorrect}');
    assert.strictEqual(result.value, now);
  });

  it('getDisplayed without format', function () {
    assert.strictEqual(typeof getDisplayed('2017-03-31'), 'string');
  });

  // prettier-ignore
  it('getDisplayed', function() {
    assert.strictEqual(getDisplayed('2017-03-31'          ), '31.03.2017');
    assert.strictEqual(getDisplayed('2017-03-31', 'y'     ), '2017');
    assert.strictEqual(getDisplayed('2017-03-31', 'My'    ), '@{month|long|march|Mars} 2017');
    assert.strictEqual(getDisplayed('2017-03-31', 'M'     ), '@{month|long|march|Mars}');
    assert.strictEqual(getDisplayed('2017-01-31', 'M3'    ), '@{month|short|january|Jan}');
    assert.strictEqual(getDisplayed('2017-03-31', 'M3'    ), '@{month|short|march|Mars}');
    assert.strictEqual(getDisplayed('2019-01-18', 'W'     ), '@{dow|long|friday|Vendredi}');
    assert.strictEqual(getDisplayed('2019-01-18', 'Wd'    ), '@{dow|short|friday|Ven} 18');
    assert.strictEqual(getDisplayed('2019-01-18', 'd'     ), '18');
    assert.strictEqual(getDisplayed('2019-01-18', 'Wdm'   ), '@{dow|short|friday|Ven} 18.01');
    assert.strictEqual(getDisplayed('2019-01-18', 'Wdmy'  ), '@{dow|short|friday|Ven} 18.01.2019');
    assert.strictEqual(getDisplayed('2019-01-18', 'WdMy'  ), '@{dow|long|friday|Vendredi} 18 @{month|long|january|janvier} 2019');
    assert.strictEqual(getDisplayed('2019-01-18', 'dMy,W' ), '18 @{month|long|january|janvier} 2019, @{dow|long|friday|Vendredi}');
    assert.strictEqual(getDisplayed('2019-01-18', 'dMy'   ), '18 @{month|long|january|janvier} 2019');
    assert.strictEqual(getDisplayed('2019-01-18', 'dM3y'  ), '18 @{month|short|january|jan} 2019');
    assert.strictEqual(getDisplayed('2019-01-18', 'W dmy' ), '@{dow|long|friday|Vendredi} 18.01.2019');
    assert.strictEqual(getDisplayed('2019-01-18', 'W3'    ), '@{dow|short|friday|Ven}');
    assert.strictEqual(getDisplayed('2021-07-01', null, -1), '30.06.2021');
  });

  // prettier-ignore
  it('getDisplayedBetweenTwoDates', function() {
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-25'), "@{date|between-two-dates|Aujourd'hui}");
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-26'), '@{date|between-two-dates|Demain}');
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-27'), '@{date|between-two-dates|Après-demain}');
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-24'), '@{date|between-two-dates|Hier}');
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-23'), '@{date|between-two-dates|Avant-hier}');
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-31'), '@{date|between-two-dates|Dans} 6 @{date|between-two-dates|jours}');
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-22'), '@{date|between-two-dates|Dépassé de} 3 @{date|between-two-dates|jours}');
  });

  // prettier-ignore
  it('getDaysBetweenTwoDates', function() {
    assert.strictEqual(DateConverters.getDaysBetweenTwoDates('2017-02-20', '2017-03-01'),    9);
    assert.strictEqual(DateConverters.getDaysBetweenTwoDates('2017-02-20', '2018-02-20'),  365);
    assert.strictEqual(DateConverters.getDaysBetweenTwoDates('2018-02-20', '2017-02-20'), -365);
  });

  // prettier-ignore
  it('moveAtEndingOfMonth', function() {
    assert.strictEqual(DateConverters.moveAtEndingOfMonth('2017-02-15'), '2017-02-28');
    assert.strictEqual(DateConverters.moveAtEndingOfMonth('2017-03-31'), '2017-03-31');
  });

  // prettier-ignore
  it('moveAtBeginningOfMonth', function() {
    assert.strictEqual(DateConverters.moveAtBeginningOfMonth('2017-02-15'), '2017-02-01');
    assert.strictEqual(DateConverters.moveAtBeginningOfMonth('2017-03-01'), '2017-03-01');
  });

  // prettier-ignore
  it('getPeriodDescription', function() {
    assert.strictEqual(getPeriodDescription('2019-01-01', '2019-12-31'      ), '2019');
    assert.strictEqual(getPeriodDescription('2019-01-01', '2020-12-31'      ), '2019 → 2020');
    assert.strictEqual(getPeriodDescription('2019-01-01', '2019-03-31'      ), '@{month|long|january|janvier} → @{month|long|march|mars} 2019');
    assert.strictEqual(getPeriodDescription('2018-10-01', '2019-03-31'      ), '@{month|long|october|octobre} 2018 → @{month|long|march|mars} 2019');
    assert.strictEqual(getPeriodDescription('2019-01-21', '2019-01-26'      ), '21 → 26 @{month|long|january|janvier} 2019');
    assert.strictEqual(getPeriodDescription('2019-01-21', '2019-02-12'      ), '21 @{month|long|january|janvier} → 12 @{month|long|february|février} 2019');
    assert.strictEqual(getPeriodDescription('2019-11-03', '2020-01-22'      ), '3 @{month|long|november|novembre} 2019 → 22 @{month|long|january|janvier} 2020');
    assert.strictEqual(getPeriodDescription('2019-01-21', null              ), '21 @{month|long|january|janvier} 2019 → 31 @{month|long|december|décembre} ∞');
    assert.strictEqual(getPeriodDescription(null,         '2019-01-22'      ), '1 @{month|long|january|janvier} -∞ → 22 @{month|long|january|janvier} 2019');
    assert.strictEqual(getPeriodDescription('2019-01-21', null,         's' ), '21 @{month|long|january|janvier} 2019');
    assert.strictEqual(getPeriodDescription(null,         '2019-01-22', 's' ), '22 @{month|long|january|janvier} 2019');
    assert.strictEqual(getPeriodDescription('2019-01-21', '2019-02-12', 's3'), '21 @{month|short|january|jan} → 12 @{month|short|february|fév} 2019');
  });

  // prettier-ignore
  it('getCalcDate', function() {
    assert.strictEqual(DateConverters.getCalcDate('2017-01-05', '-2d'   ,  1), '2017-01-03');
    assert.strictEqual(DateConverters.getCalcDate('2017-01-05', '-2d'   , -1), '2017-01-07');
    assert.strictEqual(DateConverters.getCalcDate('2017-01-05', '30d'   ,  1), '2017-02-04');
    assert.strictEqual(DateConverters.getCalcDate('2017-01-05', '3m'    ,  1), '2017-04-05');
    assert.strictEqual(DateConverters.getCalcDate('2017-01-05', '1y'    ,  1), '2018-01-05');
    assert.strictEqual(DateConverters.getCalcDate('2020-01-01', '1y/-1d',  1), '2020-12-31');
    assert.strictEqual(DateConverters.getCalcDate('2020-12-31', '1y/-1d', -1), '2020-01-01');
  });

  // prettier-ignore
  it('getWeekOfYear', function() {
    assert.strictEqual(DateConverters.getWeekOfYear('2019-01-01'),  1);
    assert.strictEqual(DateConverters.getWeekOfYear('2019-01-21'),  3);
    assert.strictEqual(DateConverters.getWeekOfYear('2019-12-25'), 52);
    assert.strictEqual(DateConverters.getWeekOfYear('2019-12-31'),  1);
  });

  it('check correct', function () {
    assert.ok(DateConverters.check('0000-00-00'));
    assert.ok(DateConverters.check('2017-03-31'));
  });

  it('check wrong', function () {
    assert.ok(!DateConverters.check('2017/03/31'));
    assert.ok(!DateConverters.check('2017-3-31'));
    assert.ok(!DateConverters.check('2017-AB-31'));
    assert.ok(!DateConverters.check(''));
    assert.ok(!DateConverters.check(123));
    assert.ok(!DateConverters.check(''));
    assert.ok(!DateConverters.check(null));
    assert.ok(!DateConverters.check(undefined));
  });

  // prettier-ignore
  it('addDays', function () {
    assert.strictEqual(DateConverters.addDays('2020-03-01',  1), '2020-03-02');
    assert.strictEqual(DateConverters.addDays('2020-03-01', 31), '2020-04-01');
    assert.strictEqual(DateConverters.addDays('2020-03-31',  1), '2020-04-01');
    assert.strictEqual(DateConverters.addDays('2020-03-01', -1), '2020-02-29');
  });

  // prettier-ignore
  it('addMonths', function () {
    assert.strictEqual(DateConverters.addMonths('2020-03-01',   1), '2020-04-01');
    assert.strictEqual(DateConverters.addMonths('2020-03-31',   1), '2020-04-30');
    assert.strictEqual(DateConverters.addMonths('2020-02-29',  12), '2021-02-28');
    assert.strictEqual(DateConverters.addMonths('2020-12-01',   1), '2021-01-01');
    assert.strictEqual(DateConverters.addMonths('2020-12-31',   1), '2021-01-31');
    assert.strictEqual(DateConverters.addMonths('2020-12-31',   2), '2021-02-28');
    assert.strictEqual(DateConverters.addMonths('2020-12-31',  14), '2022-02-28');
    assert.strictEqual(DateConverters.addMonths('2020-12-31',  26), '2023-02-28');
    assert.strictEqual(DateConverters.addMonths('2020-12-31',  38), '2024-02-29');
    assert.strictEqual(DateConverters.addMonths('2020-12-31',  50), '2025-02-28');

    assert.strictEqual(DateConverters.addMonths('2020-03-01',  -1), '2020-02-01');
    assert.strictEqual(DateConverters.addMonths('2020-03-31',  -1), '2020-02-29');
    assert.strictEqual(DateConverters.addMonths('2020-02-29',  -1), '2020-01-31');
    assert.strictEqual(DateConverters.addMonths('2020-02-29', -11), '2019-03-31');
    assert.strictEqual(DateConverters.addMonths('2020-02-29', -12), '2019-02-28');
    assert.strictEqual(DateConverters.addMonths('2020-02-29', -13), '2019-01-31');
  });

  // prettier-ignore
  it('changePeriod', function () {
    // Whole year test:
    testChangePeriod('01.01.2020', '31.12.2020',  1, '01.01.2021', '31.12.2021');
    testChangePeriod('01.01.2020', '31.12.2020', -1, '01.01.2019', '31.12.2019');

    testChangePeriod('01.01.2020', '31.12.2021',  1, '01.01.2022', '31.12.2023');
    testChangePeriod('01.01.2020', '31.12.2021', -1, '01.01.2018', '31.12.2019');

    // Whole month test:
    testChangePeriod('01.03.2020', '31.03.2020',  1, '01.04.2020', '30.04.2020');
    testChangePeriod('01.03.2020', '31.03.2020', -1, '01.02.2020', '29.02.2020');

    testChangePeriod('01.03.2020', '30.04.2020',  1, '01.05.2020', '30.06.2020');
    testChangePeriod('01.03.2020', '30.04.2020', -1, '01.01.2020', '29.02.2020');

    testChangePeriod('01.12.2020', '31.12.2020',  1, '01.01.2021', '31.01.2021');
    testChangePeriod('01.12.2020', '31.12.2020', -1, '01.11.2020', '30.11.2020');

    testChangePeriod('01.01.2020', '31.01.2020',  1, '01.02.2020', '29.02.2020');
    testChangePeriod('01.01.2020', '31.01.2020', -1, '01.12.2019', '31.12.2019');

    // Strange periods test:
    testChangePeriod('10.01.2020', '20.01.2020',  1, '21.01.2020', '31.01.2020');
    testChangePeriod('15.01.2020', '25.01.2020',  1, '26.01.2020', '05.02.2020');

    testChangePeriod('20.01.2020', '30.01.2020', -1, '09.01.2020', '19.01.2020');
    testChangePeriod('10.01.2020', '20.01.2020', -1, '30.12.2019', '09.01.2020');
  });

  it('incEdited', function () {
    let result;

    result = DateConverters.incEdited('31.03.2020', 0, -1, 1);
    assert.strictEqual(result.edited, '30.03.2020');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 2);

    result = DateConverters.incEdited('31.03.2020', 0, 1, 1);
    assert.strictEqual(result.edited, '01.04.2020');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 2);

    result = DateConverters.incEdited('31.03.2020', 1, 1, 1);
    assert.strictEqual(result.edited, '01.04.2020');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 2);

    result = DateConverters.incEdited('31.03.2020', 2, 1, 1);
    assert.strictEqual(result.edited, '01.04.2020');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 2);

    result = DateConverters.incEdited('31.03.2020', 3, 1, 1);
    assert.strictEqual(result.edited, '30.04.2020');
    assert.strictEqual(result.selectionStart, 3);
    assert.strictEqual(result.selectionEnd, 5);

    result = DateConverters.incEdited('31.03.2020', 4, 1, 1);
    assert.strictEqual(result.edited, '30.04.2020');
    assert.strictEqual(result.selectionStart, 3);
    assert.strictEqual(result.selectionEnd, 5);

    result = DateConverters.incEdited('31.03.2020', 5, 1, 1);
    assert.strictEqual(result.edited, '30.04.2020');
    assert.strictEqual(result.selectionStart, 3);
    assert.strictEqual(result.selectionEnd, 5);

    result = DateConverters.incEdited('31.03.2020', 6, 1, 1);
    assert.strictEqual(result.edited, '31.03.2021');
    assert.strictEqual(result.selectionStart, 6);
    assert.strictEqual(result.selectionEnd, 10);

    result = DateConverters.incEdited('31.03.2020', 7, 1, 1);
    assert.strictEqual(result.edited, '31.03.2021');
    assert.strictEqual(result.selectionStart, 6);
    assert.strictEqual(result.selectionEnd, 10);

    result = DateConverters.incEdited('31.03.2020', 8, 1, 1);
    assert.strictEqual(result.edited, '31.03.2021');
    assert.strictEqual(result.selectionStart, 6);
    assert.strictEqual(result.selectionEnd, 10);

    result = DateConverters.incEdited('31.03.2020', 9, 1, 1);
    assert.strictEqual(result.edited, '31.03.2021');
    assert.strictEqual(result.selectionStart, 6);
    assert.strictEqual(result.selectionEnd, 10);

    result = DateConverters.incEdited('31.03.2020', 10, 1, 1);
    assert.strictEqual(result.edited, '31.03.2021');
    assert.strictEqual(result.selectionStart, 6);
    assert.strictEqual(result.selectionEnd, 10);
  });
});
