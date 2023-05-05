'use strict';

const assert = require('assert');
const YearWeekConverters = require('../lib/year-week.js');

//-----------------------------------------------------------------------------

describe('xcraft.converters.year-week', function () {
  it('getDisplayed without erros', function () {
    assert.strictEqual(
      YearWeekConverters.getDisplayed('2016-1', 'short'),
      '1.16'
    );
    assert.strictEqual(
      YearWeekConverters.getDisplayed('2017-53', 'short'),
      '53.17'
    );
    assert.strictEqual(
      YearWeekConverters.getDisplayed('2018-50', 'short'),
      '50.18'
    );
    assert.strictEqual(
      YearWeekConverters.getDisplayed('2016-1', 'long'),
      '1 - 2016'
    );
    assert.strictEqual(
      YearWeekConverters.getDisplayed('2017-53', 'long'),
      '53 - 2017'
    );
    assert.strictEqual(
      YearWeekConverters.getDisplayed('2018-50', 'long'),
      '50 - 2018'
    );
  });

  it('getDisplayed with empty', function () {
    assert.strictEqual(YearWeekConverters.getDisplayed(null), '');
    assert.strictEqual(YearWeekConverters.getDisplayed(undefined), '');
    assert.strictEqual(YearWeekConverters.getDisplayed(''), '');
  });

  it('getDisplayed with various errors', function () {
    assert.strictEqual(YearWeekConverters.getDisplayed('tralala', 'short'), '');
    assert.strictEqual(YearWeekConverters.getDisplayed('tra.12', 'short'), '');
    assert.strictEqual(YearWeekConverters.getDisplayed('0', 'short'), '');
    assert.strictEqual(YearWeekConverters.getDisplayed('5', 'short'), '');
    assert.strictEqual(YearWeekConverters.getDisplayed(-1, 'short'), '');
    assert.strictEqual(YearWeekConverters.getDisplayed(12, 'short'), '');
  });
});
