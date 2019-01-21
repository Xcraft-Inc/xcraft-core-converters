'use strict';

const assert = require('assert');
const FieldType = require('../lib/field-type-checker.js');

describe('field-type', function() {
  it('#Test field-type string', function() {
    let result;

    result = FieldType.check('Blupi', 'Dupond', {type: 'string'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', '', {type: 'string'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', null, {type: 'string'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', undefined, {type: 'string'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', '', {type: 'string', required: true});
    assert.equal(false, result.ok);
  });

  it('#Test field-type bool', function() {
    let result;

    result = FieldType.check('Blupi', false, {type: 'bool'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', true, {type: 'bool'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', null, {type: 'bool'});
    assert.equal(false, result.ok);

    result = FieldType.check('Blupi', 'false', {type: 'bool'});
    assert.equal(false, result.ok);

    result = FieldType.check('Blupi', 'true', {type: 'bool'});
    assert.equal(false, result.ok);
  });

  it('#Test field-type number', function() {
    let result;

    result = FieldType.check('Blupi', null, {type: 'number'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', '', {type: 'number'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', '123', {type: 'number'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', '123.456', {type: 'number'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', '.123', {type: 'number'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', '-123', {type: 'number'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', 123, {type: 'number'});
    assert.equal(false, result.ok);

    result = FieldType.check('Blupi', '123,456', {type: 'number'});
    assert.equal(false, result.ok);
  });

  it('#Test field-type enum', function() {
    let result;

    result = FieldType.check('Blupi', 'A', {type: 'enum', values: ['A', 'B']});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', 'C', {type: 'enum', values: ['A', 'B']});
    assert.equal(false, result.ok);

    result = FieldType.check('Blupi', 'a', {type: 'enum', values: ['A', 'B']});
    assert.equal(false, result.ok);

    result = FieldType.check('Blupi', '', {type: 'enum', values: ['A', 'B']});
    assert.equal(false, result.ok);

    result = FieldType.check('Blupi', null, {type: 'enum', values: ['A', 'B']});
    assert.equal(false, result.ok);

    result = FieldType.check('Blupi', 'A', {type: 'enum'});
    assert.equal(false, result.ok);
  });

  it('#Test field-type entityId', function() {
    let result;

    result = FieldType.check('Blupi', 'toto@123', {
      type: 'entityId',
      target: 'toto',
    });
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', '456@123', {
      type: 'entityId',
      target: 'toto',
    });
    assert.equal(false, result.ok);

    result = FieldType.check('Blupi', '456@123', {type: 'entityId'});
    assert.equal(false, result.ok);
  });

  it('#Test field-type date', function() {
    let result;

    result = FieldType.check('Blupi', '2019-03-31', {type: 'date'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', '', {type: 'date'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', null, {type: 'date'});
    assert.equal(true, result.ok);

    result = FieldType.check('Blupi', null, {type: 'date', required: true});
    assert.equal(false, result.ok);
  });
});
