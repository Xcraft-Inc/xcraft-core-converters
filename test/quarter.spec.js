'use strict';

const assert = require('assert');
const QuarterConverters = require('../lib/quarter.js');

//-----------------------------------------------------------------------------

describe('xcraft.converters.quarter', function () {
  it('getDisplayed with empty', function () {
    assert.strictEqual(QuarterConverters.getDisplayed(null), '');
    assert.strictEqual(QuarterConverters.getDisplayed(undefined), '');
    assert.strictEqual(QuarterConverters.getDisplayed(''), '');
  });

  it('getDisplayed with various errors', function () {
    assert.strictEqual(QuarterConverters.getDisplayed('tralala'), '');
    assert.strictEqual(QuarterConverters.getDisplayed('0'), '');
    assert.strictEqual(QuarterConverters.getDisplayed('5'), '');
    assert.strictEqual(QuarterConverters.getDisplayed(-1), '');
    assert.strictEqual(QuarterConverters.getDisplayed(0), '');
    assert.strictEqual(QuarterConverters.getDisplayed(5), '');
  });

  it('getDisplayed without error', function () {
    assert.strictEqual(QuarterConverters.getDisplayed('1').nabuId, 'Q1');
    assert.strictEqual(QuarterConverters.getDisplayed('4').nabuId, 'Q4');

    assert.strictEqual(QuarterConverters.getDisplayed(1).nabuId, 'Q1');
    assert.strictEqual(QuarterConverters.getDisplayed(4).nabuId, 'Q4');
  });
});
