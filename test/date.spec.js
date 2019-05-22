'use strict';

const assert = require('assert');
const DateConverters = require('../lib/date.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

function getDisplayed(canonical, format) {
  const s = DateConverters.getDisplayed(canonical, format);
  return StringBuilder._toFlatten(s);
}

function getPeriodDescription(fromDate, toDate, format) {
  const s = DateConverters.getPeriodDescription(fromDate, toDate, format);
  return StringBuilder._toFlatten(s);
}

function getMonthDescription(month, format) {
  const s = DateConverters.getMonthDescription(month, format);
  return StringBuilder._toFlatten(s);
}

function getDOWDescription(dow, format) {
  const s = DateConverters.getDOWDescription(dow, format);
  return StringBuilder._toFlatten(s);
}

function getDisplayedBetweenTwoDates(date1, date2) {
  const s = DateConverters.getDisplayedBetweenTwoDates(date1, date2);
  return StringBuilder._toFlatten(s);
}

describe('Converter date', function() {
  it('#Test parseEdited', function() {
    let result;

    result = DateConverters.parseEdited('');
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = DateConverters.parseEdited('31 3 2017');
    assert.strictEqual(result.value, '2017-03-31');
    assert.strictEqual(result.error, null);

    result = DateConverters.parseEdited('31', '2017-03-10');
    assert.strictEqual(result.value, '2017-03-31');
    assert.strictEqual(result.error, null);

    result = DateConverters.parseEdited('31 2 2017');
    assert.strictEqual(result.value, '2017-03-03');
    assert.strictEqual(result.error, 'Jour incorrect');
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.strictEqual(getDisplayed('2017-03-31'         ), '31.03.2017');
    assert.strictEqual(getDisplayed('2017-03-31', 'y'    ), '2017');
    assert.strictEqual(getDisplayed('2017-03-31', 'My'   ), '@{Mars} 2017');
    assert.strictEqual(getDisplayed('2017-03-31', 'M'    ), '@{Mars}');
    assert.strictEqual(getDisplayed('2017-01-31', 'M3'   ), '@{Jan}');
    assert.strictEqual(getDisplayed('2017-03-31', 'M3'   ), '@{Mars}');
    assert.strictEqual(getDisplayed('2019-01-18', 'W'    ), '@{vendredi}');
    assert.strictEqual(getDisplayed('2019-01-18', 'Wd'   ), '@{ven} 18');
    assert.strictEqual(getDisplayed('2019-01-18', 'd'    ), '18');
    assert.strictEqual(getDisplayed('2019-01-18', 'Wdm'  ), '@{ven} 18.01');
    assert.strictEqual(getDisplayed('2019-01-18', 'Wdmy' ), '@{ven} 18.01.2019');
    assert.strictEqual(getDisplayed('2019-01-18', 'WdMy' ), '@{Vendredi} 18 @{janvier} 2019');
    assert.strictEqual(getDisplayed('2019-01-18', 'dMy,W'), '18 @{janvier} 2019, @{vendredi}');
    assert.strictEqual(getDisplayed('2019-01-18', 'dMy'  ), '18 @{janvier} 2019');
    assert.strictEqual(getDisplayed('2019-01-18', 'dM3y' ), '18 @{jan} 2019');
    assert.strictEqual(getDisplayed('2019-01-18', 'W dmy'), '@{Vendredi} 18.01.2019');
    assert.strictEqual(getDisplayed('2019-01-18', 'W3'   ), '@{Ven}');
  });

  // prettier-ignore
  it('#Test getDisplayedBetweenTwoDates', function() {
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-25'), "@{date|between-two-dates|Aujourd'hui}");
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-26'), '@{date|between-two-dates|Demain}');
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-27'), '@{date|between-two-dates|Après-demain}');
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-24'), '@{date|between-two-dates|Hier}');
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-23'), '@{date|between-two-dates|Avant-hier}');
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-31'), '@{date|between-two-dates|Dans} 6 @{date|between-two-dates|jours}');
    assert.strictEqual(getDisplayedBetweenTwoDates('2019-12-25', '2019-12-22'), '@{date|between-two-dates|Dépassé de} 3 @{date|between-two-dates|jours}');
  });

  // prettier-ignore
  it('#Test getDaysBetweenTwoDates', function() {
    assert.strictEqual(DateConverters.getDaysBetweenTwoDates('2017-02-20', '2017-03-01'),    9);
    assert.strictEqual(DateConverters.getDaysBetweenTwoDates('2017-02-20', '2018-02-20'),  365);
    assert.strictEqual(DateConverters.getDaysBetweenTwoDates('2018-02-20', '2017-02-20'), -365);
  });

  // prettier-ignore
  it('#Test moveAtEndingOfMonth', function() {
    assert.strictEqual(DateConverters.moveAtEndingOfMonth('2017-02-15'), '2017-02-28');
    assert.strictEqual(DateConverters.moveAtEndingOfMonth('2017-03-31'), '2017-03-31');
  });

  // prettier-ignore
  it('#Test moveAtBeginningOfMonth', function() {
    assert.strictEqual(DateConverters.moveAtBeginningOfMonth('2017-02-15'), '2017-02-01');
    assert.strictEqual(DateConverters.moveAtBeginningOfMonth('2017-03-01'), '2017-03-01');
  });

  // prettier-ignore
  it('#Test getPeriodDescription', function() {
    assert.strictEqual(getPeriodDescription('2019-01-01', '2019-12-31'      ), '2019');
    assert.strictEqual(getPeriodDescription('2019-01-01', '2020-12-31'      ), '2019 → 2020');
    assert.strictEqual(getPeriodDescription('2019-01-01', '2019-03-31'      ), 'janvier → mars 2019');
    assert.strictEqual(getPeriodDescription('2018-10-01', '2019-03-31'      ), 'octobre 2018 → mars 2019');
    assert.strictEqual(getPeriodDescription('2019-01-21', '2019-01-26'      ), '21 → 26 janvier 2019');
    assert.strictEqual(getPeriodDescription('2019-01-21', '2019-02-12'      ), '21 janvier → 12 février 2019');
    assert.strictEqual(getPeriodDescription('2019-11-03', '2020-01-22'      ), '3 novembre 2019 → 22 janvier 2020');
    assert.strictEqual(getPeriodDescription('2019-01-21', null              ), '21 janvier 2019 → 31 décembre ∞');
    assert.strictEqual(getPeriodDescription(null,         '2019-01-22'      ), '1 janvier -∞ → 22 janvier 2019');
    assert.strictEqual(getPeriodDescription('2019-01-21', null,         's' ), '21 janvier 2019');
    assert.strictEqual(getPeriodDescription(null,         '2019-01-22', 's' ), '22 janvier 2019');
    assert.strictEqual(getPeriodDescription('2019-01-21', '2019-02-12', 's3'), '21 jan → 12 fév 2019');
  });

  // prettier-ignore
  it('#Test getCalcDate', function() {
    assert.strictEqual(DateConverters.getCalcDate('2017-01-05', '-2d'), '2017-01-03');
    assert.strictEqual(DateConverters.getCalcDate('2017-01-05', '3m' ), '2017-04-05');
    assert.strictEqual(DateConverters.getCalcDate('2017-01-05', '1y' ), '2018-01-05');
  });

  // prettier-ignore
  it('#Test getDOWDescription', function() {
    assert.strictEqual(getDOWDescription(0),                   'lundi');
    assert.strictEqual(getDOWDescription(1),                   'mardi');
    assert.strictEqual(getDOWDescription(6),                   'dimanche');
    assert.strictEqual(getDOWDescription(1, '3'),              'mar');
    assert.strictEqual(getDOWDescription(1, 'u3'),             'Mar');
    assert.strictEqual(getDOWDescription(1, 'firstUpperCase'), 'Mardi');
    assert.strictEqual(getDOWDescription(-1),                  '');
    assert.strictEqual(getDOWDescription(7),                   '');
  });

  // prettier-ignore
  it('#Test getMonthDescription', function() {
    assert.strictEqual(getMonthDescription(0),        'Janvier');
    assert.strictEqual(getMonthDescription(11),       'Décembre');
    assert.strictEqual(getMonthDescription(11),       'Décembre');
    assert.strictEqual(getMonthDescription(11, '1'),  'D');
    assert.strictEqual(getMonthDescription(11, '3'),  'Déc');
    assert.strictEqual(getMonthDescription(11, 'l'),  'décembre');
    assert.strictEqual(getMonthDescription(11, '3l'), 'déc');
    assert.strictEqual(getMonthDescription(-1),       "");
    assert.strictEqual(getMonthDescription(12),       "");
  });

  // prettier-ignore
  it('#Test getWeekOfYear', function() {
    assert.strictEqual(DateConverters.getWeekOfYear('2019-01-01'),  1);
    assert.strictEqual(DateConverters.getWeekOfYear('2019-01-21'),  3);
    assert.strictEqual(DateConverters.getWeekOfYear('2019-12-25'), 52);
    assert.strictEqual(DateConverters.getWeekOfYear('2019-12-31'),  1);
  });

  it('#Test check correct', function() {
    assert.ok(DateConverters.check('0000-00-00'));
    assert.ok(DateConverters.check('2017-03-31'));
  });

  it('#Test check wrong', function() {
    assert.ok(!DateConverters.check('2017/03/31'));
    assert.ok(!DateConverters.check('2017-3-31'));
    assert.ok(!DateConverters.check('2017-AB-31'));
    assert.ok(!DateConverters.check(''));
    assert.ok(!DateConverters.check(123));
    assert.ok(!DateConverters.check(null));
  });
});
