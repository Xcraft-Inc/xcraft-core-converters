'use strict';

const assert = require('assert');
const LengthConverters = require('../lib/length.js');

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
