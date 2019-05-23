const DateConverters = require('../lib/date.js');
const TimeConverters = require('../lib/time.js');
const DateTimeConverters = require('../lib/datetime.js');
const PriceConverters = require('../lib/price.js');
const WeightConverters = require('../lib/weight.js');
const LengthConverters = require('../lib/length.js');
const VolumeConverters = require('../lib/volume.js');
const NumberConverters = require('../lib/number.js');
const PercentConverters = require('../lib/percent.js');
const DelayConverters = require('../lib/delay.js');
const ReferenceConverters = require('../lib/reference.js');
const MonthConverters = require('../lib/month.js');
const QuarterConverters = require('../lib/quarter.js');
const SemesterConverters = require('../lib/semester.js');
const FieldTypeCheckerConverters = require('../lib/field-type-checker.js');

const typeConverters = {
  date: DateConverters,
  time: TimeConverters,
  datetime: DateTimeConverters,
  price: PriceConverters,
  weight: WeightConverters,
  length: LengthConverters,
  volume: VolumeConverters,
  number: NumberConverters,
  percent: PercentConverters,
  delay: DelayConverters,
  reference: ReferenceConverters,
  month: MonthConverters,
  quarter: QuarterConverters,
  semester: SemesterConverters,
  fieldTypeChecker: FieldTypeCheckerConverters,
};

export default function converter(type) {
  const converter = typeConverters[type];
  if (!converter) {
    throw new Error(`Unknown converter "${type}"`);
  }
  return converter;
}