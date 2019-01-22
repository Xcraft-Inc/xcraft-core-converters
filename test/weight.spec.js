'use strict';

// To run test:
// npm test xcraft-core-converters

const assert = require('assert');
const WeightConverters = require('../lib/weight.js');

describe('Converter weight', function() {
  it('#Test parseEdited', function() {
    let result;

    result = WeightConverters.parseEdited('');
    assert.equal(null, result.value);
    assert.equal(null, result.error);

    result = WeightConverters.parseEdited('123', 'g');
    assert.equal('0.123', result.value);
    assert.equal(null, result.error);

    result = WeightConverters.parseEdited('2t', 'mg');
    assert.equal('1230', result.value);
    assert.equal(null, result.error);

    result = WeightConverters.parseEdited('12', 'kg');
    assert.equal('12', result.value);
    assert.equal(null, result.error);
  });

  it('#Test getDisplayed', function() {
    assert.equal(null, WeightConverters.getDisplayed(null));
    assert.equal('1200g', WeightConverters.getDisplayed('1.2', 'g'));
  });

  it('#Test convertWeight', function() {
    assert.equal('12', WeightConverters.convertWeight('12', 'kg', 'kg', 3));
    assert.equal('1200', WeightConverters.convertWeight('1.2', 'g', 'mg', 3));
    assert.equal('30', WeightConverters.convertWeight('0.03', 't', 'kg', 3));
    assert.equal(
      '1.2',
      WeightConverters.convertWeight('1.23456', 'kg', 'kg', 1)
    );
    assert.equal(
      '1.23',
      WeightConverters.convertWeight('1.23456', 'kg', 'kg', 2)
    );
    assert.equal(
      '1.235',
      WeightConverters.convertWeight('1.23456', 'kg', 'kg', 3)
    );
    assert.equal(
      '1.2346',
      WeightConverters.convertWeight('1.23456', 'kg', 'kg', 4)
    );
    assert.equal(
      '1.23456',
      WeightConverters.convertWeight('1.23456', 'kg', 'kg', 5)
    );
    assert.equal(
      '1.23456',
      WeightConverters.convertWeight('1.23456', 'kg', 'kg', 6)
    );
  });

  it('#Test getSortable', function() {
    assert.equal('00000012000000', WeightConverters.getSortable('12'));
    assert.equal('00000001666666', WeightConverters.getSortable('1.666666667'));
  });

  it('#Test check', function() {
    assert.ok(WeightConverters.check('1'));
    assert.ok(WeightConverters.check('12'));
    assert.ok(WeightConverters.check('1.2'));
    assert.ok(WeightConverters.check('.2'));
    assert.ok(!WeightConverters.check('-3'));
    assert.ok(!WeightConverters.check('abc'));
    assert.ok(!WeightConverters.check(12));
  });
});
