'use strict';

const assert = require('assert');
const TimeConverters = require('../lib/time.js');

describe('Converter time', function() {
  it('#Test parseEdited', function() {
    let result;

    result = TimeConverters.parseEdited('14');
    assert.equal(result.value, '14:00:00');
    assert.equal(result.error, null);

    result = TimeConverters.parseEdited('14 5');
    assert.equal(result.value, '14:05:00');
    assert.equal(result.error, null);

    result = TimeConverters.parseEdited('14 5 20');
    assert.equal(result.value, '14:05:20');
    assert.equal(result.error, null);

    result = TimeConverters.parseEdited('930');
    assert.equal(result.value, '09:30:00');
    assert.equal(result.error, null);

    result = TimeConverters.parseEdited('1620');
    assert.equal(result.value, '16:20:00');
    assert.equal(result.error, null);

    result = TimeConverters.parseEdited('14', '15:30:59');
    assert.equal(result.value, '14:30:59');
    assert.equal(result.error, null);
  });

  it('#Test getNowCanonical', function() {
    assert.ok(TimeConverters.getNowCanonical('12:34:56').endsWith(':00'));
  });

  it('#Test getSortable', function() {
    assert.equal(TimeConverters.getSortable('12:34:56'), '1234');
    assert.equal(TimeConverters.getSortable('07:34:56'), '0734');
  });

  it('#Test getCalcTime', function() {
    assert.equal(TimeConverters.getCalcTime('14:30:00', '-2h'), '12:30:00');
    assert.equal(TimeConverters.getCalcTime('14:30:00', '10m'), '14:40:00');
    assert.equal(TimeConverters.getCalcTime('14:30:00', '2s'), '14:30:02');
  });

  it('#Test getDisplayedBetweenTwoTimes', function() {
    assert.equal(
      TimeConverters.getDisplayedBetweenTwoTimes('14:30:00', '14:30:00'),
      'Maintenant'
    );
    assert.equal(
      TimeConverters.getDisplayedBetweenTwoTimes('14:30:00', '14:45:00'),
      'Dans 15 minutes'
    );
    assert.equal(
      TimeConverters.getDisplayedBetweenTwoTimes('14:30:00', '15:30:00'),
      'Dans 1 heure'
    );
    assert.equal(
      TimeConverters.getDisplayedBetweenTwoTimes('14:30:00', '16:30:00'),
      'Dans 2 heures'
    );
    assert.equal(
      TimeConverters.getDisplayedBetweenTwoTimes('14:30:00', '18:15:00'),
      'Dans 3 heures 45 minutes'
    );
    assert.equal(
      TimeConverters.getDisplayedBetweenTwoTimes('14:30:00', '14:29:00'),
      'Dépassé de 1 minute'
    );
  });

  it('#Test getPeriodDescription', function() {
    assert.equal(
      TimeConverters.getPeriodDescription('14:30:00', null),
      '14:30'
    );
    assert.equal(
      TimeConverters.getPeriodDescription(null, '15:10:00'),
      '15:10'
    );
    assert.equal(
      TimeConverters.getPeriodDescription('14:30:00', '14:30:00'),
      '14:30'
    );
    assert.equal(
      TimeConverters.getPeriodDescription('14:30:00', '15:10:00'),
      '14:30 → 15:10'
    );
    assert.equal(
      TimeConverters.getPeriodDescription('14:30:00', '15:10:00', 'ft'),
      '14:30 15:10'
    );
    assert.equal(
      TimeConverters.getPeriodDescription('14:30:00', '15:10:00', 'f-t'),
      '14:30—15:10'
    );
    assert.equal(
      TimeConverters.getPeriodDescription('14:30:00', '15:10:00', 'f - t'),
      '14:30 — 15:10'
    );
  });

  it('#Test getTotalMinutes', function() {
    assert.equal(TimeConverters.getTotalMinutes('08:34:00'), 8 * 60 + 34);
    assert.equal(TimeConverters.getTotalMinutes('08:34:59'), 8 * 60 + 34);
  });

  it('#Test getTimeFromMinutes', function() {
    assert.equal(TimeConverters.getTimeFromMinutes(0), '00:00:00');
    assert.equal(TimeConverters.getTimeFromMinutes(8 * 60 + 34), '08:34:00');
  });

  it('#Test jsToCanonical', function() {
    assert.equal(
      TimeConverters.jsToCanonical(new Date(2019, 12, 25, 13, 20, 30)),
      '13:20:30'
    );
  });

  it('#Test getDisplayed', function() {
    assert.equal(TimeConverters.getDisplayed('12:34:56'), '12:34');
    assert.equal(TimeConverters.getDisplayed('12:34:56', 'hms'), '12:34:56');
    assert.equal(TimeConverters.getDisplayed('01:00:45', 'Hm'), '1 heure');
    assert.equal(TimeConverters.getDisplayed('01:30:45', 'Hm'), '1 heure 30');
    assert.equal(TimeConverters.getDisplayed('09:30:45', 'Hm'), '9 heures 30');
    assert.equal(TimeConverters.getDisplayed('09:30:45', 'duration'), '9h30');
    assert.equal(TimeConverters.getDisplayed('09:00:45', 'duration'), '9h');
    assert.equal(TimeConverters.getDisplayed('00:15:45', 'duration'), '15min');
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
