'use strict';

const assert = require('assert');
const IntegerConverters = require('../lib/integer.js');

//-----------------------------------------------------------------------------

describe('Converter integer', function () {
  it('#Test parseEdited', function () {
    let result;

    result = IntegerConverters.parseEdited('');
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('123');
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited(123);
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('00123');
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('+123');
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('-123');
    assert.strictEqual(result.value, '-123');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('123.00');
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('123.800');
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('123.456789');
    assert.strictEqual(result.value, '123');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('.123');
    assert.strictEqual(result.value, '0');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('0.123');
    assert.strictEqual(result.value, '0');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited(' 12');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('1 2');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('12 ');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited("1'000.00");
    assert.strictEqual(result.value, '1000');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('12a34');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);

    result = IntegerConverters.parseEdited('12.3.4');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = IntegerConverters.parseEdited('12..3');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);
  });

  it('#Test parseEdited with error', function () {
    let result;

    result = IntegerConverters.parseEdited('blupi');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = IntegerConverters.parseEdited('A12');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = IntegerConverters.parseEdited('12A');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);

    result = IntegerConverters.parseEdited('12,3');
    assert.strictEqual(result.value, null);
    assert.notStrictEqual(result.error, null);
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.strictEqual(IntegerConverters.getDisplayed(null       ), null);
    assert.strictEqual(IntegerConverters.getDisplayed('1234'     ), "1'234");
    assert.strictEqual(IntegerConverters.getDisplayed('-1234'    ), "-1'234");
    assert.strictEqual(IntegerConverters.getDisplayed('.12'      ), '0');
    assert.strictEqual(IntegerConverters.getDisplayed('.12456', 2), '0');
    assert.strictEqual(IntegerConverters.getDisplayed('.12456', 3), '0');
    assert.strictEqual(IntegerConverters.getDisplayed('.12456', 4), '0');
    assert.strictEqual(IntegerConverters.getDisplayed('.12456', 5), '0');
    assert.strictEqual(IntegerConverters.getDisplayed('.12456', 6), '0');
    assert.strictEqual(IntegerConverters.getDisplayed(1234       ), "1'234");
    assert.strictEqual(IntegerConverters.getDisplayed(0          ), "0");
  });

  it('#Test check correct', function () {
    assert.ok(IntegerConverters.check('123'));
    assert.ok(IntegerConverters.check(123));
    assert.ok(IntegerConverters.check('-123'));
  });

  it('#Test check wrong', function () {
    assert.ok(!IntegerConverters.check('1.23'));
    assert.ok(!IntegerConverters.check('123m'));
    assert.ok(!IntegerConverters.check('123cm'));
    assert.ok(!IntegerConverters.check('.123'));
    assert.ok(!IntegerConverters.check('cm'));
  });
});
