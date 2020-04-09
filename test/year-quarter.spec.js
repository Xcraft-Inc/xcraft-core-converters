'use strict';

const assert = require('assert');
const YearQuarterConverters = require('../lib/year-quarter.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

describe('Converter year-quarter', function () {
  it('#Test getDisplayed without erros', function () {
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearQuarterConverters.getDisplayed('2016-1', 'short')
      ),
      '@{Q1}.16'
    );
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearQuarterConverters.getDisplayed('2017-2', 'short')
      ),
      '@{Q2}.17'
    );
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearQuarterConverters.getDisplayed('2017-3', 'short')
      ),
      '@{Q3}.17'
    );
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearQuarterConverters.getDisplayed('2017-4', 'short')
      ),
      '@{Q4}.17'
    );
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearQuarterConverters.getDisplayed('2019-1', 'long')
      ),
      '@{Q1} - 2019'
    );
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearQuarterConverters.getDisplayed('2017-2', 'long')
      ),
      '@{Q2} - 2017'
    );
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearQuarterConverters.getDisplayed('2019-3', 'long')
      ),
      '@{Q3} - 2019'
    );
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearQuarterConverters.getDisplayed('2017-4', 'long')
      ),
      '@{Q4} - 2017'
    );
  });

  it('#Test getDisplayed with empty', function () {
    assert.strictEqual(YearQuarterConverters.getDisplayed(null), '');
    assert.strictEqual(YearQuarterConverters.getDisplayed(undefined), '');
    assert.strictEqual(YearQuarterConverters.getDisplayed(''), '');
  });

  it('#Test getDisplayed with various errors', function () {
    assert.strictEqual(
      YearQuarterConverters.getDisplayed('tralala', 'short'),
      ''
    );
    assert.strictEqual(
      YearQuarterConverters.getDisplayed('tra.12', 'short'),
      ''
    );
    assert.strictEqual(YearQuarterConverters.getDisplayed('0', 'short'), '');
    assert.strictEqual(YearQuarterConverters.getDisplayed('5', 'short'), '');
    assert.strictEqual(YearQuarterConverters.getDisplayed(-1, 'short'), '');
    assert.strictEqual(YearQuarterConverters.getDisplayed(12, 'short'), '');
  });
});
