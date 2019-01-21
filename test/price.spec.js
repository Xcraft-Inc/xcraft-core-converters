'use strict';

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
  });

  it('#Test getDisplayed', function() {
    assert.equal('123.00', PriceConverters.getDisplayed('123'));
    assert.equal("1'234.50", PriceConverters.getDisplayed('1234.5'));
  });

  it('#Test check', function() {
    assert.ok(PriceConverters.check('123'));
    assert.ok(PriceConverters.check('123.456'));
    assert.ok(PriceConverters.check('-123'));
    assert.ok(!PriceConverters.check('-1x3'));
    assert.ok(!PriceConverters.check(100));
  });
});
