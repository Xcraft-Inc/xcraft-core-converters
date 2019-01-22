'use strict';

// To run test:
// npm test xcraft-core-converters

const assert = require('assert');
const DateConverters = require('../lib/date.js');
describe('Converter date', function() {
  it('#Test parseEdited', function() {
    let result;

    result = DateConverters.parseEdited('');
    assert.equal(null, result.value);
    assert.equal(null, result.error);

    result = DateConverters.parseEdited('31 3 2017');
    assert.equal('2017-03-31', result.value);
    assert.equal(null, result.error);

    result = DateConverters.parseEdited('31', '2017-03-10');
    assert.equal('2017-03-31', result.value);
    assert.equal(null, result.error);

    result = DateConverters.parseEdited('31 2 2017');
    assert.equal('2017-03-03', result.value);
    assert.equal('Jour incorrect', result.error);
  });

  it('#Test getDisplayed', function() {
    assert.equal('31.03.2017', DateConverters.getDisplayed('2017-03-31'));
    assert.equal('2017', DateConverters.getDisplayed('2017-03-31', 'y'));
    assert.equal('Mars 2017', DateConverters.getDisplayed('2017-03-31', 'My'));
    assert.equal('Mars', DateConverters.getDisplayed('2017-03-31', 'M'));
    assert.equal('Mar', DateConverters.getDisplayed('2017-03-31', 'M3'));
    assert.equal('vendredi', DateConverters.getDisplayed('2019-01-18', 'W'));
    assert.equal('ven 18', DateConverters.getDisplayed('2019-01-18', 'Wd'));
    assert.equal('18', DateConverters.getDisplayed('2019-01-18', 'd'));
    assert.equal('ven 18.01', DateConverters.getDisplayed('2019-01-18', 'Wdm'));
    assert.equal(
      'ven 18.01.2019',
      DateConverters.getDisplayed('2019-01-18', 'Wdmy')
    );
    assert.equal(
      'Vendredi 18 janvier 2019',
      DateConverters.getDisplayed('2019-01-18', 'WdMy')
    );
    assert.equal(
      '18 janvier 2019, vendredi',
      DateConverters.getDisplayed('2019-01-18', 'dMy,W')
    );
    assert.equal(
      '18 janvier 2019',
      DateConverters.getDisplayed('2019-01-18', 'dMy')
    );
    assert.equal(
      '18 jan 2019',
      DateConverters.getDisplayed('2019-01-18', 'dM3y')
    );
    assert.equal(
      'Vendredi 18.01.2019',
      DateConverters.getDisplayed('2019-01-18', 'W dmy')
    );
    assert.equal(DateConverters.getDisplayed('2019-01-18', 'W3'), 'Ven');
  });

  it('#Test getDisplayedBetweenTwoDates', function() {
    assert.equal(
      "Aujourd'hui",
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-25')
    );
    assert.equal(
      'Demain',
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-26')
    );
    assert.equal(
      'Après-demain',
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-27')
    );
    assert.equal(
      'Hier',
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-24')
    );
    assert.equal(
      'Avant-hier',
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-23')
    );
    assert.equal(
      'Dans 6 jours',
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-31')
    );
    assert.equal(
      'Dépassé de 3 jours',
      DateConverters.getDisplayedBetweenTwoDates('2019-12-25', '2019-12-22')
    );
  });

  it('#Test getDaysBetweenTwoDates', function() {
    assert.equal(
      9,
      DateConverters.getDaysBetweenTwoDates('2017-02-20', '2017-03-01')
    );
    assert.equal(
      365,
      DateConverters.getDaysBetweenTwoDates('2017-02-20', '2018-02-20')
    );
    assert.equal(
      -365,
      DateConverters.getDaysBetweenTwoDates('2018-02-20', '2017-02-20')
    );
  });

  it('#Test moveAtEndingOfMonth', function() {
    assert.equal(
      '2017-02-28',
      DateConverters.moveAtEndingOfMonth('2017-02-15')
    );
    assert.equal(
      '2017-03-31',
      DateConverters.moveAtEndingOfMonth('2017-03-31')
    );
  });

  it('#Test moveAtBeginningOfMonth', function() {
    assert.equal(
      '2017-02-01',
      DateConverters.moveAtBeginningOfMonth('2017-02-15')
    );
    assert.equal(
      '2017-03-01',
      DateConverters.moveAtBeginningOfMonth('2017-03-01')
    );
  });

  it('#Test getPeriodDescription', function() {
    assert.equal(
      '2019',
      DateConverters.getPeriodDescription('2019-01-01', '2019-12-31')
    );
    assert.equal(
      '2019 → 2020',
      DateConverters.getPeriodDescription('2019-01-01', '2020-12-31')
    );
    assert.equal(
      'Janvier → mars 2019',
      DateConverters.getPeriodDescription('2019-01-01', '2019-03-31')
    );
    assert.equal(
      'Octobre 2018 → mars 2019',
      DateConverters.getPeriodDescription('2018-10-01', '2019-03-31')
    );
    assert.equal(
      '21 → 26 janvier 2019',
      DateConverters.getPeriodDescription('2019-01-21', '2019-01-26')
    );
    assert.equal(
      '21 janvier → 12 février 2019',
      DateConverters.getPeriodDescription('2019-01-21', '2019-02-12')
    );
    assert.equal(
      '3 novembre 2019 → 22 janvier 2020',
      DateConverters.getPeriodDescription('2019-11-03', '2020-01-22')
    );
    assert.equal(
      '21 janvier 2019 → 31 décembre ∞',
      DateConverters.getPeriodDescription('2019-01-21', null)
    );
    assert.equal(
      '1 janvier -∞ → 22 janvier 2019',
      DateConverters.getPeriodDescription(null, '2019-01-22')
    );
    assert.equal(
      '21 janvier 2019',
      DateConverters.getPeriodDescription('2019-01-21', null, 's')
    );
    assert.equal(
      '22 janvier 2019',
      DateConverters.getPeriodDescription(null, '2019-01-22', 's')
    );
    assert.equal(
      '21 jan → 12 fév 2019',
      DateConverters.getPeriodDescription('2019-01-21', '2019-02-12', 's3')
    );
  });

  it('#Test getCalcDate', function() {
    assert.equal('2017-01-03', DateConverters.getCalcDate('2017-01-05', '-2d'));
    assert.equal('2017-04-05', DateConverters.getCalcDate('2017-01-05', '3m'));
    assert.equal('2018-01-05', DateConverters.getCalcDate('2017-01-05', '1y'));
  });

  it('#Test getDOWDescription', function() {
    assert.equal('lundi', DateConverters.getDOWDescription(0));
    assert.equal('mardi', DateConverters.getDOWDescription(1));
    assert.equal('dimanche', DateConverters.getDOWDescription(6));
    assert.equal('mar', DateConverters.getDOWDescription(1, '3'));
    assert.equal('Mar', DateConverters.getDOWDescription(1, 'u3'));
    assert.equal(
      'Mardi',
      DateConverters.getDOWDescription(1, 'firstUpperCase')
    );
    assert.equal(null, DateConverters.getDOWDescription(-1));
    assert.equal(null, DateConverters.getDOWDescription(7));
  });

  it('#Test getMonthDescription', function() {
    assert.equal('Janvier', DateConverters.getMonthDescription(0));
    assert.equal('Décembre', DateConverters.getMonthDescription(11));
    assert.equal('Décembre', DateConverters.getMonthDescription(11));
    assert.equal('D', DateConverters.getMonthDescription(11, '1'));
    assert.equal('Dé', DateConverters.getMonthDescription(11, '2'));
    assert.equal('Déc', DateConverters.getMonthDescription(11, '3'));
    assert.equal('Déce', DateConverters.getMonthDescription(11, '4'));
    assert.equal('décembre', DateConverters.getMonthDescription(11, 'l'));
    assert.equal('déc', DateConverters.getMonthDescription(11, '3l'));
    assert.equal(null, DateConverters.getMonthDescription(-1));
    assert.equal(null, DateConverters.getMonthDescription(12));
  });

  it('#Test getWeekOfYear', function() {
    assert.equal(1, DateConverters.getWeekOfYear('2019-01-01'));
    assert.equal(3, DateConverters.getWeekOfYear('2019-01-21'));
    assert.equal(52, DateConverters.getWeekOfYear('2019-12-25'));
    assert.equal(1, DateConverters.getWeekOfYear('2019-12-31'));
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
