'use strict';

const assert = require('assert');
const WeightConverters = require('../lib/weight.js');

//-----------------------------------------------------------------------------

describe('Converter weight', function() {
  it('#Test parseEdited', function() {
    let result;

    result = WeightConverters.parseEdited('');
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = WeightConverters.parseEdited('123', 'g');
    assert.strictEqual(result.value, '0.123');
    assert.strictEqual(result.error, null);

    result = WeightConverters.parseEdited('2t', 'mg');
    assert.strictEqual(result.value, '2000');
    assert.strictEqual(result.error, null);

    result = WeightConverters.parseEdited('12', 'kg');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = WeightConverters.parseEdited('12.3', 'kg');
    assert.strictEqual(result.value, '12.3');
    assert.strictEqual(result.error, null);

    result = WeightConverters.parseEdited('12.3456', 'kg');
    assert.strictEqual(result.value, '12.346');
    assert.strictEqual(result.error, null);
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.strictEqual(WeightConverters.getDisplayed(null), null);
    assert.strictEqual(WeightConverters.getDisplayed('1.2', 'g'), '1200g');
  });

  // prettier-ignore
  it('#Test convertWeight', function() {
    assert.strictEqual(WeightConverters.convertWeight('12',      'kg', 'kg'   ), '12');
    assert.strictEqual(WeightConverters.convertWeight('12',      'kg', 'kg', 3), '12');
    assert.strictEqual(WeightConverters.convertWeight('1.2',     'g',  'mg', 3), '1200');
    assert.strictEqual(WeightConverters.convertWeight('0.03',    't',  'kg', 3), '30');
    assert.strictEqual(WeightConverters.convertWeight('1.23456', 'kg', 'kg'   ), '1.235');
    assert.strictEqual(WeightConverters.convertWeight('1.23456', 'kg', 'kg', 0), '1');
    assert.strictEqual(WeightConverters.convertWeight('1.23456', 'kg', 'kg', 1), '1.2');
    assert.strictEqual(WeightConverters.convertWeight('1.23456', 'kg', 'kg', 2), '1.23');
    assert.strictEqual(WeightConverters.convertWeight('1.23456', 'kg', 'kg', 3), '1.235');
    assert.strictEqual(WeightConverters.convertWeight('1.23456', 'kg', 'kg', 4), '1.2346');
    assert.strictEqual(WeightConverters.convertWeight('1.23456', 'kg', 'kg', 5), '1.23456');
    assert.strictEqual(WeightConverters.convertWeight('1.23456', 'kg', 'kg', 6), '1.23456');
  });

  // prettier-ignore
  it('#Test getSortable', function() {
    assert.strictEqual(WeightConverters.getSortable('12'         ), '00000012000000');
    assert.strictEqual(WeightConverters.getSortable('1.666666667'), '00000001666666');
  });

  it('#Test check correct', function() {
    assert.ok(WeightConverters.check('1'));
    assert.ok(WeightConverters.check('12'));
    assert.ok(WeightConverters.check('1.2'));
    assert.ok(WeightConverters.check('.2'));
  });

  it('#Test check wrong', function() {
    assert.ok(!WeightConverters.check('-3'));
    assert.ok(!WeightConverters.check('1kg'));
    assert.ok(!WeightConverters.check('1 kg'));
    assert.ok(!WeightConverters.check('abc'));
    assert.ok(!WeightConverters.check(12));
  });
});
