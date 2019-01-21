'use strict';

const assert = require('assert');
const DateTimeConverters = require('../lib/datetime.js');

describe('Converter datetime', function() {
  // UTC has a shift of 1 hour!
  //- TODO: Fix bug with UTC shift!
  //- it('#Test jsToCanonical', function() {
  //-   const js = new Date(2019, 1, 18, 14, 0, 0);
  //-   const c = DateTimeConverters.jsToCanonical(js);
  //-   assert.equal(c, '2019-01-18T13:00:00.000Z');
  //- });
  //-
  //- it('#Test canonicalToJs', function() {
  //-   const js = DateTimeConverters.canonicalToJs('2011-10-05T13:48:00.000Z');
  //-   assert.equal(js.getHours(), 14);
  //- });
  //-
  //- it('#Test parseEdited', function() {
  //-   let result;
  //-
  //-   result = DateTimeConverters.parseEdited('31 3 2017 13 41 0');
  //-   assert.equal(result.value, '2017-03-31T12:41:00.000Z');
  //-   assert.equal(result.error, null);
  //-
  //-   result = DateTimeConverters.parseEdited('10 3', '2017-03-31T12:42:00.000Z');
  //-   assert.equal(result.value, '2017-03-10T12:42:00.000Z');
  //-   assert.equal(result.error, null);
  //-
  //-   result = DateTimeConverters.parseEdited(
  //-     '10 3',
  //-     null,
  //-     '2017-03-31',
  //-     '12:43:00'
  //-   );
  //-   assert.equal(result.value, '2017-03-10T12:43:00.000Z');
  //-   assert.equal(result.error, null);
  //- });

  it('#Test getDisplayed', function() {
    assert.equal(
      DateTimeConverters.getDisplayed('2017-03-31T12:48:00.000Z'),
      '31.03.2017 14:48'
    );
    assert.equal(
      DateTimeConverters.getDisplayed('2017-03-31T12:48:00.000Z', 'date'),
      '31.03.2017'
    );
  });

  it('#Test check', function() {
    assert.ok(DateTimeConverters.check('2019-01-18T14:00:00.000Z'));
    assert.ok(!DateTimeConverters.check('2019-01-18T14:00:00'));
    assert.ok(!DateTimeConverters.check('2019-01-18t14:00:00.000Z'));
    assert.ok(!DateTimeConverters.check('coucou'));
  });
});
