function getDisplayed(canonicalQuarter, format) {
  if (!canonicalQuarter || canonicalQuarter === '') {
    return '';
  }
  if (typeof canonicalQuarter === 'string') {
    let value = canonicalQuarter.split('-');
    if (value.length === 2) {
      let year = value[0].substring(2, 4);
      let quarter = parseInt(value[1]);
      return `Q${quarter}-${year}`;
    }
    return '';
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
};
