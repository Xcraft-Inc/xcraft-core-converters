'use strict';

const assert = require('assert');
const ReferenceConverters = require('../lib/reference.js');
describe('Converter reference', function() {
  // prettier-ignore
  it('#Test generate', function() {
    assert.equal('00123.1901.5',   ReferenceConverters.generate('123',    '2019-01-18', '5'));
    assert.equal('00123.1901.5-2', ReferenceConverters.generate('123',    '2019-01-18', '5', '2'));
    assert.equal('23456.1901.7',   ReferenceConverters.generate('123456', '2019-01-18', '567'));
  });

  // prettier-ignore
  it('#Test getWithoutNumber', function() {
    assert.equal('00123.1812', ReferenceConverters.getWithoutNumber('00123.1812.1'));
    assert.equal('00123.1812', ReferenceConverters.getWithoutNumber('00123.1812.2-3'));
  });

  // prettier-ignore
  it('#Test updateSubnumber', function() {
    assert.equal('00123.1812.1-5', ReferenceConverters.updateSubnumber('00123.1812.1',   '5'));
    assert.equal('00123.1812.1-5', ReferenceConverters.updateSubnumber('00123.1812.1-4', '5'));
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.equal('00123.1812.1',   ReferenceConverters.getDisplayed('123.1812.1'));
    assert.equal('23456.1812.1',   ReferenceConverters.getDisplayed('123456.1812.1'));
    assert.equal('00123.1812.1',   ReferenceConverters.getDisplayed('00123.1812.1'));
    assert.equal('00123.1812.1-3', ReferenceConverters.getDisplayed('00123.1812.1-3'));
  });
});
