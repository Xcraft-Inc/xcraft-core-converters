'use strict';

// To run test:
// npm test xcraft-core-converters

const assert = require('assert');
const VolumeConverters = require('../lib/volume.js');

describe('Converter volume', function() {
  it('#Test parseEdited', function() {
    let result;

    result = VolumeConverters.parseEdited('');
    assert.equal(null, result.value);
    assert.equal(null, result.error);

    result = VolumeConverters.parseEdited('1x20 300', 'cm');
    assert.equal('0.01 0.2 3', result.value);
    assert.equal(null, result.error);

    result = VolumeConverters.parseEdited('10 20 30 cm', 'in');
    assert.equal('0.1 0.2 0.3', result.value);
    assert.equal(null, result.error);

    result = VolumeConverters.parseEdited('12 13 14', 'm');
    assert.equal('12 13 14', result.value);
    assert.equal(null, result.error);
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.equal(null,                VolumeConverters.getDisplayed(null));
    assert.equal('12 × 13 × 140 cm',  VolumeConverters.getDisplayed('0.12 0.13 1.4', 'cm'));
    assert.equal('1.2 × 1.3 × 1.4 m', VolumeConverters.getDisplayed('1.2 1.3 1.4',   'm'));
    assert.equal('12dm3',             VolumeConverters.getDisplayed('0.012',         'dm3'));
    assert.equal('12l',               VolumeConverters.getDisplayed('0.012',         'l'));
    assert.equal('5m3',               VolumeConverters.getDisplayed('5',             'm3'));
  });

  // prettier-ignore
  it('#Test getCanonicalIATA', function() {
    assert.equal('1',    VolumeConverters.getCanonicalIATA('0.1 0.2 0.3', 6000));
    assert.equal('1.2',  VolumeConverters.getCanonicalIATA('0.1 0.2 0.3', 5000));
    assert.equal('1200', VolumeConverters.getCanonicalIATA('1 2 3',       5000));
  });

  // prettier-ignore
  it('#Test getDisplayedIATA', function() {
    assert.equal('166.667kg',   VolumeConverters.getDisplayedIATA('1 1 1', 6000));
    assert.equal('166.667kg',   VolumeConverters.getDisplayedIATA('1 1 1', 6000, 'kg'));
    assert.equal('166.66667kg', VolumeConverters.getDisplayedIATA('1 1 1', 6000, 'kg', 5));
    assert.equal('166.7kg',     VolumeConverters.getDisplayedIATA('1 1 1', 6000, 'kg', 1));
    assert.equal('167kg',       VolumeConverters.getDisplayedIATA('1 1 1', 6000, 'kg', 0));
  });

  it('#Test check correct', function() {
    assert.ok(VolumeConverters.check('1 2 3'));
    assert.ok(VolumeConverters.check('12 34 56'));
    assert.ok(VolumeConverters.check('1.2 3.4 5.6'));
    assert.ok(VolumeConverters.check('.2 .3 .4'));
    assert.ok(VolumeConverters.check('1'));
    assert.ok(VolumeConverters.check('123'));
  });

  it('#Test check wrong', function() {
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
