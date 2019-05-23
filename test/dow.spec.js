'use strict';

const assert = require('assert');
const DowConverters = require('../lib/dow.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

function getDisplayed(canonical, format) {
  const s = DowConverters.getDisplayed(canonical, format);
  return StringBuilder._toFlatten(s);
}

//-----------------------------------------------------------------------------

describe('Converter dow (day of week)', function() {
  it('#Test getDisplayed with empty', function() {
    assert.strictEqual(getDisplayed(null), '');
    assert.strictEqual(getDisplayed(undefined), '');
    assert.strictEqual(getDisplayed(''), '');
  });

  // prettier-ignore
  it('#Test getDisplayed with various errors', function() {
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
  it('#Test getDisplayed with default format', function() {
    assert.strictEqual(getDisplayed('1', 'long'), '@{dow|long|capitalize|Lundi}');
    assert.strictEqual(getDisplayed('1'        ), '@{dow|long|capitalize|Lundi}');
    assert.strictEqual(getDisplayed('7'        ), '@{dow|long|capitalize|Dimanche}');

    assert.strictEqual(getDisplayed(1), '@{dow|long|capitalize|Lundi}');
    assert.strictEqual(getDisplayed(7), '@{dow|long|capitalize|Dimanche}');
  });

  // prettier-ignore
  it('#Test getDisplayed with short format', function() {
    assert.strictEqual(getDisplayed('1', 'short'), '@{dow|short|capitalize|Lun}');
    assert.strictEqual(getDisplayed('6', 'short'), '@{dow|short|capitalize|Sam}');
    assert.strictEqual(getDisplayed('7', 'short'), '@{dow|short|capitalize|Dim}');

    assert.strictEqual(getDisplayed(1, 'short'), '@{dow|short|capitalize|Lun}');
    assert.strictEqual(getDisplayed(6, 'short'), '@{dow|short|capitalize|Sam}');
    assert.strictEqual(getDisplayed(7, 'short'), '@{dow|short|capitalize|Dim}');
  });

  // prettier-ignore
  it('#Test getDisplayed with various format', function() {
    assert.strictEqual(getDisplayed('7', 'short'      ), '@{dow|short|capitalize|Dim}');
    assert.strictEqual(getDisplayed('7'               ), '@{dow|long|capitalize|Dimanche}');
    assert.strictEqual(getDisplayed('7', 'short-lower'), '@{dow|short|lower|dim}');
    assert.strictEqual(getDisplayed('7', 'long-lower' ), '@{dow|long|lower|dimanche}');
  });

  // prettier-ignore
  it('#Test getDisplayed with number format', function() {
    assert.strictEqual(getDisplayed('1', 'number'), '1');
    assert.strictEqual(getDisplayed('7', 'number'), '7');

    assert.strictEqual(getDisplayed(1, 'number'), '1');
    assert.strictEqual(getDisplayed(7, 'number'), '7');
  });
});
