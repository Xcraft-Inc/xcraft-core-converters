'use strict';

// To run test:
// npm test xcraft-core-converters

const assert = require('assert');
const DateTimeConverters = require('../lib/datetime.js');

describe('Converter datetime', function() {
  // prettier-ignore
  it('#Test jsToCanonical', function() {
    assert.equal('2019-01-18T00:00:00.000Z', DateTimeConverters.jsToCanonical(new Date(2019, 0, 18,  0,  0,  0)));
    assert.equal('2019-01-18T14:15:30.000Z', DateTimeConverters.jsToCanonical(new Date(2019, 0, 18, 14, 15, 30)));
    assert.equal('2019-01-18T23:59:59.000Z', DateTimeConverters.jsToCanonical(new Date(2019, 0, 18, 23, 59, 59)));
  });

  // prettier-ignore
  it('#Test canonicalToJs', function() {
    let js;
    
    js = DateTimeConverters.canonicalToJs('2011-10-05T00:00:00.000Z');
    assert.equal(js.getHours(), 0);
    
    js = DateTimeConverters.canonicalToJs('2011-10-05T13:48:00.000Z');
    assert.equal(js.getHours(), 13);
    
    js = DateTimeConverters.canonicalToJs('2011-10-05T23:59:59.000Z');
    assert.equal(js.getHours(), 23);
  });

  // prettier-ignore
  it('#Test canonical <-> js', function() {
    let c1, c2, js;

    c1 = '2019-11-25T14:48:33.000Z';
    js = DateTimeConverters.canonicalToJs(c1);
    c2 = DateTimeConverters.jsToCanonical(js);
    assert.equal(c1, c2);

    c1 = DateTimeConverters.getNowCanonical();
    js = DateTimeConverters.canonicalToJs(c1);
    c2 = DateTimeConverters.jsToCanonical(js);
    assert.equal(c1, c2);

    const d1 = new Date(2019, 11, 25, 23, 59, 59);
    const c3 = DateTimeConverters.jsToCanonical(d1);
    const d2 = DateTimeConverters.canonicalToJs(c3);
    assert.equal(d1.toISOString(), d2.toISOString());
  });

  // prettier-ignore
  it('#Test parseEdited', function() {
    let result;
    
    result = DateTimeConverters.parseEdited('31 3 2017 13 41 0');
    assert.equal(result.value, '2017-03-31T13:41:00.000Z');
    assert.equal(result.error, null);

    result = DateTimeConverters.parseEdited('10 3', '2017-03-31T12:42:00.000Z');
    assert.equal(result.value, '2017-03-10T12:42:00.000Z');
    assert.equal(result.error, null);

    result = DateTimeConverters.parseEdited('10 3', null, '2017-03-31', '12:43:00');
    assert.equal(result.value, '2017-03-10T12:43:00.000Z');
    assert.equal(result.error, null);
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.equal('31.03.2017 12:48', DateTimeConverters.getDisplayed('2017-03-31T12:48:00.000Z'));
    assert.equal('12:48',            DateTimeConverters.getDisplayed('2017-03-31T12:48:00.000Z', 'time'));
    assert.equal('31.03.2017',       DateTimeConverters.getDisplayed('2017-03-31T12:48:00.000Z', 'date'));
  });

  it('#Test check correct', function() {
    assert.ok(DateTimeConverters.check('0000-00-00T00:00:00.000Z'));
    assert.ok(DateTimeConverters.check('2019-01-18T14:00:00.000Z'));
  });

  it('#Test check wrong', function() {
    assert.ok(!DateTimeConverters.check('2019-01-18T14:00:00'));
    assert.ok(!DateTimeConverters.check('2019-01-18t14:00:00.000Z'));
    assert.ok(!DateTimeConverters.check('coucou'));
  });
});
