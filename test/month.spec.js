'use strict';

const assert = require('assert');
const MonthConverters = require('../lib/month.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

function getDisplayed(canonical, format) {
  const s = MonthConverters.getDisplayed(canonical, format);
  return StringBuilder._toFlatten(s);
}

//-----------------------------------------------------------------------------

describe('Converter month', function() {
  it('#Test getDisplayed with empty', function() {
    assert.strictEqual(getDisplayed(null), '');
    assert.strictEqual(getDisplayed(undefined), '');
    assert.strictEqual(getDisplayed(''), '');
  });

  // prettier-ignore
  it('#Test getDisplayed with various errors', function() {
    assert.strictEqual(getDisplayed('tralala'    ), '');
    assert.strictEqual(getDisplayed('0'          ), '');
    assert.strictEqual(getDisplayed('13'         ), '');
    assert.strictEqual(getDisplayed(-1           ), '');
    assert.strictEqual(getDisplayed(0            ), '');
    assert.strictEqual(getDisplayed(13           ), '');
    assert.strictEqual(getDisplayed('0', 'short' ), '');
    assert.strictEqual(getDisplayed('0', 'long'  ), '');
    assert.strictEqual(getDisplayed('0', 'number'), '');
    assert.strictEqual(getDisplayed(0,   'short' ), '');
    assert.strictEqual(getDisplayed(0,   'long'  ), '');
    assert.strictEqual(getDisplayed(0,   'number'), '');
  });

  // prettier-ignore
  it('#Test getDisplayed with default format', function() {
    assert.strictEqual(getDisplayed('1', 'long'), '@{month|long|January}');
    assert.strictEqual(getDisplayed('1'        ), '@{month|long|January}');
    assert.strictEqual(getDisplayed('12'       ), '@{month|long|December}');

    assert.strictEqual(getDisplayed( 1), '@{month|long|January}');
    assert.strictEqual(getDisplayed(12), '@{month|long|December}');
  });

  // prettier-ignore
  it('#Test getDisplayed with short format', function() {
    assert.strictEqual(getDisplayed( '1', 'short'), '@{month|short|January}');
    assert.strictEqual(getDisplayed( '6', 'short'), '@{month|short|June}');
    assert.strictEqual(getDisplayed( '7', 'short'), '@{month|short|July}');
    assert.strictEqual(getDisplayed('12', 'short'), '@{month|short|December}');

    assert.strictEqual(getDisplayed( 1, 'short'), '@{month|short|January}');
    assert.strictEqual(getDisplayed( 6, 'short'), '@{month|short|June}');
    assert.strictEqual(getDisplayed( 7, 'short'), '@{month|short|July}');
    assert.strictEqual(getDisplayed(12, 'short'), '@{month|short|December}');
  });

  // prettier-ignore
  it('#Test getDisplayed with various format', function() {
    assert.strictEqual(getDisplayed('7', 'one-letter' ), '@{month|one-letter|July}');
    assert.strictEqual(getDisplayed('7', 'short'      ), '@{month|short|July}');
    assert.strictEqual(getDisplayed('7'               ), '@{month|long|July}');
    assert.strictEqual(getDisplayed('7', 'short-lower'), '@{month|short|july}');
    assert.strictEqual(getDisplayed('7', 'long-lower' ), '@{month|long|july}');
  });

  // prettier-ignore
  it('#Test getDisplayed with number format', function() {
    assert.strictEqual(getDisplayed( '1', 'number'),  '1');
    assert.strictEqual(getDisplayed('12', 'number'), '12');

    assert.strictEqual(getDisplayed( 1, 'number'),  '1');
    assert.strictEqual(getDisplayed(12, 'number'), '12');
  });
});
