'use strict';

const assert = require('assert');
const PriceConverters = require('../lib/price.js');

//-----------------------------------------------------------------------------

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

    result = PriceConverters.parseEdited('−1.00'); // test with minus \u2212
    assert.strictEqual(result.value, '-1');
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

    result = PriceConverters.parseEdited('.9999');
    assert.strictEqual(result.value, '1');
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited(' 12');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited('1 2');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited('12 ');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited("123'456");
    assert.strictEqual(result.value, '123456');
    assert.strictEqual(result.error, null);

    result = PriceConverters.parseEdited("1 23''45' 6");
    assert.strictEqual(result.value, '123456');
    assert.strictEqual(result.error, null);
  });

  it('#Test parseEdited with error', function() {
    let result;

    result = PriceConverters.parseEdited('blupi');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = PriceConverters.parseEdited('A12');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = PriceConverters.parseEdited('12A');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = PriceConverters.parseEdited('12..3');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = PriceConverters.parseEdited('12,3');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = PriceConverters.parseEdited('12.3.4');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);
  });

  // prettier-ignore
  it('#Test getDisplayed with empty input', function() {
    assert.strictEqual(PriceConverters.getDisplayed(undefined), '');
    assert.strictEqual(PriceConverters.getDisplayed(null     ), '');
    assert.strictEqual(PriceConverters.getDisplayed(''       ), '');
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.strictEqual(PriceConverters.getDisplayed(       '123'   ),           '123.00');
    assert.strictEqual(PriceConverters.getDisplayed(      '1234.5' ),         "1'234.50");
    assert.strictEqual(PriceConverters.getDisplayed(     '-1234.5' ),        "−1'234.50");

    assert.strictEqual(PriceConverters.getDisplayed('7891234567.89'), "7'891'234'567.89");
    assert.strictEqual(PriceConverters.getDisplayed( '891234567.89'),   "891'234'567.89");
    assert.strictEqual(PriceConverters.getDisplayed(  '91234567.89'),    "91'234'567.89");
    assert.strictEqual(PriceConverters.getDisplayed(   '1234567.89'),     "1'234'567.89");
    assert.strictEqual(PriceConverters.getDisplayed(    '234567.89'),       "234'567.89");
    assert.strictEqual(PriceConverters.getDisplayed(     '34567.89'),        "34'567.89");
    assert.strictEqual(PriceConverters.getDisplayed(      '4567.89'),         "4'567.89");
    assert.strictEqual(PriceConverters.getDisplayed(       '567.89'),           '567.89');
    assert.strictEqual(PriceConverters.getDisplayed(        '67.89'),            '67.89');
    assert.strictEqual(PriceConverters.getDisplayed(         '7.89'),             '7.89');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.89'),             '0.89');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.09'),             '0.09');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.06'),             '0.06');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.04'),             '0.04');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.00'),             '0.00');
    assert.strictEqual(PriceConverters.getDisplayed(        '-1234'),        "−1'234.00");
    assert.strictEqual(PriceConverters.getDisplayed(         '1234'),         "1'234.00");
  });

  // prettier-ignore
  it('#Test getDisplayed with money and precision 0.05', function() {
    assert.strictEqual(PriceConverters.getDisplayed(    '0.89', "p-0.05"),      '0.90');
    assert.strictEqual(PriceConverters.getDisplayed(    '0.09', "p-0.05"),      '0.10');
    assert.strictEqual(PriceConverters.getDisplayed(    '0.06', "p-0.05"),      '0.05');
    assert.strictEqual(PriceConverters.getDisplayed(    '0.04', "p-0.05"),      '0.05');
    assert.strictEqual(PriceConverters.getDisplayed(    '0.00', "p-0.05"),      '0.00');
    assert.strictEqual(PriceConverters.getDisplayed( '1234.15', "p-0.05"),  "1'234.15");
    assert.strictEqual(PriceConverters.getDisplayed('-1234.15', "p-0.05"), "−1'234.15");
    assert.strictEqual(PriceConverters.getDisplayed(   '-0.01', "p-0.05"),     '−0.00');
  });

  // prettier-ignore
  it('#Test getDisplayed with money and precision 1M and separators', function() {
    assert.strictEqual(PriceConverters.getDisplayed('7891234567.89', "p-1M"), "7'891 M");
    assert.strictEqual(PriceConverters.getDisplayed( '891234567.89', "p-1M"),   '891 M');
    assert.strictEqual(PriceConverters.getDisplayed(  '91234567.89', "p-1M"),  '91.2 M');
    assert.strictEqual(PriceConverters.getDisplayed(   '1234567.89', "p-1M"),  '1.23 M');
    assert.strictEqual(PriceConverters.getDisplayed(    '234567.89', "p-1M"), "234'568");
    assert.strictEqual(PriceConverters.getDisplayed(     '34567.89', "p-1M"),  "34'568");
    assert.strictEqual(PriceConverters.getDisplayed(      '4567.89', "p-1M"),   "4'568");
    assert.strictEqual(PriceConverters.getDisplayed(       '567.89', "p-1M"),  '567.90');
    assert.strictEqual(PriceConverters.getDisplayed(        '67.89', "p-1M"),   '67.90');
    assert.strictEqual(PriceConverters.getDisplayed(         '7.89', "p-1M"),    '7.90');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.89', "p-1M"),    '0.90');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.09', "p-1M"),    '0.10');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.06', "p-1M"),    '0.05');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.04', "p-1M"),    '0.05');
    assert.strictEqual(PriceConverters.getDisplayed(         '0.00', "p-1M"),    '0.00');
    assert.strictEqual(PriceConverters.getDisplayed(        '-1234', "p-1M"),  "−1'234");
    assert.strictEqual(PriceConverters.getDisplayed(         '1234', "p-1M"),   "1'234");
  });

  // prettier-ignore
  it('#Test getDisplayed with JS number', function() {
    assert.strictEqual(PriceConverters.getDisplayed(0), '0.00');
    assert.strictEqual(PriceConverters.getDisplayed(1), '1.00');
    assert.strictEqual(PriceConverters.getDisplayed(-1), '−1.00');
    assert.strictEqual(PriceConverters.getDisplayed(1 / 3), '0.33');
    assert.strictEqual(PriceConverters.getDisplayed(2 / 3), '0.67');

    assert.strictEqual(PriceConverters.getDisplayed(7891234567.89, "p-1M"), "7'891 M");
    assert.strictEqual(PriceConverters.getDisplayed( 891234567.89, "p-1M"),   '891 M');
    assert.strictEqual(PriceConverters.getDisplayed(  91234567.89, "p-1M"),  '91.2 M');
    assert.strictEqual(PriceConverters.getDisplayed(   1234567.89, "p-1M"),  '1.23 M');
    assert.strictEqual(PriceConverters.getDisplayed(    234567.89, "p-1M"), "234'568");
    assert.strictEqual(PriceConverters.getDisplayed(     34567.89, "p-1M"),  "34'568");
    assert.strictEqual(PriceConverters.getDisplayed(      4567.89, "p-1M"),   "4'568");
    assert.strictEqual(PriceConverters.getDisplayed(       567.89, "p-1M"),  '567.90');
    assert.strictEqual(PriceConverters.getDisplayed(        67.89, "p-1M"),   '67.90');
    assert.strictEqual(PriceConverters.getDisplayed(         7.89, "p-1M"),    '7.90');
    assert.strictEqual(PriceConverters.getDisplayed(         0.89, "p-1M"),    '0.90');
    assert.strictEqual(PriceConverters.getDisplayed(         0.09, "p-1M"),    '0.10');
    assert.strictEqual(PriceConverters.getDisplayed(         0.06, "p-1M"),    '0.05');
    assert.strictEqual(PriceConverters.getDisplayed(         0.04, "p-1M"),    '0.05');
    assert.strictEqual(PriceConverters.getDisplayed(          0.0, "p-1M"),    '0.00');
    assert.strictEqual(PriceConverters.getDisplayed(        -1234, "p-1M"),  "−1'234");
    assert.strictEqual(PriceConverters.getDisplayed(         1234, "p-1M"),   "1'234");
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
    assert.ok(!PriceConverters.check(null));
    assert.ok(!PriceConverters.check(''));
    assert.ok(!PriceConverters.check("12'000"));
    assert.ok(!PriceConverters.check('123.456'));
    assert.ok(!PriceConverters.check('-1x3'));
    assert.ok(!PriceConverters.check(100));
  });
});
