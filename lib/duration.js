// @ts-check

/**
 * @typedef {object} Duration
 * @property {number | null} [Duration.weeks]
 * @property {number | null} [Duration.days]
 * @property {number | null} [Duration.hours]
 * @property {number | null} [Duration.minutes]
 * @property {number | null} [Duration.seconds]
 */

const durationKeys = /** @type {const} */ ([
  // In descending order
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
]);

/** @type {{[P in keyof Duration]-?: NonNullable<Duration[P]>}} */
const durationMs = {
  weeks: 7 * 24 * 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
  hours: 60 * 60 * 1000,
  minutes: 60 * 1000,
  seconds: 1000,
};

/**
 * @param {number | null | undefined} value1
 * @param {number | null | undefined} value2
 * @returns {boolean}
 */
function durationValueEquals(value1, value2) {
  const hasValue1 = typeof value1 === 'number' && value1 !== 0;
  const hasValue2 = typeof value2 === 'number' && value2 !== 0;
  if (hasValue1 && hasValue2) {
    return value1 === value2;
  }
  return hasValue1 === hasValue2;
}

/**
 *
 * @param {Duration} duration1
 * @param {Duration} duration2
 * @returns {boolean}
 */
function durationEquals(duration1, duration2) {
  return durationKeys.every((key) =>
    durationValueEquals(duration1[key], duration2[key])
  );
}

/**
 * @param {Duration} duration
 * @returns {Duration}
 */
function negativeDuration(duration) {
  return Object.fromEntries(
    Object.entries(duration).map(([name, value]) => [
      name,
      typeof value === 'number' ? -value : value,
    ])
  );
}

/**
 * @param {Duration} duration
 * @returns {[keyof Duration, number][]}
 */
function durationEntries(duration) {
  return Object.entries(duration)
    .filter(([name, value]) => typeof value === 'number')
    .sort(
      ([name1], [name2]) =>
        durationKeys.indexOf(name1) - durationKeys.indexOf(name2)
    );
}

/**
 * @param {Duration} duration
 * @returns {number}
 */
function durationToMs(duration) {
  const entries = durationEntries(duration);
  let milliseconds = 0;
  for (const [name, number] of entries) {
    const mult = durationMs[name];
    milliseconds += number * mult;
  }
  return milliseconds;
}

/**
 * @param {Duration} duration
 * @returns {-1 | 0 | 1}
 */
function durationSign(duration) {
  const milliseconds = durationToMs(duration);
  return milliseconds > 0 ? 1 : milliseconds < 0 ? -1 : 0;
}

/**
 * @param {Duration} duration
 * @returns {Duration}
 */
function absoluteDuration(duration) {
  return durationSign(duration) < 0 ? negativeDuration(duration) : duration;
}

module.exports = {
  durationEquals,
  negativeDuration,
  durationEntries,
  durationToMs,
  durationSign,
  absoluteDuration,
};
