'use strict';

const assert = require('assert');
const DowConverters = require('../lib/dow.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

function getDisplayed(canonical, format) {
  const s = DowConverters.getDisplayed(canonical, format);
  return StringBuilder._toFlatten(s);
}

//-----------------------------------------------------------------------------

describe('xcraft.converters.dow', function () {
  // (day of week)
  it('getDisplayed with empty', function () {
    assert.strictEqual(getDisplayed(null), '');
    assert.strictEqual(getDisplayed(undefined), '');
    assert.strictEqual(getDisplayed(''), '');
  });

  // prettier-ignore
  it('getDisplayed with various errors', function() {
    assert.strictEqual(getDisplayed('tralala'    ), '');
    assert.strictEqual(getDisplayed('0'          ), '');
    assert.strictEqual(getDisplayed('8'          ), '');
    assert.strictEqual(getDisplayed(-1           ), '');
    assert.strictEqual(getDisplayed(0            ), '');
    assert.strictEqual(getDisplayed(8            ), '');
    assert.strictEqual(getDisplayed('0', 'short' ), '');
    assert.strictEqual(getDisplayed('0', 'long'  ), '');
    assert.strictEqual(getDisplayed('0', 'number'), '');
    assert.strictEqual(getDisplayed(0,   'short' ), '');
    assert.strictEqual(getDisplayed(0,   'long'  ), '');
    assert.strictEqual(getDisplayed(0,   'number'), '');
  });

  // prettier-ignore
  it('getDisplayed with default format', function() {
    assert.strictEqual(getDisplayed('1', 'long'), '@{dow|long|monday|Lundi}');
    assert.strictEqual(getDisplayed('1'        ), '@{dow|long|monday|Lundi}');
    assert.strictEqual(getDisplayed('7'        ), '@{dow|long|sunday|Dimanche}');

    assert.strictEqual(getDisplayed(1), '@{dow|long|monday|Lundi}');
    assert.strictEqual(getDisplayed(7), '@{dow|long|sunday|Dimanche}');
  });

  // prettier-ignore
  it('getDisplayed with short format', function() {
    assert.strictEqual(getDisplayed('1', 'short'), '@{dow|short|monday|Lun}');
    assert.strictEqual(getDisplayed('6', 'short'), '@{dow|short|saturday|Sam}');
    assert.strictEqual(getDisplayed('7', 'short'), '@{dow|short|sunday|Dim}');

    assert.strictEqual(getDisplayed(1, 'short'), '@{dow|short|monday|Lun}');
    assert.strictEqual(getDisplayed(6, 'short'), '@{dow|short|saturday|Sam}');
    assert.strictEqual(getDisplayed(7, 'short'), '@{dow|short|sunday|Dim}');
  });

  // prettier-ignore
  it('getDisplayed with various format', function() {
    assert.strictEqual(getDisplayed('7', 'short'      ), '@{dow|short|sunday|Dim}');
    assert.strictEqual(getDisplayed('7'               ), '@{dow|long|sunday|Dimanche}');
    assert.strictEqual(getDisplayed('7', 'short-lower'), '@{dow|short|sunday|dim}');
    assert.strictEqual(getDisplayed('7', 'long-lower' ), '@{dow|long|sunday|dimanche}');
  });

  // prettier-ignore
  it('getDisplayed with number format', function() {
    assert.strictEqual(getDisplayed('1', 'number'), '1');
    assert.strictEqual(getDisplayed('7', 'number'), '7');

    assert.strictEqual(getDisplayed(1, 'number'), '1');
    assert.strictEqual(getDisplayed(7, 'number'), '7');
  });
});
