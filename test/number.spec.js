'use strict';

const assert = require('assert');
const NumberConverters = require('../lib/number.js');

//-----------------------------------------------------------------------------

describe('Converter number', function () {
  it('#Test parseEdited', function () {
    let result;

    result = NumberConverters.parseEdited('');
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('0');
    assert.strictEqual(result.value, 0);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('123');
    assert.strictEqual(result.value, 123);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('00123');
    assert.strictEqual(result.value, 123);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('+123');
    assert.strictEqual(result.value, 123);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('-123');
    assert.strictEqual(result.value, -123);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('123.00');
    assert.strictEqual(result.value, 123);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('123.800');
    assert.strictEqual(result.value, 123.8);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('123.456789');
    assert.strictEqual(result.value, 123.456789);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('.123');
    assert.strictEqual(result.value, 0.123);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('0.123');
    assert.strictEqual(result.value, 0.123);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited(' 12');
    assert.strictEqual(result.value, 12);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('1 2');
    assert.strictEqual(result.value, 12);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('12 ');
    assert.strictEqual(result.value, 12);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited("1'000.00");
    assert.strictEqual(result.value, 1000);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('12a34');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);
  });

  it('#Test parseEdited with error', function () {
    let result;

    result = NumberConverters.parseEdited(123);
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = NumberConverters.parseEdited('blupi');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = NumberConverters.parseEdited('A12');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = NumberConverters.parseEdited('12A');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = NumberConverters.parseEdited('12..3');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = NumberConverters.parseEdited('12,3');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = NumberConverters.parseEdited('12.3.4');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = NumberConverters.parseEdited('49', 50, 100);
    assert.strictEqual(result.value, 50);
    assert.ok(result.error);

    result = NumberConverters.parseEdited('101', 50, 100);
    assert.strictEqual(result.value, 100);
    assert.ok(result.error);

    result = NumberConverters.parseEdited('-101', -100, -50);
    assert.strictEqual(result.value, -100);
    assert.ok(result.error);

    result = NumberConverters.parseEdited('-49', -100, -50);
    assert.strictEqual(result.value, -50);
    assert.ok(result.error);
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.strictEqual(NumberConverters.getDisplayed(null      ), null);
    assert.strictEqual(NumberConverters.getDisplayed(0         ), "0");
    assert.strictEqual(NumberConverters.getDisplayed(1234      ), "1'234");
    assert.strictEqual(NumberConverters.getDisplayed(-1234     ), "-1'234");
    assert.strictEqual(NumberConverters.getDisplayed(0.12      ), '0.12');
    assert.strictEqual(NumberConverters.getDisplayed(0.12456, 2), '0.12');
    assert.strictEqual(NumberConverters.getDisplayed(0.12456, 3), '0.125');
    assert.strictEqual(NumberConverters.getDisplayed(0.12456, 4), '0.1246');
    assert.strictEqual(NumberConverters.getDisplayed(0.12456, 5), '0.12456');
    assert.strictEqual(NumberConverters.getDisplayed(0.12456, 6), '0.12456');
    assert.strictEqual(NumberConverters.getDisplayed('1234'    ), "1'234"); // accept string
  });

  it('#Test check no-strict', function () {
    assert.ok(!NumberConverters.check(undefined));
    assert.ok(NumberConverters.check(null));
    assert.ok(NumberConverters.check(0));
    assert.ok(NumberConverters.check(12));
    assert.ok(NumberConverters.check(123));
    assert.ok(NumberConverters.check(-123));
    assert.ok(NumberConverters.check(123));
    assert.ok(NumberConverters.check(''));
    assert.ok(NumberConverters.check('0')); // accept string
    assert.ok(NumberConverters.check('123'));
    assert.ok(NumberConverters.check('-123'));
    assert.ok(NumberConverters.check('+123'));
    assert.ok(NumberConverters.check('.123'));
    assert.ok(NumberConverters.check('1.23'));
  });

  it('#Test check strict', function () {
    assert.ok(!NumberConverters.check(undefined, true));
    assert.ok(!NumberConverters.check(null, true));
    assert.ok(NumberConverters.check(0, true));
    assert.ok(NumberConverters.check(12, true));
    assert.ok(NumberConverters.check(123, true));
    assert.ok(NumberConverters.check(-123, true));
    assert.ok(NumberConverters.check(123, true));
    assert.ok(!NumberConverters.check('', true));
    assert.ok(!NumberConverters.check('0', true));
    assert.ok(!NumberConverters.check('123', true));
    assert.ok(!NumberConverters.check('-123', true));
    assert.ok(!NumberConverters.check('+123', true));
    assert.ok(!NumberConverters.check('.123', true));
    assert.ok(!NumberConverters.check('1.23', true));
  });

  it('#Test check wrong', function () {
    assert.ok(!NumberConverters.check('123m'));
    assert.ok(!NumberConverters.check('123cm'));
    assert.ok(!NumberConverters.check('cm'));
  });
});
