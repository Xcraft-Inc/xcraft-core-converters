'use strict';

const assert = require('assert');
const VolumeConverters = require('../lib/volume.js');

//-----------------------------------------------------------------------------

describe('xcraft.converters.volume', function () {
  it('parseEdited', function () {
    let result;

    result = VolumeConverters.parseEdited('');
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = VolumeConverters.parseEdited('1x20 300', 'cm');
    assert.strictEqual(result.value, '0.01 0.2 3');
    assert.strictEqual(result.error, null);

    result = VolumeConverters.parseEdited('10 20 30 cm', 'in');
    assert.strictEqual(result.value, '0.1 0.2 0.3');
    assert.strictEqual(result.error, null);

    result = VolumeConverters.parseEdited('12 13 14', 'm');
    assert.strictEqual(result.value, '12 13 14');
    assert.strictEqual(result.error, null);

    result = VolumeConverters.parseEdited('12m3', 'm3');
    assert.strictEqual(result.value, '12');
    assert.strictEqual(result.error, null);

    result = VolumeConverters.parseEdited('12dm3', 'm3');
    assert.strictEqual(result.value, '0.012');
    assert.strictEqual(result.error, null);

    result = VolumeConverters.parseEdited('12 13', 'm');
    assert.strictEqual(result.value, null);
    assert.ok(result.error);
  });

  it('getDisplayed without format', function () {
    assert.strictEqual(typeof VolumeConverters.getDisplayed('5'), 'string');
  });

  // prettier-ignore
  it('getDisplayed', function() {
    assert.strictEqual(VolumeConverters.getDisplayed(null                  ), null);
    assert.strictEqual(VolumeConverters.getDisplayed('0.12 0.13 1.4', 'cm' ), '12 × 13 × 140 cm');
    assert.strictEqual(VolumeConverters.getDisplayed('1.2 1.3 1.4',   'm'  ), '1.2 × 1.3 × 1.4 m');
    assert.strictEqual(VolumeConverters.getDisplayed('0.012',         'dm3'), '12dm3');
    assert.strictEqual(VolumeConverters.getDisplayed('0.012',         'l'  ), '12l');
    assert.strictEqual(VolumeConverters.getDisplayed('5',             'm3' ), '5m3');
  });

  // prettier-ignore
  it('getCanonicalIATA', function() {
    assert.strictEqual(VolumeConverters.getCanonicalIATA('0.1 0.2 0.3', 6000), '1');
    assert.strictEqual(VolumeConverters.getCanonicalIATA('0.1 0.2 0.3', 5000), '1.2');
    assert.strictEqual(VolumeConverters.getCanonicalIATA('1 2 3',       5000), '1200');
  });

  // prettier-ignore
  it('getDisplayedIATA', function() {
    assert.strictEqual(VolumeConverters.getDisplayedIATA('1 1 1', 6000         ), '166.667kg');
    assert.strictEqual(VolumeConverters.getDisplayedIATA('1 1 1', 6000, 'kg'   ), '166.667kg');
    assert.strictEqual(VolumeConverters.getDisplayedIATA('1 1 1', 6000, 'kg', 0), '167kg');
    assert.strictEqual(VolumeConverters.getDisplayedIATA('1 1 1', 6000, 'kg', 1), '166.7kg');
    assert.strictEqual(VolumeConverters.getDisplayedIATA('1 1 1', 6000, 'kg', 3), '166.667kg');
    assert.strictEqual(VolumeConverters.getDisplayedIATA('1 1 1', 6000, 'kg', 5), '166.667kg');
  });

  it('check correct', function () {
    assert.ok(VolumeConverters.check('1 2 3'));
    assert.ok(VolumeConverters.check('12 34 56'));
    assert.ok(VolumeConverters.check('1.2 3.4 5.6'));
    assert.ok(VolumeConverters.check('.2 .3 .4'));
    assert.ok(VolumeConverters.check('1'));
    assert.ok(VolumeConverters.check('123'));
  });

  it('check wrong', function () {
    assert.ok(!VolumeConverters.check('2 3'));
    assert.ok(!VolumeConverters.check('2 3 4 5'));
    assert.ok(!VolumeConverters.check('2 -3 4'));
    assert.ok(!VolumeConverters.check('2,3,4'));
    assert.ok(!VolumeConverters.check('2dm3'));
    assert.ok(!VolumeConverters.check('2 dm3'));
    assert.ok(!VolumeConverters.check('abc'));
    assert.ok(!VolumeConverters.check(12));
    assert.ok(!VolumeConverters.check(12, 34, 56));
  });
});
