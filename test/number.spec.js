'use strict';

const assert = require('assert');
const NumberConverters = require('../lib/number.js');

describe('Converter number', function() {
  it('#Test parseEdited', function() {
    let result;

    result = NumberConverters.parseEdited('');
    assert.equal(null, result.value);
    assert.equal(null, result.error);

    result = NumberConverters.parseEdited('123');
    assert.equal('123', result.value);
    assert.equal(null, result.error);

    result = NumberConverters.parseEdited('00123');
    assert.equal('123', result.value);
    assert.equal(null, result.error);

    result = NumberConverters.parseEdited('+123');
    assert.equal('123', result.value);
    assert.equal(null, result.error);

    result = NumberConverters.parseEdited('-123');
    assert.equal('-123', result.value);
    assert.equal(null, result.error);

    result = NumberConverters.parseEdited('123.00');
    assert.equal('123', result.value);
    assert.equal(null, result.error);

    result = NumberConverters.parseEdited('123.800');
    assert.equal('123.8', result.value);
    assert.equal(null, result.error);

    result = NumberConverters.parseEdited('123.456789');
    assert.equal('123.456789', result.value);
    assert.equal(null, result.error);

    result = NumberConverters.parseEdited('.123');
    assert.equal('.123', result.value);
    assert.equal(null, result.error);

    result = NumberConverters.parseEdited('0.123');
    assert.equal('.123', result.value);
    assert.equal(null, result.error);

    result = NumberConverters.parseEdited("1'000.00");
    assert.equal('1000', result.value);
    assert.equal(null, result.error);

    result = NumberConverters.parseEdited('12a34');
    assert.equal(null, result.value);
    assert.ok(result.error);
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.equal(null,       NumberConverters.getDisplayed(null       ));
    assert.equal("1'234",    NumberConverters.getDisplayed('1234'     ));
    assert.equal("-1'234",   NumberConverters.getDisplayed('-1234'    ));
    assert.equal('0.12',     NumberConverters.getDisplayed('.12'      ));
    assert.equal('0.12',     NumberConverters.getDisplayed('.12456', 2));
    assert.equal('0.125',    NumberConverters.getDisplayed('.12456', 3));
    assert.equal('0.1246',   NumberConverters.getDisplayed('.12456', 4));
    assert.equal('0.12456',  NumberConverters.getDisplayed('.12456', 5));
    assert.equal('0.12456',  NumberConverters.getDisplayed('.12456', 6));
  });

  it('#Test check correct', function() {
    assert.ok(NumberConverters.check('123'));
    assert.ok(NumberConverters.check('-123'));
    assert.ok(NumberConverters.check('.123'));
    assert.ok(NumberConverters.check('1.23'));
  });

  it('#Test check wrong', function() {
    assert.ok(!NumberConverters.check('123m'));
    assert.ok(!NumberConverters.check('123cm'));
    assert.ok(!NumberConverters.check('cm'));
    assert.ok(!NumberConverters.check(12));
  });
});
