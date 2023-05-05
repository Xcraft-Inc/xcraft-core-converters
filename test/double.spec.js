'use strict';

const assert = require('assert');
const DoubleConverters = require('../lib/double.js');

//-----------------------------------------------------------------------------

describe('xcraft.converters.double', function () {
  it('parseEdited', function () {
    let result;

    result = DoubleConverters.parseEdited('');
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('123');
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited(123);
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('00123');
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('+123');
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('-123');
    assert.strictEqual(result.value, '-123');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('123.00');
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('0.0123456789123456');
    assert.strictEqual(result.value, '0.0123456789123456');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('0.0123456789123456991');
    assert.strictEqual(result.value, '0.0123456789123456991');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('123.810');
    assert.strictEqual(result.value, '123.81');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('123.456789');
    assert.strictEqual(result.value, '123.456789');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('.123');
    assert.strictEqual(result.value, '0.123');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('-.123');
    assert.strictEqual(result.value, '-0.123');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('0.123');
    assert.strictEqual(result.value, '0.123');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited(' 12');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('1 2');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('12 ');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('12 ');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited("1'000.00");
    assert.strictEqual(result.value, '1000');
    assert.strictEqual(result.error, null);

    result = DoubleConverters.parseEdited('12a34');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);
  });

  it('parseEdited with error', function () {
    let result;

    result = DoubleConverters.parseEdited('blupi');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = DoubleConverters.parseEdited('A12');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = DoubleConverters.parseEdited('12A');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = DoubleConverters.parseEdited('12..3');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = DoubleConverters.parseEdited('12,3');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = DoubleConverters.parseEdited('12.3.4');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);
  });

  // prettier-ignore
  it('getDisplayed', function() {
    assert.strictEqual(DoubleConverters.getDisplayed(null), null);
    assert.strictEqual(DoubleConverters.getDisplayed('1234'), "1'234");
    assert.strictEqual(DoubleConverters.getDisplayed('-1234'), "-1'234");
    assert.strictEqual(DoubleConverters.getDisplayed('.12'), '0.12');
    assert.strictEqual(DoubleConverters.getDisplayed('.12456'),    '0.12456');
    assert.strictEqual(DoubleConverters.getDisplayed(1234), "1'234");
    assert.strictEqual(DoubleConverters.getDisplayed(0), "0");
    assert.strictEqual(DoubleConverters.getDisplayed('.0123456789123456991'), "0.0123456789123456991");
  });

  it('check correct', function () {
    assert.ok(DoubleConverters.check('0.00'));
    assert.ok(DoubleConverters.check(0));
    assert.ok(DoubleConverters.check('123.00'));
    assert.ok(DoubleConverters.check(123.0));
    assert.ok(DoubleConverters.check('-123.00'));
    assert.ok(DoubleConverters.check(-123.0));
    assert.ok(DoubleConverters.check('1.23'));
  });

  it('check wrong', function () {
    assert.ok(!DoubleConverters.check('123'));
    assert.ok(!DoubleConverters.check('123m'));
    assert.ok(!DoubleConverters.check('123cm'));
    assert.ok(!DoubleConverters.check('cm'));
    assert.ok(!DoubleConverters.check('.123'));
    assert.ok(!DoubleConverters.check('-123.0'));
    assert.ok(!DoubleConverters.check(''));
    assert.ok(!DoubleConverters.check(null));
    assert.ok(!DoubleConverters.check(undefined));
  });
});
