/**
 * @typedef {object} Duration
 * @property {number | null} [Duration.weeks]
 * @property {number | null} [Duration.days]
 * @property {number | null} [Duration.hours]
 * @property {number | null} [Duration.minutes]
 * @property {number | null} [Duration.seconds]
 */

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

module.exports = {
  negativeDuration,
};
