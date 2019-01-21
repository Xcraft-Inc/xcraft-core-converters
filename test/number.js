'use strict';

const assert = require('assert');
const NumberConverters = require('../lib/number.js');

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
