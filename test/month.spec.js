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
    assert.strictEqual(getDisplayed('1', 'long'), '@{month|long|capitalize|Janvier}');
    assert.strictEqual(getDisplayed('1'        ), '@{month|long|capitalize|Janvier}');
    assert.strictEqual(getDisplayed('12'       ), '@{month|long|capitalize|Décembre}');

    assert.strictEqual(getDisplayed( 1), '@{month|long|capitalize|Janvier}');
    assert.strictEqual(getDisplayed(12), '@{month|long|capitalize|Décembre}');
  });

  // prettier-ignore
  it('#Test getDisplayed with short format', function() {
    assert.strictEqual(getDisplayed( '1', 'short'), '@{month|short|capitalize|Jan}');
    assert.strictEqual(getDisplayed( '6', 'short'), '@{month|short|capitalize|Juin}');
    assert.strictEqual(getDisplayed( '7', 'short'), '@{month|short|capitalize|Juil}');
    assert.strictEqual(getDisplayed('12', 'short'), '@{month|short|capitalize|Déc}');

    assert.strictEqual(getDisplayed( 1, 'short'), '@{month|short|capitalize|Jan}');
    assert.strictEqual(getDisplayed( 6, 'short'), '@{month|short|capitalize|Juin}');
    assert.strictEqual(getDisplayed( 7, 'short'), '@{month|short|capitalize|Juil}');
    assert.strictEqual(getDisplayed(12, 'short'), '@{month|short|capitalize|Déc}');
  });

  // prettier-ignore
  it('#Test getDisplayed with various format', function() {
    assert.strictEqual(getDisplayed('7', 'one-letter' ), '@{month|one-letter|J}');
    assert.strictEqual(getDisplayed('7', 'short'      ), '@{month|short|capitalize|Juil}');
    assert.strictEqual(getDisplayed('7'               ), '@{month|long|capitalize|Juillet}');
    assert.strictEqual(getDisplayed('7', 'short-lower'), '@{month|short|lower|juil}');
    assert.strictEqual(getDisplayed('7', 'long-lower' ), '@{month|long|lower|juillet}');
  });

  // prettier-ignore
  it('#Test getDisplayed with number format', function() {
    assert.strictEqual(getDisplayed( '1', 'number'),  '1');
    assert.strictEqual(getDisplayed('12', 'number'), '12');

    assert.strictEqual(getDisplayed( 1, 'number'),  '1');
    assert.strictEqual(getDisplayed(12, 'number'), '12');
  });
});
