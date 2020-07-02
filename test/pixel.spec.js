'use strict';

const assert = require('assert');
const PixelConverters = require('../lib/pixel.js');

//-----------------------------------------------------------------------------

describe('Converter length', function () {
  it('#Test parseEdited', function () {
    let result;

    result = PixelConverters.parseEdited(null);
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = PixelConverters.parseEdited('');
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = PixelConverters.parseEdited('123');
    assert.strictEqual(result.value, '123px');
    assert.strictEqual(result.error, null);

    result = PixelConverters.parseEdited('123px');
    assert.strictEqual(result.value, '123px');
    assert.strictEqual(result.error, null);

    result = PixelConverters.parseEdited('123 px');
    assert.strictEqual(result.value, '123px');
    assert.strictEqual(result.error, null);

    result = PixelConverters.parseEdited('0');
    assert.strictEqual(result.value, '0px');
    assert.strictEqual(result.error, null);

    result = PixelConverters.parseEdited('-2');
    assert.strictEqual(result.value, '-2px');
    assert.strictEqual(result.error, null);

    result = PixelConverters.parseEdited('-2 px');
    assert.strictEqual(result.value, '-2px');
    assert.strictEqual(result.error, null);
  });

  it('#Test parseEdited with error', function () {
    let result;

    result = PixelConverters.parseEdited('123p');
    assert.strictEqual(result.value, '123px');
    assert.notStrictEqual(result.error, null);

    result = PixelConverters.parseEdited('123.4');
    assert.strictEqual(result.value, '123px');
    assert.notStrictEqual(result.error, null);

    result = PixelConverters.parseEdited('px');
    assert.strictEqual(result.value, '0px');
    assert.notStrictEqual(result.error, null);

    result = PixelConverters.parseEdited('123py');
    assert.strictEqual(result.value, '123px');
    assert.notStrictEqual(result.error, null);
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.strictEqual(PixelConverters.getDisplayed(null  ), null);
    assert.strictEqual(PixelConverters.getDisplayed('12px'), '12 px');
    assert.strictEqual(PixelConverters.getDisplayed('0px' ), '0 px');
  });

  it('#Test check correct', function () {
    assert.ok(PixelConverters.check('123px'));
    assert.ok(PixelConverters.check('0px'));
    assert.ok(PixelConverters.check('-5px'));
  });

  it('#Test check wrong', function () {
    assert.ok(!PixelConverters.check('123'));
    assert.ok(!PixelConverters.check('123.4px'));
    assert.ok(!PixelConverters.check('abc'));
    assert.ok(!PixelConverters.check('px'));
  });
});
