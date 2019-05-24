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
    assert.strictEqual(getDisplayed('1', 'long'), '@{month|Janvier}');
    assert.strictEqual(getDisplayed('1'        ), '@{month|Janvier}');
    assert.strictEqual(getDisplayed('12'       ), '@{month|Décembre}');

    assert.strictEqual(getDisplayed( 1), '@{month|Janvier}');
    assert.strictEqual(getDisplayed(12), '@{month|Décembre}');
  });

  // prettier-ignore
  it('#Test getDisplayed with short format', function() {
    assert.strictEqual(getDisplayed( '1', 'short'), '@{month|Jan}');
    assert.strictEqual(getDisplayed( '6', 'short'), '@{month|Juin}');
    assert.strictEqual(getDisplayed( '7', 'short'), '@{month|Juil}');
    assert.strictEqual(getDisplayed('12', 'short'), '@{month|Déc}');

    assert.strictEqual(getDisplayed( 1, 'short'), '@{month|Jan}');
    assert.strictEqual(getDisplayed( 6, 'short'), '@{month|Juin}');
    assert.strictEqual(getDisplayed( 7, 'short'), '@{month|Juil}');
    assert.strictEqual(getDisplayed(12, 'short'), '@{month|Déc}');
  });

  // prettier-ignore
  it('#Test getDisplayed with various format', function() {
    assert.strictEqual(getDisplayed('7', 'one-letter' ), '@{month|J}');
    assert.strictEqual(getDisplayed('7', 'short'      ), '@{month|Juil}');
    assert.strictEqual(getDisplayed('7'               ), '@{month|Juillet}');
    assert.strictEqual(getDisplayed('7', 'short-lower'), '@{month|juil}');
    assert.strictEqual(getDisplayed('7', 'long-lower' ), '@{month|juillet}');
  });

  // prettier-ignore
  it('#Test getDisplayed with number format', function() {
    assert.strictEqual(getDisplayed( '1', 'number'),  '1');
    assert.strictEqual(getDisplayed('12', 'number'), '12');

    assert.strictEqual(getDisplayed( 1, 'number'),  '1');
    assert.strictEqual(getDisplayed(12, 'number'), '12');
  });
});
