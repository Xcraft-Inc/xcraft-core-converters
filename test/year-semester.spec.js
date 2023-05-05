'use strict';

const assert = require('assert');
const YearSemesterConverters = require('../lib/year-semester.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

describe('xcraft.converters.year-semester', function () {
  it('getDisplayed without erros', function () {
    assert.strictEqual(
      YearSemesterConverters.getDisplayed('2016-1', 'short'),
      '1-16'
    );
    assert.strictEqual(
      YearSemesterConverters.getDisplayed('2017-2', 'short'),
      '2-17'
    );
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearSemesterConverters.getDisplayed('2019-1', 'long')
      ),
      '@{Premier semestre} - 2019'
    );
    assert.strictEqual(
      StringBuilder._toFlatten(
        YearSemesterConverters.getDisplayed('2017-2', 'long')
      ),
      '@{Deuxième semestre} - 2017'
    );
  });

  it('getDisplayed with empty', function () {
    assert.strictEqual(YearSemesterConverters.getDisplayed(null), '');
    assert.strictEqual(YearSemesterConverters.getDisplayed(undefined), '');
    assert.strictEqual(YearSemesterConverters.getDisplayed(''), '');
  });

  it('getDisplayed with various errors', function () {
    assert.strictEqual(
      YearSemesterConverters.getDisplayed('tralala', 'short'),
      ''
    );
    assert.strictEqual(
      YearSemesterConverters.getDisplayed('tra.12', 'short'),
      ''
    );
    assert.strictEqual(YearSemesterConverters.getDisplayed('0', 'short'), '');
    assert.strictEqual(YearSemesterConverters.getDisplayed('5', 'short'), '');
    assert.strictEqual(YearSemesterConverters.getDisplayed(-1, 'short'), '');
    assert.strictEqual(YearSemesterConverters.getDisplayed(12, 'short'), '');
  });
});
