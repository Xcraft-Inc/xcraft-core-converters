'use strict';

const assert = require('assert');
const PercentConverters = require('../lib/percent.js');

//-----------------------------------------------------------------------------

describe('xcraft.converters.percent', function () {
  it('parseEdited', function () {
    let result;

    result = PercentConverters.parseEdited('');
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('0%');
    assert.strictEqual(result.value, '0');
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('45%');
    assert.strictEqual(result.value, '0.45');
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('0.11');
    assert.strictEqual(result.value, '0.11');
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

    result = PercentConverters.parseEdited('12%', undefined, undefined, 1);
    assert.strictEqual(result.value, '12%');
    assert.strictEqual(result.error, null);

    result = PercentConverters.parseEdited('55', undefined, undefined, 1);
    assert.strictEqual(result.value, '55%');
    assert.strictEqual(result.error, null);
  });

  it('parseEdited with error', function () {
    let result;

    result = PercentConverters.parseEdited('4%2');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);

    result = PercentConverters.parseEdited('abc');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);

    result = PercentConverters.parseEdited('blupi');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);

    result = PercentConverters.parseEdited('A12');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);

    result = PercentConverters.parseEdited('12A');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);

    result = PercentConverters.parseEdited('12..3');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);

    result = PercentConverters.parseEdited('12,3');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);

    result = PercentConverters.parseEdited('12.3.4');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);

    result = PercentConverters.parseEdited('24%', '0.25', '0.75');
    assert.strictEqual(result.value, '0.25');
    assert.ok(result.error);

    result = PercentConverters.parseEdited('76%', '0.25', '0.75');
    assert.strictEqual(result.value, '0.75');
    assert.ok(result.error);

    result = PercentConverters.parseEdited('-76%', '-0.75', '-0.25');
    assert.strictEqual(result.value, '-0.75');
    assert.ok(result.error);

    result = PercentConverters.parseEdited('-24%', '-0.75', '-0.25');
    assert.strictEqual(result.value, '-0.25');
    assert.ok(result.error);
  });

  // prettier-ignore
  it('getDisplayed', function() {
    assert.strictEqual(PercentConverters.getDisplayed(null          ), null);
    assert.strictEqual(PercentConverters.getDisplayed('0'           ), '0%');
    assert.strictEqual(PercentConverters.getDisplayed('0.12'        ), '12%');
    assert.strictEqual(PercentConverters.getDisplayed('0.12',      5), '12%');
    assert.strictEqual(PercentConverters.getDisplayed('0.1234999', 2), '12.35%');
    assert.strictEqual(PercentConverters.getDisplayed('0.123'       ), '12.3%');

    assert.strictEqual(PercentConverters.getDisplayed('7%',     undefined, 1), '7%');
    assert.strictEqual(PercentConverters.getDisplayed('1.999%', 2        , 1), '2%');
    assert.strictEqual(PercentConverters.getDisplayed('1.234%', 2        , 1), '1.23%');
    assert.strictEqual(PercentConverters.getDisplayed('1.237%', 2        , 1), '1.24%');
  });

  it('check correct', function () {
    assert.ok(PercentConverters.check('0'));
    assert.ok(PercentConverters.check(0));
    assert.ok(PercentConverters.check(5));
    assert.ok(PercentConverters.check('1'));
    assert.ok(PercentConverters.check('123'));
    assert.ok(PercentConverters.check('0.123'));
    assert.ok(PercentConverters.check('-0.05'));
  });

  it('check wrong', function () {
    assert.ok(!PercentConverters.check('10%'));
    assert.ok(!PercentConverters.check(''));
    assert.ok(!PercentConverters.check(null));
    assert.ok(!PercentConverters.check(undefined));
  });

  it('incEdited', function () {
    let result;

    result = PercentConverters.incEdited('', 0, 1, 0.05, 0, 1);
    assert.strictEqual(result.edited, '5%');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 2);

    result = PercentConverters.incEdited('0.54', 0, 1, 0.05, 0, 1);
    assert.strictEqual(result.edited, '59%');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 3);

    result = PercentConverters.incEdited('54%', 0, 1, 0.05, 0, 1);
    assert.strictEqual(result.edited, '59%');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 3);

    result = PercentConverters.incEdited('54.1%', 0, -1, 0.05, 0, 1);
    assert.strictEqual(result.edited, '49.1%');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 5);

    result = PercentConverters.incEdited('1.2%', 0, -1, 0.05, 0, 1);
    assert.strictEqual(result.edited, '0%');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 2);

    result = PercentConverters.incEdited('99.9%', 0, 1, 0.05, 0, 1);
    assert.strictEqual(result.edited, '100%');
    assert.strictEqual(result.selectionStart, 0);
    assert.strictEqual(result.selectionEnd, 4);
  });
});
