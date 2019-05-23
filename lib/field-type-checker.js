const DateConverters = require('./date.js');
const TimeConverters = require('./time.js');
const DateTimeConverters = require('./datetime.js');
const PriceConverters = require('./price.js');
const WeightConverters = require('./weight.js');
const LengthConverters = require('./length.js');
const VolumeConverters = require('./volume.js');
const NumberConverters = require('./number.js');
const PercentConverters = require('./percent.js');
const DelayConverters = require('./delay.js');

//-----------------------------------------------------------------------------
function checkEntityId(fieldName, fieldContent, typedef) {
  if (!typedef.target) {
    return {
      ok: false,
      message: `In field "${fieldName}", the type "${
        typedef.type
      }" has no "target".`,
      color: 'black',
      glyph: 'solid/bug',
    };
  }
  const p = fieldContent.split('@');
  return {
    ok: p.length === 2 && p[0] === typedef.target,
    message: null,
    color: null,
    glyph: null,
  };
}

//-----------------------------------------------------------------------------
function checkEnum(fieldName, fieldContent, typedef) {
  if (!typedef.values) {
    return {
      ok: false,
      message: `In field "${fieldName}", the type "${
        typedef.type
      }" has no "values".`,
      color: 'black',
      glyph: 'solid/bug',
    };
  }
  return {
    ok: typedef.values.includes(fieldContent),
    message: null,
    color: null,
    glyph: null,
  };
}

//-----------------------------------------------------------------------------
function check(fieldName, fieldContent, typedef) {
  const type = typedef.type;
  let result = {ok: true, message: null, color: null, glyph: null};
  if (typedef.required) {
    if (!fieldContent) {
      return {
        ok: false,
        message: `The content of the field "${fieldName}" of type "${type}" must be empty, null or undefined.`,
        color: 'red',
        glyph: 'solid/exclamation-triangle',
      };
    }
  } else {
    if (!fieldContent && type !== 'bool' && type !== 'enum') {
      return result; // accept empty content
    }
  }
  switch (type) {
    case 'id':
      result.ok = typeof fieldContent === 'string';
      break;
    case 'entityId':
      result = checkEntityId(fieldName, fieldContent, typedef);
      break;
    case 'string':
      result.ok = typeof fieldContent === 'string';
      break;
    case 'bool':
      result.ok = typeof fieldContent === 'boolean';
      break;
    case 'enum':
      result = checkEnum(fieldName, fieldContent, typedef);
      break;
    case 'date':
      result.ok = DateConverters.check(fieldContent);
      break;
    case 'time':
      result.ok = TimeConverters.check(fieldContent);
      break;
    case 'datetime':
      result.ok = DateTimeConverters.check(fieldContent);
      break;
    case 'price':
      result.ok = PriceConverters.check(fieldContent);
      break;
    case 'weight':
      result.ok = WeightConverters.check(fieldContent);
      break;
    case 'length':
      result.ok = LengthConverters.check(fieldContent);
      break;
    case 'volume':
      result.ok = VolumeConverters.check(fieldContent);
      break;
    case 'number':
      result.ok = NumberConverters.check(fieldContent);
      break;
    case 'percent':
      result.ok = PercentConverters.check(fieldContent);
      break;
    case 'delay':
      result.ok = DelayConverters.check(fieldContent);
      break;
    default:
      return {
        ok: false,
        message: `Unknown type "${type}" for field "${fieldName}".`,
        color: 'black',
        glyph: 'solid/bug',
      };
  }
  if (!result.ok && !result.message) {
    result.message = `The content of the field "${fieldName}" of type "${type}" is incorrect (${fieldContent}).`;
    result.color = 'red';
    result.glyph = 'solid/exclamation-triangle';
  }
  return result;
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
};
