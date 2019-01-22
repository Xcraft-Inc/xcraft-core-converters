'use strict';

const assert = require('assert');

const BigNumber = require('bignumber.js');

const parseFormat = {
  decimalSeparator: '.',
  groupSeparator: '',
  groupSize: 0,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
};

function convertLength(value, decimals) {
  BigNumber.config({
    FORMAT: parseFormat,
    DECIMAL_PLACES: decimals || 3,
    ERRORS: false,
  });
  console.log('TOTO');
  console.log(value);
  value = new BigNumber(value);
  console.log(value);
  value = value.mul(1);
  console.log(value);
  value = value.div(1); // TODO: misterious bug, truncate to 2 digits!!!
  console.log(value);
  return value.toFormat(decimals || 3);
}

describe('Converter MISTERY', function() {
  it('#Test convertLength', function() {
    assert.equal('1.235', convertLength('1.23456', 3));
  });
});
