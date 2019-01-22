'use strict';

// To run test:
// npm test xcraft-core-converters

const assert = require('assert');
const LengthConverters = require('../lib/length.js');

describe('Converter length', function() {
  it('#Test parseEdited', function() {
    let result;

    result = LengthConverters.parseEdited('123', 'cm');
    assert.equal('1.23', result.value);
    assert.equal(null, result.error);

    result = LengthConverters.parseEdited('12', 'm');
    assert.equal('12', result.value);
    assert.equal(null, result.error);

    result = LengthConverters.parseEdited('2km', 'mm');
    assert.equal('2000', result.value);
    assert.equal(null, result.error);

    result = LengthConverters.parseEdited('2', 'x');
    assert.equal(null, result.value);
    assert.equal('Unité "x" incorrecte', result.error);

    result = LengthConverters.parseEdited('2x');
    assert.equal(null, result.value);
    assert.equal('Unité "x" incorrecte', result.error);
  });

  it('#Test getDisplayed', function() {
    assert.equal(null, LengthConverters.getDisplayed(null));
    assert.equal('1.2m', LengthConverters.getDisplayed('1.2'));
    assert.equal('1.2km', LengthConverters.getDisplayed('1200', 'km'));
    assert.equal('1200cm', LengthConverters.getDisplayed('12', 'cm'));
  });

  it('#Test convertLength', function() {
    assert.equal('1.2', LengthConverters.convertLength('12', 'mm', 'cm'));
    assert.equal('120', LengthConverters.convertLength('12', 'cm', 'mm'));
    assert.equal('12000', LengthConverters.convertLength('12', 'km', 'm'));
    assert.equal('1.2', LengthConverters.convertLength('1.23456', 'm', 'm', 1));
    assert.equal(
      '1.23',
      LengthConverters.convertLength('1.23456', 'm', 'm', 2)
    );
    assert.equal(
      '1.235',
      LengthConverters.convertLength('1.23456', 'm', 'm', 3)
    );
    assert.equal(
      '1.2346',
      LengthConverters.convertLength('1.23456', 'm', 'm', 4)
    );
    assert.equal(
      '1.23456',
      LengthConverters.convertLength('1.23456', 'm', 'm', 5)
    );
    assert.equal(
      '1.23456',
      LengthConverters.convertLength('1.23456', 'm', 'm', 6)
    );
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
