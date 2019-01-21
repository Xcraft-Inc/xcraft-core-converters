'use strict';

const assert = require('assert');
const TimeConverters = require('../lib/time.js');

describe('Converter time', function() {
  it('#Test parseEdited', function() {
    let result;

    result = TimeConverters.parseEdited('14');
    assert.equal('14:00:00', result.value);
    assert.equal(null, result.error);

    result = TimeConverters.parseEdited('14 5');
    assert.equal('14:05:00', result.value);
    assert.equal(null, result.error);

    result = TimeConverters.parseEdited('14 5 20');
    assert.equal('14:05:20', result.value);
    assert.equal(null, result.error);

    result = TimeConverters.parseEdited('930');
    assert.equal('09:30:00', result.value);
    assert.equal(null, result.error);

    result = TimeConverters.parseEdited('1620');
    assert.equal('16:20:00', result.value);
    assert.equal(null, result.error);

    result = TimeConverters.parseEdited('14', '15:30:59');
    assert.equal('14:30:59', result.value);
    assert.equal(null, result.error);
  });

  it('#Test getDisplayed', function() {
    assert.equal('12:34', TimeConverters.getDisplayed('12:34:56'));
    assert.equal('12:34:56', TimeConverters.getDisplayed('12:34:56', 'hms'));
    assert.equal('1 heure', TimeConverters.getDisplayed('01:00:45', 'Hm'));
    assert.equal('1 heure 30', TimeConverters.getDisplayed('01:30:45', 'Hm'));
    assert.equal('9 heures 30', TimeConverters.getDisplayed('09:30:45', 'Hm'));
    assert.equal('9h30', TimeConverters.getDisplayed('09:30:45', 'duration'));
    assert.equal('9h', TimeConverters.getDisplayed('09:00:45', 'duration'));
    assert.equal('15min', TimeConverters.getDisplayed('00:15:45', 'duration'));
  });

  it('#Test getNowCanonical', function() {
    assert.ok(TimeConverters.getNowCanonical('12:34:56').endsWith(':00'));
  });

  it('#Test getSortable', function() {
    assert.equal('1234', TimeConverters.getSortable('12:34:56'));
    assert.equal('0734', TimeConverters.getSortable('07:34:56'));
  });

  it('#Test getCalcTime', function() {
    assert.equal('12:30:00', TimeConverters.getCalcTime('14:30:00', '-2h'));
    assert.equal('14:40:00', TimeConverters.getCalcTime('14:30:00', '10m'));
    assert.equal('14:30:02', TimeConverters.getCalcTime('14:30:00', '2s'));
  });

  it('#Test getDisplayedBetweenTwoTimes', function() {
    assert.equal(
      'Maintenant',
      TimeConverters.getDisplayedBetweenTwoTimes('14:30:00', '14:30:00')
    );
    assert.equal(
      'Dans 15 minutes',
      TimeConverters.getDisplayedBetweenTwoTimes('14:30:00', '14:45:00')
    );
    assert.equal(
      'Dans 1 heure',
      TimeConverters.getDisplayedBetweenTwoTimes('14:30:00', '15:30:00')
    );
    assert.equal(
      'Dans 2 heures',
      TimeConverters.getDisplayedBetweenTwoTimes('14:30:00', '16:30:00')
    );
    assert.equal(
      'Dans 3 heures 45 minutes',
      TimeConverters.getDisplayedBetweenTwoTimes('14:30:00', '18:15:00')
    );
    assert.equal(
      'Dépassé de 1 minute',
      TimeConverters.getDisplayedBetweenTwoTimes('14:30:00', '14:29:00')
    );
  });

  it('#Test getPeriodDescription', function() {
    assert.equal(
      '14:30',
      TimeConverters.getPeriodDescription('14:30:00', null)
    );
    assert.equal(
      '15:10',
      TimeConverters.getPeriodDescription(null, '15:10:00')
    );
    assert.equal(
      '14:30',
      TimeConverters.getPeriodDescription('14:30:00', '14:30:00')
    );
    assert.equal(
      '14:30 → 15:10',
      TimeConverters.getPeriodDescription('14:30:00', '15:10:00')
    );
    assert.equal(
      '14:30 15:10',
      TimeConverters.getPeriodDescription('14:30:00', '15:10:00', 'ft')
    );
    assert.equal(
      '14:30—15:10',
      TimeConverters.getPeriodDescription('14:30:00', '15:10:00', 'f-t')
    );
    assert.equal(
      '14:30 — 15:10',
      TimeConverters.getPeriodDescription('14:30:00', '15:10:00', 'f - t')
    );
  });

  it('#Test getTotalMinutes', function() {
    assert.equal(8 * 60 + 34, TimeConverters.getTotalMinutes('08:34:00'));
    assert.equal(8 * 60 + 34, TimeConverters.getTotalMinutes('08:34:59'));
  });

  it('#Test getTimeFromMinutes', function() {
    assert.equal('00:00:00', TimeConverters.getTimeFromMinutes(0));
    assert.equal('08:34:00', TimeConverters.getTimeFromMinutes(8 * 60 + 34));
  });

  it('#Test jsToCanonical', function() {
    assert.equal(
      '13:20:30',
      TimeConverters.jsToCanonical(new Date(2019, 12, 25, 13, 20, 30))
    );
  });

  it('#Test check', function() {
    assert.ok(TimeConverters.check('08:59:59'));
    assert.ok(!TimeConverters.check('12:00'));
    assert.ok(!TimeConverters.check('12.00.00'));
    assert.ok(!TimeConverters.check(''));
    assert.ok(!TimeConverters.check(123));
    assert.ok(!TimeConverters.check(null));
  });
});