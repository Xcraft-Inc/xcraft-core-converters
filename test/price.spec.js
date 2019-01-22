'use strict';

// To run test:
// npm test xcraft-core-converters

const assert = require('assert');
const PriceConverters = require('../lib/price.js');

describe('Converter price', function() {
  it('#Test parseEdited', function() {
    let result;

    result = PriceConverters.parseEdited('');
    assert.equal(null, result.value);
    assert.equal(null, result.error);

    result = PriceConverters.parseEdited('123.00');
    assert.equal('123', result.value);
    assert.equal(null, result.error);

    result = PriceConverters.parseEdited('-123');
    assert.equal('-123', result.value);
    assert.equal(null, result.error);

    result = PriceConverters.parseEdited('123.456');
    assert.equal('123.46', result.value);
    assert.equal(null, result.error);

    result = PriceConverters.parseEdited("1'234.5");
    assert.equal('1234.5', result.value);
    assert.equal(null, result.error);

    result = PriceConverters.parseEdited('1.2345');
    assert.equal('1.23', result.value);
    assert.equal(null, result.error);

    result = PriceConverters.parseEdited('1.2999');
    assert.equal('1.3', result.value);
    assert.equal(null, result.error);

    result = PriceConverters.parseEdited('1.9999');
    assert.equal('2', result.value);
    assert.equal(null, result.error);
  });

  it('#Test getDisplayed', function() {
    assert.equal(null, PriceConverters.getDisplayed(null));
    assert.equal('123.00', PriceConverters.getDisplayed('123'));
    assert.equal("1'234.50", PriceConverters.getDisplayed('1234.5'));
    assert.equal("-1'234.50", PriceConverters.getDisplayed('-1234.5'));
  });

  it('#Test check', function() {
    assert.ok(PriceConverters.check('123'));
    assert.ok(PriceConverters.check('123.45'));
    assert.ok(PriceConverters.check('-123'));
    assert.ok(!PriceConverters.check('123.456'));
    assert.ok(!PriceConverters.check('-1x3'));
    assert.ok(!PriceConverters.check(100));
  });
});
