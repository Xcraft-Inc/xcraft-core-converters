'use strict';

const assert = require('assert');
const LengthConverters = require('../lib/length.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

describe('Converter length', function() {
  // prettier-ignore
  it('#Test parseEdited', function() {
    let result;

    result = LengthConverters.parseEdited('123', 'cm');
    assert.strictEqual(result.value, '1.23');
    assert.strictEqual(result.error, null);

    result = LengthConverters.parseEdited('12', 'm');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = LengthConverters.parseEdited('2km', 'mm');
    assert.strictEqual(result.value, '2000');
    assert.strictEqual(result.error, null);

    result = LengthConverters.parseEdited('2', 'x');
    assert.strictEqual(result.value, null);
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Unité} "x" @{incorrecte}');

    result = LengthConverters.parseEdited('2x');
    assert.strictEqual(result.value, null);
    assert.strictEqual(StringBuilder._toFlatten(result.error), '@{Unité} "x" @{incorrecte}');
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.strictEqual(LengthConverters.getDisplayed(null        ), null);
    assert.strictEqual(LengthConverters.getDisplayed('1.2'       ), '1.2m');
    assert.strictEqual(LengthConverters.getDisplayed('1200', 'km'), '1.2km');
    assert.strictEqual(LengthConverters.getDisplayed('12',   'cm'), '1200cm');
  });

  // prettier-ignore
  it('#Test convertLength', function() {
    assert.strictEqual(LengthConverters.convertLength('12',      'mm', 'cm'  ), '1.2');
    assert.strictEqual(LengthConverters.convertLength('12',      'cm', 'mm'  ), '120');
    assert.strictEqual(LengthConverters.convertLength('12',      'km', 'm'   ), '12000');
    assert.strictEqual(LengthConverters.convertLength('1.23456', 'm',  'm', 1), '1.2');
    assert.strictEqual(LengthConverters.convertLength('1.23456', 'm',  'm', 2), '1.23');
    assert.strictEqual(LengthConverters.convertLength('1.23456', 'm',  'm', 3), '1.235');
    assert.strictEqual(LengthConverters.convertLength('1.23456', 'm',  'm', 4), '1.2346');
    assert.strictEqual(LengthConverters.convertLength('1.23456', 'm',  'm', 5), '1.23456');
    assert.strictEqual(LengthConverters.convertLength('1.23456', 'm',  'm', 6), '1.23456');
  });

  it('#Test check correct', function() {
    assert.ok(LengthConverters.check('123'));
    assert.ok(LengthConverters.check('.123'));
    assert.ok(LengthConverters.check('1.23'));
  });

  it('#Test check wrong', function() {
    assert.ok(!LengthConverters.check('-123'));
    assert.ok(!LengthConverters.check('123m'));
    assert.ok(!LengthConverters.check('123cm'));
    assert.ok(!LengthConverters.check('cm'));
  });
});
