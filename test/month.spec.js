'use strict';

const assert = require('assert');
const MonthConverters = require('../lib/month.js');

describe('Converter month', function() {
  it('#Test getDisplayed with empty', function() {
    assert.strictEqual(MonthConverters.getDisplayed(null), '');
    assert.strictEqual(MonthConverters.getDisplayed(undefined), '');
    assert.strictEqual(MonthConverters.getDisplayed(''), '');
  });

  it('#Test getDisplayed with various errors', function() {
    assert.strictEqual(MonthConverters.getDisplayed('tralala'), '');
    assert.strictEqual(MonthConverters.getDisplayed('0'), '');
    assert.strictEqual(MonthConverters.getDisplayed('13'), '');
    assert.strictEqual(MonthConverters.getDisplayed(-1), '');
    assert.strictEqual(MonthConverters.getDisplayed(0), '');
    assert.strictEqual(MonthConverters.getDisplayed(13), '');
    assert.strictEqual(MonthConverters.getDisplayed('0', 'short'), '');
    assert.strictEqual(MonthConverters.getDisplayed('0', 'long'), '');
    assert.strictEqual(MonthConverters.getDisplayed('0', 'number'), '');
    assert.strictEqual(MonthConverters.getDisplayed(0, 'short'), '');
    assert.strictEqual(MonthConverters.getDisplayed(0, 'long'), '');
    assert.strictEqual(MonthConverters.getDisplayed(0, 'number'), '');
  });

  // prettier-ignore
  it('#Test getDisplayed with default format', function() {
    assert.strictEqual(MonthConverters.getDisplayed('1', 'long').nabuId, 'Janvier');
    assert.strictEqual(MonthConverters.getDisplayed('1'        ).nabuId, 'Janvier');
    assert.strictEqual(MonthConverters.getDisplayed('12'       ).nabuId, 'Décembre');

    assert.strictEqual(MonthConverters.getDisplayed( 1).nabuId, 'Janvier');
    assert.strictEqual(MonthConverters.getDisplayed(12).nabuId, 'Décembre');
  });

  // prettier-ignore
  it('#Test getDisplayed with short format', function() {
    assert.strictEqual(MonthConverters.getDisplayed( '1', 'short').nabuId, 'Jan');
    assert.strictEqual(MonthConverters.getDisplayed( '6', 'short').nabuId, 'Juin');
    assert.strictEqual(MonthConverters.getDisplayed( '7', 'short').nabuId, 'Juil');
    assert.strictEqual(MonthConverters.getDisplayed('12', 'short').nabuId, 'Déc');

    assert.strictEqual(MonthConverters.getDisplayed( 1, 'short').nabuId, 'Jan');
    assert.strictEqual(MonthConverters.getDisplayed( 6, 'short').nabuId, 'Juin');
    assert.strictEqual(MonthConverters.getDisplayed( 7, 'short').nabuId, 'Juil');
    assert.strictEqual(MonthConverters.getDisplayed(12, 'short').nabuId, 'Déc');
  });

  // prettier-ignore
  it('#Test getDisplayed with number format', function() {
    assert.strictEqual(MonthConverters.getDisplayed( '1', 'number'),  '1');
    assert.strictEqual(MonthConverters.getDisplayed('12', 'number'), '12');

    assert.strictEqual(MonthConverters.getDisplayed( 1, 'number'),  '1');
    assert.strictEqual(MonthConverters.getDisplayed(12, 'number'), '12');
  });
});
