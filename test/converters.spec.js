'use strict';

const assert = require('assert');

const DateConverters = require('../lib/date.js');
const TimeConverters = require('../lib/time.js');
const DateTimeConverters = require('../lib/datetime.js');
const LengthConverters = require('../lib/length.js');
const NumberConverters = require('../lib/number.js');
const PriceConverters = require('../lib/price.js');
const PercentConverters = require('../lib/percent.js');
const VolumeConverters = require('../lib/volume.js');
const WeightConverters = require('../lib/weight.js');
const ReferenceConverters = require('../lib/reference.js');
const FieldType = require('../lib/field-type.js');

// To run all tests, type:
// npm test xcraft-core-converters

//-----------------------------------------------------------------------------
// date
//-----------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------
// time
//-----------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------
// datetime
//-----------------------------------------------------------------------------
describe('Converter datetime', function() {
  // UTC has a shift of 1 hour!
  //- TODO: Fix bug with UTC shift!
  //- it('#Test jsToCanonical', function() {
  //-   const js = new Date(2019, 1, 18, 14, 0, 0);
  //-   const c = DateTimeConverters.jsToCanonical(js);
  //-   assert.equal(c, '2019-01-18T13:00:00.000Z');
  //- });
  //-
  //- it('#Test canonicalToJs', function() {
  //-   const js = DateTimeConverters.canonicalToJs('2011-10-05T13:48:00.000Z');
  //-   assert.equal(js.getHours(), 14);
  //- });
  //-
  //- it('#Test parseEdited', function() {
  //-   let result;
  //-
  //-   result = DateTimeConverters.parseEdited('31 3 2017 13 41 0');
  //-   assert.equal(result.value, '2017-03-31T12:41:00.000Z');
  //-   assert.equal(result.error, null);
  //-
  //-   result = DateTimeConverters.parseEdited('10 3', '2017-03-31T12:42:00.000Z');
  //-   assert.equal(result.value, '2017-03-10T12:42:00.000Z');
  //-   assert.equal(result.error, null);
  //-
  //-   result = DateTimeConverters.parseEdited(
  //-     '10 3',
  //-     null,
  //-     '2017-03-31',
  //-     '12:43:00'
  //-   );
  //-   assert.equal(result.value, '2017-03-10T12:43:00.000Z');
  //-   assert.equal(result.error, null);
  //- });

  it('#Test getDisplayed', function() {
    assert.equal(
      DateTimeConverters.getDisplayed('2017-03-31T12:48:00.000Z'),
      '31.03.2017 14:48'
    );
    assert.equal(
      DateTimeConverters.getDisplayed('2017-03-31T12:48:00.000Z', 'date'),
      '31.03.2017'
    );
  });

  it('#Test check', function() {
    assert.ok(DateTimeConverters.check('2019-01-18T14:00:00.000Z'));
    assert.ok(!DateTimeConverters.check('2019-01-18T14:00:00'));
    assert.ok(!DateTimeConverters.check('2019-01-18t14:00:00.000Z'));
    assert.ok(!DateTimeConverters.check('coucou'));
  });
});

//-----------------------------------------------------------------------------
// length
//-----------------------------------------------------------------------------
describe('Converter length', function() {
  it('#Test parseEdited', function() {
    let result;

    result = LengthConverters.parseEdited('123', 'cm');
    assert.equal(result.value, '1.23');
    assert.equal(result.error, null);

    result = LengthConverters.parseEdited('12', 'm');
    assert.equal(result.value, '12');
    assert.equal(result.error, null);

    result = LengthConverters.parseEdited('2km', 'mm');
    assert.equal(result.value, '2000');
    assert.equal(result.error, null);

    result = LengthConverters.parseEdited('2', 'x');
    assert.equal(result.value, null);
    assert.equal(result.error, 'Unité "x" incorrecte');

    result = LengthConverters.parseEdited('2x');
    assert.equal(result.value, null);
    assert.equal(result.error, 'Unité "x" incorrecte');
  });

  it('#Test getDisplayed', function() {
    assert.equal(LengthConverters.getDisplayed('1.2'), '1.2m');
    assert.equal(LengthConverters.getDisplayed('1200', 'km'), '1.2km');
    assert.equal(LengthConverters.getDisplayed('12', 'cm'), '1200cm');
  });

  it('#Test check', function() {
    assert.ok(LengthConverters.check('123'));
    assert.ok(LengthConverters.check('.123'));
    assert.ok(LengthConverters.check('1.23'));
    assert.ok(!LengthConverters.check('-123'));
    assert.ok(!LengthConverters.check('123m'));
    assert.ok(!LengthConverters.check('123cm'));
    assert.ok(!LengthConverters.check('cm'));
  });
});

//-----------------------------------------------------------------------------
// number
//-----------------------------------------------------------------------------
describe('Converter number', function() {
  it('#Test parseEdited', function() {
    let result;

    result = NumberConverters.parseEdited('');
    assert.equal(result.value, null);
    assert.equal(result.error, null);

    result = NumberConverters.parseEdited('123');
    assert.equal(result.value, '123');
    assert.equal(result.error, null);

    result = NumberConverters.parseEdited('00123');
    assert.equal(result.value, '123');
    assert.equal(result.error, null);

    result = NumberConverters.parseEdited('+123');
    assert.equal(result.value, '123');
    assert.equal(result.error, null);

    result = NumberConverters.parseEdited('-123');
    assert.equal(result.value, '-123');
    assert.equal(result.error, null);

    result = NumberConverters.parseEdited('123.00');
    assert.equal(result.value, '123');
    assert.equal(result.error, null);

    result = NumberConverters.parseEdited('123.800');
    assert.equal(result.value, '123.8');
    assert.equal(result.error, null);

    result = NumberConverters.parseEdited('123.456789');
    assert.equal(result.value, '123.456789');
    assert.equal(result.error, null);

    result = NumberConverters.parseEdited('.123');
    assert.equal(result.value, '.123');
    assert.equal(result.error, null);

    result = NumberConverters.parseEdited('0.123');
    assert.equal(result.value, '.123');
    assert.equal(result.error, null);

    result = NumberConverters.parseEdited("1'000.00");
    assert.equal(result.value, '1000');
    assert.equal(result.error, null);

    result = NumberConverters.parseEdited('12a34');
    assert.equal(result.value, null);
    assert.ok(result.error);
  });

  it('#Test getDisplayed', function() {
    assert.equal(NumberConverters.getDisplayed('.12'), '0.12');
    assert.equal(NumberConverters.getDisplayed('.12456', 2), '0.12');
    assert.equal(NumberConverters.getDisplayed('.12456', 3), '0.125');
    assert.equal(NumberConverters.getDisplayed('.12456', 4), '0.1246');
    assert.equal(NumberConverters.getDisplayed('.12456', 5), '0.12456');
    assert.equal(NumberConverters.getDisplayed('.12456', 6), '0.12456');
  });

  it('#Test check', function() {
    assert.ok(NumberConverters.check('123'));
    assert.ok(NumberConverters.check('-123'));
    assert.ok(NumberConverters.check('.123'));
    assert.ok(NumberConverters.check('1.23'));
    assert.ok(!NumberConverters.check('123m'));
    assert.ok(!NumberConverters.check('123cm'));
    assert.ok(!NumberConverters.check('cm'));
    assert.ok(!NumberConverters.check(12));
  });
});

//-----------------------------------------------------------------------------
// price
//-----------------------------------------------------------------------------
describe('Converter price', function() {
  it('#Test parseEdited', function() {
    let result;

    result = PriceConverters.parseEdited('');
    assert.equal(result.value, null);
    assert.equal(result.error, null);

    result = PriceConverters.parseEdited('123.00');
    assert.equal(result.value, '123');
    assert.equal(result.error, null);

    result = PriceConverters.parseEdited('-123');
    assert.equal(result.value, '-123');
    assert.equal(result.error, null);

    result = PriceConverters.parseEdited('123.456');
    assert.equal(result.value, '123.46');
    assert.equal(result.error, null);

    result = PriceConverters.parseEdited("1'234.5");
    assert.equal(result.value, '1234.5');
    assert.equal(result.error, null);
  });

  it('#Test getDisplayed', function() {
    assert.equal(PriceConverters.getDisplayed('123'), '123.00');
    assert.equal(PriceConverters.getDisplayed('1234.5'), "1'234.50");
  });

  it('#Test check', function() {
    assert.ok(PriceConverters.check('123'));
    assert.ok(PriceConverters.check('123.456'));
    assert.ok(PriceConverters.check('-123'));
    assert.ok(!PriceConverters.check('-1x3'));
    assert.ok(!PriceConverters.check(100));
  });
});

//-----------------------------------------------------------------------------
// percent
//-----------------------------------------------------------------------------
describe('Converter percent', function() {
  it('#Test parseEdited', function() {
    let result;

    result = PercentConverters.parseEdited('');
    assert.equal(result.value, null);
    assert.equal(result.error, null);

    result = PercentConverters.parseEdited('45%');
    assert.equal(result.value, '0.45');
    assert.equal(result.error, null);

    result = PercentConverters.parseEdited('45.7%');
    assert.equal(result.value, '0.457');
    assert.equal(result.error, null);

    result = PercentConverters.parseEdited('.2%');
    assert.equal(result.value, '0.002');
    assert.equal(result.error, null);

    result = PercentConverters.parseEdited('.002%');
    assert.equal(result.value, '0.00002');
    assert.equal(result.error, null);

    result = PercentConverters.parseEdited('0.45');
    assert.equal(result.value, '0.45');
    assert.equal(result.error, null);

    result = PercentConverters.parseEdited('4%2');
    assert.equal(result.value, null);
    assert.ok(result.error);

    result = PercentConverters.parseEdited('abc');
    assert.equal(result.value, null);
    assert.ok(result.error);
  });

  it('#Test getDisplayed', function() {
    assert.equal(PercentConverters.getDisplayed('0.12'), '12%');
    assert.equal(PercentConverters.getDisplayed('0.12', 5), '12%');
    assert.equal(PercentConverters.getDisplayed('0.1234999', 2), '12.35%');
    assert.equal(PercentConverters.getDisplayed('0.123'), '12.3%');
  });

  it('#Test check', function() {
    assert.ok(PercentConverters.check('123'));
    assert.ok(PercentConverters.check('0.123'));
    assert.ok(!PercentConverters.check('-0.05'));
    assert.ok(!PercentConverters.check(5));
  });
});

//-----------------------------------------------------------------------------
// reference
//-----------------------------------------------------------------------------
describe('Converter reference', function() {
  it('#Test generate', function() {
    assert.equal(
      ReferenceConverters.generate('123', '2019-01-18', '5'),
      '00123.1901.5'
    );
    assert.equal(
      ReferenceConverters.generate('123', '2019-01-18', '5', '2'),
      '00123.1901.5-2'
    );
    assert.equal(
      ReferenceConverters.generate('123456', '2019-01-18', '567'),
      '23456.1901.7'
    );
  });

  it('#Test getWithoutNumber', function() {
    assert.equal(
      ReferenceConverters.getWithoutNumber('00123.1812.1'),
      '00123.1812'
    );
    assert.equal(
      ReferenceConverters.getWithoutNumber('00123.1812.2-3'),
      '00123.1812'
    );
  });

  it('#Test updateSubnumber', function() {
    assert.equal(
      ReferenceConverters.updateSubnumber('00123.1812.1', '5'),
      '00123.1812.1-5'
    );
    assert.equal(
      ReferenceConverters.updateSubnumber('00123.1812.1-4', '5'),
      '00123.1812.1-5'
    );
  });

  it('#Test getDisplayed', function() {
    assert.equal(
      ReferenceConverters.getDisplayed('123.1812.1'),
      '00123.1812.1'
    );
    assert.equal(
      ReferenceConverters.getDisplayed('123456.1812.1'),
      '23456.1812.1'
    );
    assert.equal(
      ReferenceConverters.getDisplayed('00123.1812.1'),
      '00123.1812.1'
    );
    assert.equal(
      ReferenceConverters.getDisplayed('00123.1812.1-3'),
      '00123.1812.1-3'
    );
  });
});

//-----------------------------------------------------------------------------
// field-type
//-----------------------------------------------------------------------------
describe('field-type', function() {
  it('#Test field-type string', function() {
    let result;

    result = FieldType.check('Blupi', 'Dupond', {type: 'string'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', '', {type: 'string'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', null, {type: 'string'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', undefined, {type: 'string'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', '', {type: 'string+'});
    assert.equal(result.ok, false);
  });

  it('#Test field-type bool', function() {
    let result;

    result = FieldType.check('Blupi', false, {type: 'bool'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', true, {type: 'bool'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', null, {type: 'bool'});
    assert.equal(result.ok, false);

    result = FieldType.check('Blupi', 'false', {type: 'bool'});
    assert.equal(result.ok, false);

    result = FieldType.check('Blupi', 'true', {type: 'bool'});
    assert.equal(result.ok, false);
  });

  it('#Test field-type number', function() {
    let result;

    result = FieldType.check('Blupi', null, {type: 'number'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', '', {type: 'number'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', '123', {type: 'number'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', '123.456', {type: 'number'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', '.123', {type: 'number'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', '-123', {type: 'number'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', 123, {type: 'number'});
    assert.equal(result.ok, false);

    result = FieldType.check('Blupi', '123,456', {type: 'number'});
    assert.equal(result.ok, false);
  });

  it('#Test field-type enum', function() {
    let result;

    result = FieldType.check('Blupi', 'A', {type: 'enum', values: ['A', 'B']});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', 'C', {type: 'enum', values: ['A', 'B']});
    assert.equal(result.ok, false);

    result = FieldType.check('Blupi', 'a', {type: 'enum', values: ['A', 'B']});
    assert.equal(result.ok, false);

    result = FieldType.check('Blupi', '', {type: 'enum', values: ['A', 'B']});
    assert.equal(result.ok, false);

    result = FieldType.check('Blupi', null, {type: 'enum', values: ['A', 'B']});
    assert.equal(result.ok, false);

    result = FieldType.check('Blupi', 'A', {type: 'enum'});
    assert.equal(result.ok, false);
  });

  it('#Test field-type entityId', function() {
    let result;

    result = FieldType.check('Blupi', 'toto@123', {
      type: 'entityId',
      target: 'toto',
    });
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', '456@123', {
      type: 'entityId',
      target: 'toto',
    });
    assert.equal(result.ok, false);

    result = FieldType.check('Blupi', '456@123', {type: 'entityId'});
    assert.equal(result.ok, false);
  });

  it('#Test field-type date', function() {
    let result;

    result = FieldType.check('Blupi', '2019-03-31', {type: 'date'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', '', {type: 'date'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', null, {type: 'date'});
    assert.equal(result.ok, true);

    result = FieldType.check('Blupi', null, {type: 'date+'});
    assert.equal(result.ok, false);
  });
});
