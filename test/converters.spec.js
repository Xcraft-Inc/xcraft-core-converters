'use strict';

const assert = require('assert');

const DateConverters = require('../lib/date.js');
const TimeConverters = require('../lib/time.js');

// To run all tests, type:
// npm test --prefix lib/xcraft-core-converters/

describe('Converters can', function() {
  //-----------------------------------------------------------------------------
  // date
  //-----------------------------------------------------------------------------
  it('#Test date parseEdited', function() {
    let result;

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

  it('#Test date getDisplayed', function() {
    assert.equal(DateConverters.getDisplayed('2017-03-31'), '31.03.2017');
    assert.equal(DateConverters.getDisplayed('2017-03-31', 'y'), '2017');
    assert.equal(DateConverters.getDisplayed('2017-03-31', 'M'), 'Mars');
    assert.equal(DateConverters.getDisplayed('2017-03-31', 'M3'), 'Mar');
    assert.equal(DateConverters.getDisplayed('2019-01-18', 'W'), 'vendredi');
    assert.equal(
      DateConverters.getDisplayed('2019-01-18', 'dMy,W'),
      '18 janvier 2019, vendredi'
    );
    assert.equal(
      DateConverters.getDisplayed('2019-01-18', 'W dmy'),
      'Vendredi 18.01.2019'
    );
    assert.equal(
      DateConverters.getDisplayed('2019-01-18', 'dM3y'),
      '18 jan 2019'
    );
  });

  it('#Test date check', function() {
    assert.ok(DateConverters.check('2017-03-31'));
    assert.ok(!DateConverters.check('2017/03/31'));
    assert.ok(!DateConverters.check('2017-3-31'));
    assert.ok(!DateConverters.check('2017-AB-31'));
  });

  //-----------------------------------------------------------------------------
  // time
  //-----------------------------------------------------------------------------
  it('#Test time parseEdited', function() {
    let result;

    result = TimeConverters.parseEdited('14 5 0');
    assert.equal(result.value, '14:05:00');
    assert.equal(result.error, null);

    result = TimeConverters.parseEdited('14', '15:30:00');
    assert.equal(result.value, '14:30:00');
    assert.equal(result.error, null);
  });

  it('#Test time getDisplayed', function() {
    assert.equal(TimeConverters.getDisplayed('12:34:56'), '12:34');
    assert.equal(TimeConverters.getDisplayed('12:34:56', 'hms'), '12:34:56');
    assert.equal(TimeConverters.getDisplayed('01:00:45', 'Hm'), '1 heure');
    assert.equal(TimeConverters.getDisplayed('01:30:45', 'Hm'), '1 heure 30');
    assert.equal(TimeConverters.getDisplayed('09:30:45', 'Hm'), '9 heures 30');
    assert.equal(TimeConverters.getDisplayed('09:30:45', 'duration'), '9h30');
    assert.equal(TimeConverters.getDisplayed('09:00:45', 'duration'), '9h');
    assert.equal(TimeConverters.getDisplayed('00:15:45', 'duration'), '15min');
  });

  it('#Test time check', function() {
    assert.ok(TimeConverters.check('08:59:59'));
    assert.ok(!TimeConverters.check('12:00'));
    assert.ok(!TimeConverters.check('12.00.00'));
  });
  //-----------------------------------------------------------------------------
});
