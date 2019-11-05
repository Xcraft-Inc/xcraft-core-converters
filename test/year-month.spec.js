'use strict';

const assert = require('assert');
const YearMonthConverters = require('../lib/year-month.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

describe('Converter year-month', function() {
  it('#Test getDisplayed without erros', function() {
    assert.strictEqual(
      YearMonthConverters.getDisplayed('2016-1', 'short'),
      '1.16'
    );
    assert.strictEqual(
      YearMonthConverters.getDisplayed('2017-03', 'short'),
      '3.17'
    );
    assert.strictEqual(
      YearMonthConverters.getDisplayed('2018-09', 'short'),
      '9.18'
    );
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearMonthConverters.getDisplayed('2016-10', 'long')
      ),
      '@{month|long|october|Octobre} - 2016'
    );
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearMonthConverters.getDisplayed('2017-04', 'long')
      ),
      '@{month|long|april|Avril} - 2017'
    );
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearMonthConverters.getDisplayed('2018-12', 'long')
      ),
      '@{month|long|december|Décembre} - 2018'
    );
  });

  it('#Test getDisplayed with empty', function() {
    assert.strictEqual(YearMonthConverters.getDisplayed(null), '');
    assert.strictEqual(YearMonthConverters.getDisplayed(undefined), '');
    assert.strictEqual(YearMonthConverters.getDisplayed(''), '');
  });

  it('#Test getDisplayed with various errors', function() {
    assert.strictEqual(
      YearMonthConverters.getDisplayed('tralala', 'short'),
      ''
    );
    assert.strictEqual(YearMonthConverters.getDisplayed('tra.12', 'short'), '');
    assert.strictEqual(YearMonthConverters.getDisplayed('0', 'short'), '');
    assert.strictEqual(YearMonthConverters.getDisplayed('5', 'short'), '');
    assert.strictEqual(YearMonthConverters.getDisplayed(-1, 'short'), '');
    assert.strictEqual(YearMonthConverters.getDisplayed(12, 'short'), '');
  });
});
