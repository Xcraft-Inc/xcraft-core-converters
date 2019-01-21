'use strict';

const assert = require('assert');
const DateConverters = require('../lib/date.js');
describe('Converter date', function() {
  it('#Test parseEdited', function() {
    let result;

    result = DateConverters.parseEdited('');
    assert.equal(result.value, null);
    assert.equal(result.error, null);

    result = DateConverters.parseEdited('31 3 2017');
    assert.equal(result.value, '2017-03-31');
    assert.equal(result.error, null);

    result = DateConverters.parseEdited('31', '2017-03-10');
    assert.equal(result.value, '2017-03-31');
    assert.equal(result.error, null);

    result = DateConverters.parseEdited('31 2 2017');
    assert.equal(result.value, '2017-03-03');
    assert.equal(result.error, 'Jour incorrect');
  });

  it('#Test getDisplayed', function() {
    assert.equal(DateConverters.getDisplayed('2017-03-31'), '31.03.2017');
    assert.equal(DateConverters.getDisplayed('2017-03-31', 'y'), '2017');
    assert.equal(DateConverters.getDisplayed('2017-03-31', 'My'), 'Mars 2017');
    assert.equal(DateConverters.getDisplayed('2017-03-31', 'M'), 'Mars');
    assert.equal(DateConverters.getDisplayed('2017-03-31', 'M3'), 'Mar');
    assert.equal(DateConverters.getDisplayed('2019-01-18', 'W'), 'vendredi');
    assert.equal(DateConverters.getDisplayed('2019-01-18', 'Wd'), 'ven 18');
    assert.equal(DateConverters.getDisplayed('2019-01-18', 'd'), '18');
    assert.equal(DateConverters.getDisplayed('2019-01-18', 'Wdm'), 'ven 18.01');
    assert.equal(
      DateConverters.getDisplayed('2019-01-18', 'Wdmy'),
      'ven 18.01.2019'
    );
    assert.equal(
      DateConverters.getDisplayed('2019-01-18', 'WdMy'),
      'Vendredi 18 janvier 2019'
    );
    assert.equal(
      DateConverters.getDisplayed('2019-01-18', 'dMy,W'),
      '18 janvier 2019, vendredi'
    );
    assert.equal(
      DateConverters.getDisplayed('2019-01-18', 'dMy'),
      '18 janvier 2019'
    );
    assert.equal(
      DateConverters.getDisplayed('2019-01-18', 'dM3y'),
      '18 jan 2019'
    );
    assert.equal(
      DateConverters.getDisplayed('2019-01-18', 'W dmy'),
      'Vendredi 18.01.2019'
    );
    assert.equal(DateConverters.getDisplayed('2019-01-18', 'W3'), 'Ven');
  });

  it('#Test getDisplayedBetweenTwoDates', function() {
    assert.equal(
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-25'),
      "Aujourd'hui"
    );
    assert.equal(
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-26'),
      'Demain'
    );
    assert.equal(
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-27'),
      'Après-demain'
    );
    assert.equal(
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-24'),
      'Hier'
    );
    assert.equal(
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-23'),
      'Avant-hier'
    );
    assert.equal(
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-31'),
      'Dans 6 jours'
    );
    assert.equal(
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-22'),
      'Dépassé de 3 jours'
    );
  });

  it('#Test getDaysBetweenTwoDates', function() {
    assert.equal(
      DateConverters.getDaysBetweenTwoDates('2017-02-20', '2017-03-01'),
      9
    );
    assert.equal(
      DateConverters.getDaysBetweenTwoDates('2017-02-20', '2018-02-20'),
      365
    );
    assert.equal(
      DateConverters.getDaysBetweenTwoDates('2018-02-20', '2017-02-20'),
      -365
    );
  });

  it('#Test moveAtEndingOfMonth', function() {
    assert.equal(
      DateConverters.moveAtEndingOfMonth('2017-02-15'),
      '2017-02-28'
    );
    assert.equal(
      DateConverters.moveAtEndingOfMonth('2017-03-31'),
      '2017-03-31'
    );
  });

  it('#Test moveAtBeginningOfMonth', function() {
    assert.equal(
      DateConverters.moveAtBeginningOfMonth('2017-02-15'),
      '2017-02-01'
    );
    assert.equal(
      DateConverters.moveAtBeginningOfMonth('2017-03-01'),
      '2017-03-01'
    );
  });

  it('#Test getPeriodDescription', function() {
    assert.equal(
      DateConverters.getPeriodDescription('2019-01-01', '2019-12-31'),
      '2019'
    );
    assert.equal(
      DateConverters.getPeriodDescription('2019-01-01', '2020-12-31'),
      '2019 → 2020'
    );
    assert.equal(
      DateConverters.getPeriodDescription('2019-01-01', '2019-03-31'),
      'Janvier → mars 2019'
    );
    assert.equal(
      DateConverters.getPeriodDescription('2018-10-01', '2019-03-31'),
      'Octobre 2018 → mars 2019'
    );
    assert.equal(
      DateConverters.getPeriodDescription('2019-01-21', '2019-01-26'),
      '21 → 26 janvier 2019'
    );
    assert.equal(
      DateConverters.getPeriodDescription('2019-01-21', '2019-02-12'),
      '21 janvier → 12 février 2019'
    );
    assert.equal(
      DateConverters.getPeriodDescription('2019-11-03', '2020-01-22'),
      '3 novembre 2019 → 22 janvier 2020'
    );
    assert.equal(
      DateConverters.getPeriodDescription('2019-01-21', null),
      '21 janvier 2019 → 31 décembre ∞'
    );
    assert.equal(
      DateConverters.getPeriodDescription(null, '2019-01-22'),
      '1 janvier -∞ → 22 janvier 2019'
    );
    assert.equal(
      DateConverters.getPeriodDescription('2019-01-21', null, 's'),
      '21 janvier 2019'
    );
    assert.equal(
      DateConverters.getPeriodDescription(null, '2019-01-22', 's'),
      '22 janvier 2019'
    );
    assert.equal(
      DateConverters.getPeriodDescription('2019-01-21', '2019-02-12', 's3'),
      '21 jan → 12 fév 2019'
    );
  });

  it('#Test getCalcDate', function() {
    assert.equal(DateConverters.getCalcDate('2017-01-05', '-2d'), '2017-01-03');
    assert.equal(DateConverters.getCalcDate('2017-01-05', '3m'), '2017-04-05');
    assert.equal(DateConverters.getCalcDate('2017-01-05', '1y'), '2018-01-05');
  });

  it('#Test getDOWDescription', function() {
    assert.equal(DateConverters.getDOWDescription(0), 'lundi');
    assert.equal(DateConverters.getDOWDescription(1), 'mardi');
    assert.equal(DateConverters.getDOWDescription(6), 'dimanche');
    assert.equal(DateConverters.getDOWDescription(1, '3'), 'mar');
    assert.equal(DateConverters.getDOWDescription(1, 'u3'), 'Mar');
    assert.equal(
      DateConverters.getDOWDescription(1, 'firstUpperCase'),
      'Mardi'
    );
    assert.equal(DateConverters.getDOWDescription(-1), null);
    assert.equal(DateConverters.getDOWDescription(7), null);
  });

  it('#Test getMonthDescription', function() {
    assert.equal(DateConverters.getMonthDescription(0), 'Janvier');
    assert.equal(DateConverters.getMonthDescription(11), 'Décembre');
    assert.equal(DateConverters.getMonthDescription(11), 'Décembre');
    assert.equal(DateConverters.getMonthDescription(11, '1'), 'D');
    assert.equal(DateConverters.getMonthDescription(11, '2'), 'Dé');
    assert.equal(DateConverters.getMonthDescription(11, '3'), 'Déc');
    assert.equal(DateConverters.getMonthDescription(11, '4'), 'Déce');
    assert.equal(DateConverters.getMonthDescription(11, 'l'), 'décembre');
    assert.equal(DateConverters.getMonthDescription(11, '3l'), 'déc');
    assert.equal(DateConverters.getMonthDescription(-1), null);
    assert.equal(DateConverters.getMonthDescription(12), null);
  });

  it('#Test check', function() {
    assert.ok(DateConverters.check('2017-03-31'));
    assert.ok(!DateConverters.check('2017/03/31'));
    assert.ok(!DateConverters.check('2017-3-31'));
    assert.ok(!DateConverters.check('2017-AB-31'));
    assert.ok(!DateConverters.check(''));
    assert.ok(!DateConverters.check(123));
    assert.ok(!DateConverters.check(null));
  });
});
