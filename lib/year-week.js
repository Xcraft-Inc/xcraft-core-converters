function getDisplayed(canonicalWeek, format) {
  if (!canonicalWeek || canonicalWeek === '') {
    return '';
  }
  if (typeof canonicalWeek === 'string') {
    let value = canonicalWeek.split('-');
    if (value.length === 2) {
      let year = value[0].substring(2, 4);
      let week = parseInt(value[1]);
      return `${week}-${year}`;
    }
    return '';
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
};
