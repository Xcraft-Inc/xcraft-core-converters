'use strict';

const assert = require('assert');
const PriceConverters = require('../lib/price.js');

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
