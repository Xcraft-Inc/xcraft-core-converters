'use strict';

const assert = require('assert');
const ReferenceConverters = require('../lib/reference.js');
describe('Converter reference', function() {
  // prettier-ignore
  it('#Test generate', function() {
    assert.strictEqual(ReferenceConverters.generate('123',    '2019-01-18', '5'     ), '00123.1901.5');
    assert.strictEqual(ReferenceConverters.generate('123',    '2019-01-18', '5', '2'), '00123.1901.5-2');
    assert.strictEqual(ReferenceConverters.generate('123456', '2019-01-18', '567'   ), '23456.1901.7');
  });

  // prettier-ignore
  it('#Test getWithoutNumber', function() {
    assert.strictEqual(ReferenceConverters.getWithoutNumber('00123.1812.1'  ), '00123.1812');
    assert.strictEqual(ReferenceConverters.getWithoutNumber('00123.1812.2-3'), '00123.1812');
  });

  // prettier-ignore
  it('#Test updateSubnumber', function() {
    assert.strictEqual(ReferenceConverters.updateSubnumber('00123.1812.1',   '5'), '00123.1812.1-5');
    assert.strictEqual(ReferenceConverters.updateSubnumber('00123.1812.1-4', '5'), '00123.1812.1-5');
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.strictEqual(ReferenceConverters.getDisplayed('123.1812.1'    ), '00123.1812.1');
    assert.strictEqual(ReferenceConverters.getDisplayed('123456.1812.1' ), '23456.1812.1');
    assert.strictEqual(ReferenceConverters.getDisplayed('00123.1812.1'  ), '00123.1812.1');
    assert.strictEqual(ReferenceConverters.getDisplayed('00123.1812.1-3'), '00123.1812.1-3');
  });
});
