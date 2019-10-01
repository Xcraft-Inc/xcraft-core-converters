function getDisplayed(canonicalMonth, format) {
  if (!canonicalMonth || canonicalMonth === '') {
    return '';
  }
  if (typeof canonicalMonth === 'string') {
    let value = canonicalMonth.split('-');
    if (value.length === 2) {
      let year = value[0].substring(2, 4);
      let month = parseInt(value[1]);
      return `${month}-${year}`;
    }
    return '';
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
};
