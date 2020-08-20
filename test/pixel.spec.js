'use strict';

const assert = require('assert');
const PixelConverters = require('../lib/pixel.js');

//-----------------------------------------------------------------------------

describe('Converter pixel', function () {
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

    result = PixelConverters.parseEdited('500', 499, 501);
    assert.strictEqual(result.value, '500px');
    assert.strictEqual(result.error, null);

    result = PixelConverters.parseEdited('500', 500, 500);
    assert.strictEqual(result.value, '500px');
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

    result = PixelConverters.parseEdited('199px', 200, 300);
    assert.strictEqual(result.value, '200px');
    assert.notStrictEqual(result.error, null);

    result = PixelConverters.parseEdited('301px', 200, 300);
    assert.strictEqual(result.value, '300px');
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

  it('#Test incEdited', function () {
    let result;

    result = PixelConverters.incEdited('', 0, 1, 5);
    assert.strictEqual(result.edited, '5 px');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 1);

    result = PixelConverters.incEdited('100', 0, 1, 5);
    assert.strictEqual(result.edited, '105 px');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 3);

    result = PixelConverters.incEdited('100px', 0, 1, 5);
    assert.strictEqual(result.edited, '105 px');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 3);

    result = PixelConverters.incEdited('100 px', 0, 1, 5);
    assert.strictEqual(result.edited, '105 px');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 3);

    result = PixelConverters.incEdited('100px', 0, -1, 5);
    assert.strictEqual(result.edited, '95 px');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 2);

    result = PixelConverters.incEdited('99px', 0, 1, 5, 0, 100);
    assert.strictEqual(result.edited, '100 px');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 3);

    result = PixelConverters.incEdited('2px', 0, -1, 5, 0, 100);
    assert.strictEqual(result.edited, '0 px');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 1);
  });
});
