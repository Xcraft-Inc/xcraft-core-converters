'use strict';

const assert = require('assert');
const SemesterConverters = require('../lib/semester.js');

//-----------------------------------------------------------------------------

describe('Converter semester', function() {
  it('#Test getDisplayed with empty', function() {
    assert.strictEqual(SemesterConverters.getDisplayed(null), '');
    assert.strictEqual(SemesterConverters.getDisplayed(undefined), '');
    assert.strictEqual(SemesterConverters.getDisplayed(''), '');
  });

  it('#Test getDisplayed with various errors', function() {
    assert.strictEqual(SemesterConverters.getDisplayed('tralala'), '');
    assert.strictEqual(SemesterConverters.getDisplayed('0'), '');
    assert.strictEqual(SemesterConverters.getDisplayed('3'), '');
    assert.strictEqual(SemesterConverters.getDisplayed(-1), '');
    assert.strictEqual(SemesterConverters.getDisplayed(0), '');
    assert.strictEqual(SemesterConverters.getDisplayed(3), '');
    assert.strictEqual(SemesterConverters.getDisplayed('0', 'long'), '');
    assert.strictEqual(SemesterConverters.getDisplayed('0', 'number'), '');
    assert.strictEqual(SemesterConverters.getDisplayed(0, 'long'), '');
    assert.strictEqual(SemesterConverters.getDisplayed(0, 'number'), '');
  });

  // prettier-ignore
  it('#Test getDisplayed with default format', function() {
    assert.strictEqual(SemesterConverters.getDisplayed('1', 'long').nabuId, 'Premier semestre');
    assert.strictEqual(SemesterConverters.getDisplayed('1'        ).nabuId, 'Premier semestre');
    assert.strictEqual(SemesterConverters.getDisplayed('2'        ).nabuId, 'Deuxième semestre');

    assert.strictEqual(SemesterConverters.getDisplayed(1).nabuId, 'Premier semestre');
    assert.strictEqual(SemesterConverters.getDisplayed(2).nabuId, 'Deuxième semestre');
  });

  it('#Test getDisplayed with number format', function() {
    assert.strictEqual(SemesterConverters.getDisplayed('1', 'number'), '1');
    assert.strictEqual(SemesterConverters.getDisplayed('2', 'number'), '2');

    assert.strictEqual(SemesterConverters.getDisplayed(1, 'number'), '1');
    assert.strictEqual(SemesterConverters.getDisplayed(2, 'number'), '2');
  });
});
