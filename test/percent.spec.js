'use strict';

const assert = require('assert');
const PercentConverters = require('../lib/percent.js');

describe('Converter percent', function() {
  it('#Test parseEdited', function() {
    let result;

    result = PercentConverters.parseEdited('');
    assert.equal(null, result.value);
    assert.equal(null, result.error);

    result = PercentConverters.parseEdited('45%');
    assert.equal('0.45', result.value);
    assert.equal(null, result.error);

    result = PercentConverters.parseEdited('45.7%');
    assert.equal('0.457', result.value);
    assert.equal(null, result.error);

    result = PercentConverters.parseEdited('.2%');
    assert.equal('0.002', result.value);
    assert.equal(null, result.error);

    result = PercentConverters.parseEdited('.002%');
    assert.equal('0.00002', result.value);
    assert.equal(null, result.error);

    result = PercentConverters.parseEdited('-2%');
    assert.equal('-0.02', result.value);
    assert.equal(null, result.error);

    result = PercentConverters.parseEdited('-.2%');
    assert.equal('-0.002', result.value);
    assert.equal(null, result.error);

    result = PercentConverters.parseEdited('-0.2%');
    assert.equal('-0.002', result.value);
    assert.equal(null, result.error);

    result = PercentConverters.parseEdited('0.45');
    assert.equal('0.45', result.value);
    assert.equal(null, result.error);

    result = PercentConverters.parseEdited('4%2');
    assert.equal(null, result.value);
    assert.ok(result.error);

    result = PercentConverters.parseEdited('abc');
    assert.equal(null, result.value);
    assert.ok(result.error);
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.equal(null,     PercentConverters.getDisplayed(null));
    assert.equal('12%',    PercentConverters.getDisplayed('0.12'));
    assert.equal('12%',    PercentConverters.getDisplayed('0.12', 5));
    assert.equal('12.35%', PercentConverters.getDisplayed('0.1234999', 2));
    assert.equal('12.3%',  PercentConverters.getDisplayed('0.123'));
  });

  it('#Test check correct', function() {
    assert.ok(PercentConverters.check('1'));
    assert.ok(PercentConverters.check('123'));
    assert.ok(PercentConverters.check('0.123'));
    assert.ok(PercentConverters.check('-0.05'));
  });

  it('#Test check wrong', function() {
    assert.ok(!PercentConverters.check('10%'));
    assert.ok(!PercentConverters.check(5));
  });
});
