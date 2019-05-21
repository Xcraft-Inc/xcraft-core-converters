'use strict';

// To run test:
// npm test xcraft-core-converters

const assert = require('assert');
const PriceConverters = require('../lib/price.js');

describe('Converter price', function() {
  it('#Test parseEdited', function() {
    let result;

    result = PriceConverters.parseEdited('');
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited('123.00');
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited('-123');
    assert.strictEqual(result.value, '-123');
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited('123.456');
    assert.strictEqual(result.value, '123.46');
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited("1'234.5");
    assert.strictEqual(result.value, '1234.5');
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited('1.2345');
    assert.strictEqual(result.value, '1.23');
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited('1.22999');
    assert.strictEqual(result.value, '1.23');
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited('1.2999');
    assert.strictEqual(result.value, '1.3');
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited('1.9999');
    assert.strictEqual(result.value, '2');
    assert.strictEqual(result.error, null);
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.strictEqual(PriceConverters.getDisplayed(    '123'),    '123.00');
    assert.strictEqual(PriceConverters.getDisplayed( '1234.5'),  "1'234.50");
    assert.strictEqual(PriceConverters.getDisplayed('-1234.5'), "-1'234.50");
  });

  // prettier-ignore
  it('#Test getDisplayed with empty input', function() {
    assert.strictEqual(PriceConverters.getDisplayed(undefined), '');
    assert.strictEqual(PriceConverters.getDisplayed(null),      '');
    assert.strictEqual(PriceConverters.getDisplayed(''),        '');
  });

  // prettier-ignore
  it('#Test getDisplayed with money and default format', function() {
    assert.strictEqual(PriceConverters.getDisplayed('7891234567.89', "money"), "7'891'234'567.89");
    assert.strictEqual(PriceConverters.getDisplayed( '891234567.89', "money"),   "891'234'567.89");
    assert.strictEqual(PriceConverters.getDisplayed(  '91234567.89', "money"),    "91'234'567.89");
    assert.strictEqual(PriceConverters.getDisplayed(   '1234567.89', "money"),     "1'234'567.89");
    assert.strictEqual(PriceConverters.getDisplayed(    '234567.89', "money"),       "234'567.89");
    assert.strictEqual(PriceConverters.getDisplayed(     '34567.89', "money"),        "34'567.89");
    assert.strictEqual(PriceConverters.getDisplayed(      '4567.89', "money"),         "4'567.89");
    assert.strictEqual(PriceConverters.getDisplayed(       '567.89', "money"),           '567.89');
    assert.strictEqual(PriceConverters.getDisplayed(        '67.89', "money"),            '67.89');
    assert.strictEqual(PriceConverters.getDisplayed(         '7.89', "money"),             '7.89');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.89', "money"),             '0.89');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.09', "money"),             '0.09');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.06', "money"),             '0.06');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.04', "money"),             '0.04');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.00', "money"),             '0.00');
    assert.strictEqual(PriceConverters.getDisplayed(        '-1234', "money"),        "−1'234.00");
    assert.strictEqual(PriceConverters.getDisplayed(         '1234', "money"),         "1'234.00");
  });

  // prettier-ignore
  it('#Test getDisplayed with money and precision 0.05', function() {
    const options = {
      precision: '0.05',
    };
    assert.strictEqual(PriceConverters.getDisplayed(    '0.89', "money", options),      '0.90');
    assert.strictEqual(PriceConverters.getDisplayed(    '0.09', "money", options),      '0.10');
    assert.strictEqual(PriceConverters.getDisplayed(    '0.06', "money", options),      '0.05');
    assert.strictEqual(PriceConverters.getDisplayed(    '0.04', "money", options),      '0.05');
    assert.strictEqual(PriceConverters.getDisplayed(    '0.00', "money", options),      '0.00');
    assert.strictEqual(PriceConverters.getDisplayed( '1234.15', "money", options),  "1'234.15");
    assert.strictEqual(PriceConverters.getDisplayed('-1234.15', "money", options), "−1'234.15");
    assert.strictEqual(PriceConverters.getDisplayed(   '-0.01', "money", options),     '−0.00');
  });

  // prettier-ignore
  it('#Test getDisplayed with money and precision 1M and separators', function() {
    const options = {
      decimal: '.',
      thousands: '\u2009', // thin space
      minus: '\u2212', // minus
      precision: '1M',
      unitSeparator: ' ',
      unit: '',
    };
    assert.strictEqual(PriceConverters.getDisplayed('7891234567.89', "money", options), '7 891 M');
    assert.strictEqual(PriceConverters.getDisplayed( '891234567.89', "money", options),   '891 M');
    assert.strictEqual(PriceConverters.getDisplayed(  '91234567.89', "money", options),  '91.2 M');
    assert.strictEqual(PriceConverters.getDisplayed(   '1234567.89', "money", options),  '1.23 M');
    assert.strictEqual(PriceConverters.getDisplayed(    '234567.89', "money", options), '234 568');
    assert.strictEqual(PriceConverters.getDisplayed(     '34567.89', "money", options),  '34 568');
    assert.strictEqual(PriceConverters.getDisplayed(      '4567.89', "money", options),   '4 568');
    assert.strictEqual(PriceConverters.getDisplayed(       '567.89', "money", options),  '567.90');
    assert.strictEqual(PriceConverters.getDisplayed(        '67.89', "money", options),   '67.90');
    assert.strictEqual(PriceConverters.getDisplayed(         '7.89', "money", options),    '7.90');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.89', "money", options),    '0.90');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.09', "money", options),    '0.10');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.06', "money", options),    '0.05');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.04', "money", options),    '0.05');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.00', "money", options),    '0.00');
    assert.strictEqual(PriceConverters.getDisplayed(        '-1234', "money", options),  '−1 234');
    assert.strictEqual(PriceConverters.getDisplayed(         '1234', "money", options),   '1 234');
  });

  // prettier-ignore
  it('#Test getDisplayed with JS number', function() {
    assert.strictEqual(PriceConverters.getDisplayed(0), '0.00');
    assert.strictEqual(PriceConverters.getDisplayed(1), '1.00');
    assert.strictEqual(PriceConverters.getDisplayed(-1), '-1.00');
    assert.strictEqual(PriceConverters.getDisplayed(1 / 3), '0.33');
    assert.strictEqual(PriceConverters.getDisplayed(2 / 3), '0.67');

    const options = {
      decimal: '.',
      thousands: '\u2009', // thin space
      minus: '\u2212', // minus
      precision: '1M',
      unitSeparator: ' ',
      unit: '',
    };
    assert.strictEqual(PriceConverters.getDisplayed(7891234567.89, "money", options), '7 891 M');
    assert.strictEqual(PriceConverters.getDisplayed( 891234567.89, "money", options),   '891 M');
    assert.strictEqual(PriceConverters.getDisplayed(  91234567.89, "money", options),  '91.2 M');
    assert.strictEqual(PriceConverters.getDisplayed(   1234567.89, "money", options),  '1.23 M');
    assert.strictEqual(PriceConverters.getDisplayed(    234567.89, "money", options), '234 568');
    assert.strictEqual(PriceConverters.getDisplayed(     34567.89, "money", options),  '34 568');
    assert.strictEqual(PriceConverters.getDisplayed(      4567.89, "money", options),   '4 568');
    assert.strictEqual(PriceConverters.getDisplayed(       567.89, "money", options),  '567.90');
    assert.strictEqual(PriceConverters.getDisplayed(        67.89, "money", options),   '67.90');
    assert.strictEqual(PriceConverters.getDisplayed(         7.89, "money", options),    '7.90');
    assert.strictEqual(PriceConverters.getDisplayed(         0.89, "money", options),    '0.90');
    assert.strictEqual(PriceConverters.getDisplayed(         0.09, "money", options),    '0.10');
    assert.strictEqual(PriceConverters.getDisplayed(         0.06, "money", options),    '0.05');
    assert.strictEqual(PriceConverters.getDisplayed(         0.04, "money", options),    '0.05');
    assert.strictEqual(PriceConverters.getDisplayed(          0.0, "money", options),    '0.00');
    assert.strictEqual(PriceConverters.getDisplayed(        -1234, "money", options),  '−1 234');
    assert.strictEqual(PriceConverters.getDisplayed(         1234, "money", options),   '1 234');
  });

  it('#Test check correct', function() {
    assert.ok(PriceConverters.check('123'));
    assert.ok(PriceConverters.check('123.45'));
    assert.ok(PriceConverters.check('-123'));
    assert.ok(PriceConverters.check('0.25'));
    assert.ok(PriceConverters.check('.25'));
    assert.ok(PriceConverters.check('-0.25'));
    assert.ok(PriceConverters.check('-.25'));
  });

  it('#Test check wrong', function() {
    assert.ok(!PriceConverters.check("12'000"));
    assert.ok(!PriceConverters.check('123.456'));
    assert.ok(!PriceConverters.check('-1x3'));
    assert.ok(!PriceConverters.check(100));
  });
});
