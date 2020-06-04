'use strict';

const assert = require('assert');
const PercentConverters = require('../lib/percent.js');

//-----------------------------------------------------------------------------

describe('Converter percent', function () {
  it('#Test parseEdited', function () {
    let result;

    result = PercentConverters.parseEdited('');
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('45%');
    assert.strictEqual(result.value, '0.45');
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('45.7%');
    assert.strictEqual(result.value, '0.457');
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('.2%');
    assert.strictEqual(result.value, '0.002');
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('.002%');
    assert.strictEqual(result.value, '0.00002');
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('-2%');
    assert.strictEqual(result.value, '-0.02');
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('-.2%');
    assert.strictEqual(result.value, '-0.002');
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('-0.2%');
    assert.strictEqual(result.value, '-0.002');
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('0.45');
    assert.strictEqual(result.value, '0.45');
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('4%2');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);

    result = PercentConverters.parseEdited('abc');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.strictEqual(PercentConverters.getDisplayed(null          ), null);
    assert.strictEqual(PercentConverters.getDisplayed('0.12'        ), '12%');
    assert.strictEqual(PercentConverters.getDisplayed('0.12',      5), '12%');
    assert.strictEqual(PercentConverters.getDisplayed('0.1234999', 2), '12.35%');
    assert.strictEqual(PercentConverters.getDisplayed('0.123'       ), '12.3%');
  });

  it('#Test check correct', function () {
    assert.ok(PercentConverters.check('0'));
    assert.ok(PercentConverters.check(0));
    assert.ok(PercentConverters.check(5));
    assert.ok(PercentConverters.check('1'));
    assert.ok(PercentConverters.check('123'));
    assert.ok(PercentConverters.check('0.123'));
    assert.ok(PercentConverters.check('-0.05'));
  });

  it('#Test check wrong', function () {
    assert.ok(!PercentConverters.check('10%'));
    assert.ok(!PercentConverters.check(''));
    assert.ok(!PercentConverters.check(null));
    assert.ok(!PercentConverters.check(undefined));
  });
});
