'use strict';

const assert = require('assert');
const FieldType = require('../lib/field-type-checker.js');

//-----------------------------------------------------------------------------

describe('field-type', function () {
  it('#Test field-type string', function () {
    let result;

    result = FieldType.check('Blupi', 'Dupond', {type: 'string'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '', {type: 'string'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', null, {type: 'string'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', undefined, {type: 'string'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '', {type: 'string', required: true});
    assert.strictEqual(result.ok, false);
  });

  it('#Test field-type bool', function () {
    let result;

    result = FieldType.check('Blupi', false, {type: 'bool'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', true, {type: 'bool'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', null, {type: 'bool'});
    assert.strictEqual(result.ok, false);

    result = FieldType.check('Blupi', 'false', {type: 'bool'});
    assert.strictEqual(result.ok, false);

    result = FieldType.check('Blupi', 'true', {type: 'bool'});
    assert.strictEqual(result.ok, false);
  });

  it('#Test field-type number', function () {
    let result;

    result = FieldType.check('Blupi', null, {type: 'number'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', 123.456, {type: 'number'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', 0.123, {type: 'number'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', -123, {type: 'number'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', 123, {type: 'number'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '', {type: 'number'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '123', {type: 'number'});
    assert.strictEqual(result.ok, true);
  });

  it('#Test field-type price', function () {
    let result;

    result = FieldType.check('Blupi', null, {type: 'price'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '', {type: 'price'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '123', {type: 'price'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '123.50', {type: 'price'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '.12', {type: 'price'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '-123', {type: 'price'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', 123, {type: 'price'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '123,45', {type: 'price'});
    assert.strictEqual(result.ok, false);
  });

  it('#Test field-type percent', function () {
    let result;

    result = FieldType.check('Blupi', null, {type: 'percent'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '', {type: 'percent'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '0.5', {type: 'percent'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '.5', {type: 'percent'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '.555555', {type: 'percent'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '1', {type: 'percent'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '-0.1', {type: 'percent'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '-.1', {type: 'percent'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', 123, {type: 'percent'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '123,456', {type: 'percent'});
    assert.strictEqual(result.ok, false);
  });

  it('#Test field-type enum', function () {
    let result;

    result = FieldType.check('Blupi', 'A', {type: 'enum', values: ['A', 'B']});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', 'C', {type: 'enum', values: ['A', 'B']});
    assert.strictEqual(result.ok, false);

    result = FieldType.check('Blupi', 'a', {type: 'enum', values: ['A', 'B']});
    assert.strictEqual(result.ok, false);

    result = FieldType.check('Blupi', '', {type: 'enum', values: ['A', 'B']});
    assert.strictEqual(result.ok, false);

    result = FieldType.check('Blupi', null, {type: 'enum', values: ['A', 'B']});
    assert.strictEqual(result.ok, false);

    result = FieldType.check('Blupi', 'A', {type: 'enum'});
    assert.strictEqual(result.ok, false);
  });

  it('#Test field-type entityId', function () {
    let result;

    result = FieldType.check('Blupi', 'toto@123', {
      type: 'entityId',
      target: 'toto',
    });
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '456@123', {
      type: 'entityId',
      target: 'toto',
    });
    assert.strictEqual(result.ok, false);

    result = FieldType.check('Blupi', '456@123', {type: 'entityId'});
    assert.strictEqual(result.ok, false);
  });

  it('#Test field-type date', function () {
    let result;

    result = FieldType.check('Blupi', '2019-03-31', {type: 'date'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '', {type: 'date'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', null, {type: 'date'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '31 03 2019', {type: 'date'});
    assert.strictEqual(result.ok, false);

    result = FieldType.check('Blupi', null, {type: 'date', required: true});
    assert.strictEqual(result.ok, false);
  });

  it('#Test field-type time', function () {
    let result;

    result = FieldType.check('Blupi', '12:00:00', {type: 'time'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '', {type: 'time'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', null, {type: 'time'});
    assert.strictEqual(result.ok, true);

    result = FieldType.check('Blupi', '12:00', {type: 'time'});
    assert.strictEqual(result.ok, false);

    result = FieldType.check('Blupi', null, {type: 'time', required: true});
    assert.strictEqual(result.ok, false);
  });
});
