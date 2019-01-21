'use strict';

const assert = require('assert');
const DateConverters = require('../lib/date.js');
describe('Converter date', function() {
  it('#Test parseEdited', function() {
    let result;

    result = DateConverters.parseEdited('');
    assert.equal(result.value, null);
    assert.equal(result.error, null);

    result = DateConverters.parseEdited('31 3 2017');
    assert.equal(result.value, '2017-03-31');
    assert.equal(result.error, null);

    result = DateConverters.parseEdited('31', '2017-03-10');
    assert.equal(result.value, '2017-03-31');
    assert.equal(result.error, null);

    result = DateConverters.parseEdited('31 2 2017');
    assert.equal(result.value, '2017-03-03');
    assert.equal(result.error, 'Jour incorrect');
  });

  it('#Test getDisplayed', function() {
    assert.equal(DateConverters.getDisplayed('2017-03-31'), '31.03.2017');
    assert.equal(DateConverters.getDisplayed('2017-03-31', 'y'), '2017');
    assert.equal(DateConverters.getDisplayed('2017-03-31', 'M'), 'Mars');
    assert.equal(DateConverters.getDisplayed('2017-03-31', 'M3'), 'Mar');
    assert.equal(DateConverters.getDisplayed('2019-01-18', 'W'), 'vendredi');
    assert.equal(
      DateConverters.getDisplayed('2019-01-18', 'dMy,W'),
      '18 janvier 2019, vendredi'
    );
    assert.equal(
      DateConverters.getDisplayed('2019-01-18', 'W dmy'),
      'Vendredi 18.01.2019'
    );
    assert.equal(
      DateConverters.getDisplayed('2019-01-18', 'dM3y'),
      '18 jan 2019'
    );
  });

  it('#Test check', function() {
    assert.ok(DateConverters.check('2017-03-31'));
    assert.ok(!DateConverters.check('2017/03/31'));
    assert.ok(!DateConverters.check('2017-3-31'));
    assert.ok(!DateConverters.check('2017-AB-31'));
    assert.ok(!DateConverters.check(''));
    assert.ok(!DateConverters.check(123));
    assert.ok(!DateConverters.check(null));
  });
});
