'use strict';

const assert = require('assert');
const TimeConverters = require('../lib/time.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

function getDisplayed(canonical, format) {
  const s = TimeConverters.getDisplayed(canonical, format);
  return StringBuilder._toFlatten(s);
}

function getDisplayedBetweenTwoTimes(time1, time2, format) {
  const s = TimeConverters.getDisplayedBetweenTwoTimes(time1, time2, format);
  return StringBuilder._toFlatten(s);
}

//-----------------------------------------------------------------------------

describe('Converter time', function() {
  // prettier-ignore
  it('#Test jsToCanonical', function() {
    assert.strictEqual(TimeConverters.jsToCanonical(new Date(2019, 12, 25,  0,  0,  0)), '00:00:00');
    assert.strictEqual(TimeConverters.jsToCanonical(new Date(2019, 12, 25, 13, 20, 30)), '13:20:30');
    assert.strictEqual(TimeConverters.jsToCanonical(new Date(2019, 12, 25, 23, 59, 59)), '23:59:59');
  });

  // prettier-ignore
  it('#Test canonicalToJs', function() {
    assert.strictEqual(TimeConverters.canonicalToJs("00:00:00").toISOString(), new Date(2000, 0, 1,  0,  0,  0).toISOString());
    assert.strictEqual(TimeConverters.canonicalToJs("09:30:00").toISOString(), new Date(2000, 0, 1,  9, 30,  0).toISOString());
    assert.strictEqual(TimeConverters.canonicalToJs("23:59:59").toISOString(), new Date(2000, 0, 1, 23, 59, 59).toISOString());
  });

  // prettier-ignore
  it('#Test getHours', function() {
    assert.strictEqual(TimeConverters.getHours("00:00:00"),  0);
    assert.strictEqual(TimeConverters.getHours("12:00:00"), 12);
    assert.strictEqual(TimeConverters.getHours("23:00:00"), 23);
  });

  // prettier-ignore
  it('#Test addHours', function() {
    assert.strictEqual(TimeConverters.addHours("00:00:00", 1), "01:00:00");
    assert.strictEqual(TimeConverters.addHours("00:30:02", 1), "01:30:02");
    assert.strictEqual(TimeConverters.addHours("17:30:02", 3), "20:30:02");
  });

  it('#Test parseEdited', function() {
    let result;

    result = TimeConverters.parseEdited('14');
    assert.strictEqual(result.value, '14:00:00');
    assert.strictEqual(result.error, null);

    result = TimeConverters.parseEdited('14 5');
    assert.strictEqual(result.value, '14:05:00');
    assert.strictEqual(result.error, null);

    result = TimeConverters.parseEdited('14 5 20');
    assert.strictEqual(result.value, '14:05:20');
    assert.strictEqual(result.error, null);

    result = TimeConverters.parseEdited('30');
    assert.strictEqual(result.value, '00:30:00');
    assert.strictEqual(result.error, null);

    result = TimeConverters.parseEdited('930');
    assert.strictEqual(result.value, '09:30:00');
    assert.strictEqual(result.error, null);

    result = TimeConverters.parseEdited('1620');
    assert.strictEqual(result.value, '16:20:00');
    assert.strictEqual(result.error, null);

    result = TimeConverters.parseEdited('14', '15:30:59');
    assert.strictEqual(result.value, '14:30:59');
    assert.strictEqual(result.error, null);
  });

  // prettier-ignore
  it('#Test invalid parseEdited', function() {
    let result;

    result = TimeConverters.parseEdited('23 60');
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Minutes incorrectes}');

    result = TimeConverters.parseEdited('960');
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Minutes incorrectes}');

    result = TimeConverters.parseEdited('2400');
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Heure incorrecte}');
  });

  it('#Test getDisplayed without format', function() {
    assert.strictEqual(typeof getDisplayed('12:34:56'), 'string');
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.strictEqual(getDisplayed('12:34:56'            ), '12:34');
    assert.strictEqual(getDisplayed('12:34:56', 'hms'     ), '12:34:56');
    assert.strictEqual(getDisplayed('01:00:45', 'Hm'      ), '1 @{heure}');
    assert.strictEqual(getDisplayed('01:30:45', 'Hm'      ), '1 @{heure} 30');
    assert.strictEqual(getDisplayed('09:30:45', 'Hm'      ), '9 @{heures} 30');
    assert.strictEqual(getDisplayed('09:30:45', 'duration'), '9h30');
    assert.strictEqual(getDisplayed('09:00:45', 'duration'), '9h');
    assert.strictEqual(getDisplayed('00:15:45', 'duration'), '15min');
  });

  it('#Test getNowCanonical', function() {
    assert.ok(TimeConverters.getNowCanonical('12:34:56').endsWith(':00'));
  });

  it('#Test getSortable', function() {
    assert.strictEqual(TimeConverters.getSortable('12:34:56'), '1234');
    assert.strictEqual(TimeConverters.getSortable('07:34:56'), '0734');
  });

  // prettier-ignore
  it('#Test getCalcTime', function() {
    assert.strictEqual(TimeConverters.getCalcTime('14:30:00', '-2h'), '12:30:00');
    assert.strictEqual(TimeConverters.getCalcTime('14:30:00', '10m'), '14:40:00');
    assert.strictEqual(TimeConverters.getCalcTime('14:30:00', '2s' ), '14:30:02');
  });

  // prettier-ignore
  it('#Test getDisplayedBetweenTwoTimes', function() {
    assert.strictEqual(getDisplayedBetweenTwoTimes('14:30:00', '14:30:00'), '@{time|between-two-times|Maintenant}');
    assert.strictEqual(getDisplayedBetweenTwoTimes('14:30:00', '14:45:00'), '@{time|between-two-times|Dans} 15 @{minutes}');
    assert.strictEqual(getDisplayedBetweenTwoTimes('14:30:00', '15:30:00'), '@{time|between-two-times|Dans} 1 @{heure}');
    assert.strictEqual(getDisplayedBetweenTwoTimes('14:30:00', '16:30:00'), '@{time|between-two-times|Dans} 2 @{heures}');
    assert.strictEqual(getDisplayedBetweenTwoTimes('14:30:00', '18:15:00'), '@{time|between-two-times|Dans} 3 @{heures} 45 @{minutes}');
    assert.strictEqual(getDisplayedBetweenTwoTimes('14:30:00', '14:29:00'), '@{time|between-two-times|Dépassé de} 1 @{minute}');
  });

  // prettier-ignore
  it('#Test getPeriodDescription', function() {
    assert.strictEqual(TimeConverters.getPeriodDescription('14:30:00', null               ), '14:30');
    assert.strictEqual(TimeConverters.getPeriodDescription(null,       '15:10:00'         ), '15:10');
    assert.strictEqual(TimeConverters.getPeriodDescription('14:30:00', '14:30:00'         ), '14:30');
    assert.strictEqual(TimeConverters.getPeriodDescription('14:30:00', '15:10:00'         ), '14:30 → 15:10');
    assert.strictEqual(TimeConverters.getPeriodDescription('14:30:00', '15:10:00', 'ft'   ), '14:30 15:10');
    assert.strictEqual(TimeConverters.getPeriodDescription('14:30:00', '15:10:00', 'f-t'  ), '14:30—15:10');
    assert.strictEqual(TimeConverters.getPeriodDescription('14:30:00', '15:10:00', 'f - t'), '14:30 — 15:10');
  });

  // prettier-ignore
  it('#Test getTotalMinutes', function() {
    assert.strictEqual(TimeConverters.getTotalMinutes('08:34:00'), 8 * 60 + 34);
    assert.strictEqual(TimeConverters.getTotalMinutes('08:34:59'), 8 * 60 + 34);
  });

  // prettier-ignore
  it('#Test getTimeFromMinutes', function() {
    assert.strictEqual(TimeConverters.getTimeFromMinutes(0          ), '00:00:00');
    assert.strictEqual(TimeConverters.getTimeFromMinutes(8 * 60 + 34), '08:34:00');
  });

  it('#Test check correct', function() {
    assert.ok(TimeConverters.check('00:00:00'));
    assert.ok(TimeConverters.check('08:10:30'));
    assert.ok(TimeConverters.check('23:59:59'));
  });

  it('#Test check wrong', function() {
    assert.ok(!TimeConverters.check('12:00'));
    assert.ok(!TimeConverters.check('12.00.00'));
    assert.ok(!TimeConverters.check(''));
    assert.ok(!TimeConverters.check(123));
    assert.ok(!TimeConverters.check(null));
  });
});
