'use strict';

const assert = require('assert');
const MonthConverters = require('../lib/month.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

function getDisplayed(canonical, format) {
  const s = MonthConverters.getDisplayed(canonical, format);
  return StringBuilder._toFlatten(s);
}

//-----------------------------------------------------------------------------

describe('xcraft.converters.month', function () {
  it('getDisplayed with empty', function () {
    assert.strictEqual(getDisplayed(null), '');
    assert.strictEqual(getDisplayed(undefined), '');
    assert.strictEqual(getDisplayed(''), '');
  });

  // prettier-ignore
  it('getDisplayed with various errors', function() {
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
  it('getDisplayed with default format', function() {
    assert.strictEqual(getDisplayed('1', 'long'), '@{month|long|january|Janvier}');
    assert.strictEqual(getDisplayed('1'        ), '@{month|long|january|Janvier}');
    assert.strictEqual(getDisplayed('12'       ), '@{month|long|december|Décembre}');

    assert.strictEqual(getDisplayed( 1), '@{month|long|january|Janvier}');
    assert.strictEqual(getDisplayed(12), '@{month|long|december|Décembre}');
  });

  // prettier-ignore
  it('getDisplayed with short format', function() {
    assert.strictEqual(getDisplayed( '1', 'short'), '@{month|short|january|Jan}');
    assert.strictEqual(getDisplayed( '6', 'short'), '@{month|short|june|Juin}');
    assert.strictEqual(getDisplayed( '7', 'short'), '@{month|short|july|Juil}');
    assert.strictEqual(getDisplayed('12', 'short'), '@{month|short|december|Déc}');

    assert.strictEqual(getDisplayed( 1, 'short'), '@{month|short|january|Jan}');
    assert.strictEqual(getDisplayed( 6, 'short'), '@{month|short|june|Juin}');
    assert.strictEqual(getDisplayed( 7, 'short'), '@{month|short|july|Juil}');
    assert.strictEqual(getDisplayed(12, 'short'), '@{month|short|december|Déc}');
  });

  // prettier-ignore
  it('getDisplayed with various format', function() {
    assert.strictEqual(getDisplayed('7', 'one-letter' ), '@{month|one-letter|july|J}');
    assert.strictEqual(getDisplayed('7', 'short'      ), '@{month|short|july|Juil}');
    assert.strictEqual(getDisplayed('7'               ), '@{month|long|july|Juillet}');
    assert.strictEqual(getDisplayed('7', 'short-lower'), '@{month|short|july|juil}');
    assert.strictEqual(getDisplayed('7', 'long-lower' ), '@{month|long|july|juillet}');
  });

  // prettier-ignore
  it('getDisplayed with number format', function() {
    assert.strictEqual(getDisplayed( '1', 'number'),  '1');
    assert.strictEqual(getDisplayed('12', 'number'), '12');

    assert.strictEqual(getDisplayed( 1, 'number'),  '1');
    assert.strictEqual(getDisplayed(12, 'number'), '12');
  });
});
