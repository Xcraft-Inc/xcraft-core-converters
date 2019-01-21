'use strict';

const assert = require('assert');
const PercentConverters = require('../lib/percent.js');

describe('Converter percent', function() {
  it('#Test parseEdited', function() {
    let result;

    result = PercentConverters.parseEdited('');
    assert.equal(result.value, null);
    assert.equal(result.error, null);

    result = PercentConverters.parseEdited('45%');
    assert.equal(result.value, '0.45');
    assert.equal(result.error, null);

    result = PercentConverters.parseEdited('45.7%');
    assert.equal(result.value, '0.457');
    assert.equal(result.error, null);

    result = PercentConverters.parseEdited('.2%');
    assert.equal(result.value, '0.002');
    assert.equal(result.error, null);

    result = PercentConverters.parseEdited('.002%');
    assert.equal(result.value, '0.00002');
    assert.equal(result.error, null);

    result = PercentConverters.parseEdited('0.45');
    assert.equal(result.value, '0.45');
    assert.equal(result.error, null);

    result = PercentConverters.parseEdited('4%2');
    assert.equal(result.value, null);
    assert.ok(result.error);

    result = PercentConverters.parseEdited('abc');
    assert.equal(result.value, null);
    assert.ok(result.error);
  });

  it('#Test getDisplayed', function() {
    assert.equal(PercentConverters.getDisplayed('0.12'), '12%');
    assert.equal(PercentConverters.getDisplayed('0.12', 5), '12%');
    assert.equal(PercentConverters.getDisplayed('0.1234999', 2), '12.35%');
    assert.equal(PercentConverters.getDisplayed('0.123'), '12.3%');
  });

  it('#Test check', function() {
    assert.ok(PercentConverters.check('123'));
    assert.ok(PercentConverters.check('0.123'));
    assert.ok(!PercentConverters.check('-0.05'));
    assert.ok(!PercentConverters.check(5));
  });
});
