'use strict';

const assert = require('assert');
const ReferenceConverters = require('../lib/reference.js');
describe('Converter reference', function() {
  it('#Test generate', function() {
    assert.equal(
      ReferenceConverters.generate('123', '2019-01-18', '5'),
      '00123.1901.5'
    );
    assert.equal(
      ReferenceConverters.generate('123', '2019-01-18', '5', '2'),
      '00123.1901.5-2'
    );
    assert.equal(
      ReferenceConverters.generate('123456', '2019-01-18', '567'),
      '23456.1901.7'
    );
  });

  it('#Test getWithoutNumber', function() {
    assert.equal(
      ReferenceConverters.getWithoutNumber('00123.1812.1'),
      '00123.1812'
    );
    assert.equal(
      ReferenceConverters.getWithoutNumber('00123.1812.2-3'),
      '00123.1812'
    );
  });

  it('#Test updateSubnumber', function() {
    assert.equal(
      ReferenceConverters.updateSubnumber('00123.1812.1', '5'),
      '00123.1812.1-5'
    );
    assert.equal(
      ReferenceConverters.updateSubnumber('00123.1812.1-4', '5'),
      '00123.1812.1-5'
    );
  });

  it('#Test getDisplayed', function() {
    assert.equal(
      ReferenceConverters.getDisplayed('123.1812.1'),
      '00123.1812.1'
    );
    assert.equal(
      ReferenceConverters.getDisplayed('123456.1812.1'),
      '23456.1812.1'
    );
    assert.equal(
      ReferenceConverters.getDisplayed('00123.1812.1'),
      '00123.1812.1'
    );
    assert.equal(
      ReferenceConverters.getDisplayed('00123.1812.1-3'),
      '00123.1812.1-3'
    );
  });
});
