const DateConverters = require('../lib/date.js');
const TimeConverters = require('../lib/time.js');
const DateTimeConverters = require('../lib/datetime.js');
const PriceConverters = require('../lib/price.js');
const WeightConverters = require('../lib/weight.js');
const LengthConverters = require('../lib/length.js');
const PixelConverters = require('../lib/pixel.js');
const VolumeConverters = require('../lib/volume.js');
const BoolConverters = require('../lib/bool.js');
const NumberConverters = require('../lib/number.js');
const IntegerConverters = require('../lib/integer.js');
const PercentConverters = require('../lib/percent.js');
const DelayConverters = require('../lib/delay.js');
const ReferenceConverters = require('../lib/reference.js');
const MonthConverters = require('../lib/month.js');
const DowConverters = require('../lib/dow.js');
const QuarterConverters = require('../lib/quarter.js');
const SemesterConverters = require('../lib/semester.js');
const YearWeekConverters = require('../lib/year-week.js');
const YearMonthConverters = require('../lib/year-month.js');
const YearQuarterConverters = require('../lib/year-quarter.js');
const YearSemesterConverters = require('../lib/year-semester.js');
const FieldTypeCheckerConverters = require('../lib/field-type-checker.js');
const ColorConverters = require('../lib/color.js');

const typeConverters = {
  date: DateConverters,
  time: TimeConverters,
  datetime: DateTimeConverters,
  price: PriceConverters,
  weight: WeightConverters,
  length: LengthConverters,
  pixel: PixelConverters,
  volume: VolumeConverters,
  bool: BoolConverters,
  number: NumberConverters,
  integer: IntegerConverters,
  percent: PercentConverters,
  delay: DelayConverters,
  reference: ReferenceConverters,
  month: MonthConverters,
  dow: DowConverters,
  quarter: QuarterConverters,
  semester: SemesterConverters,
  yearWeek: YearWeekConverters,
  yearMonth: YearMonthConverters,
  yearQuarter: YearQuarterConverters,
  yearSemester: YearSemesterConverters,
  fieldTypeChecker: FieldTypeCheckerConverters,
  color: ColorConverters,
};

function getConverter(type) {
  const converter = typeConverters[type];
  if (!converter) {
    console.log(`Unknown converter "${type}"`);
  }
  return converter;
}

module.exports = {
  getConverter,
};
