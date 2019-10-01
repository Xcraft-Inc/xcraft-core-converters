function getDisplayed(canonicalSemester, format) {
  if (!canonicalSemester || canonicalSemester === '') {
    return '';
  }
  if (typeof canonicalSemester === 'string') {
    let value = canonicalSemester.split('-');
    if (value.length === 2) {
      let year = value[0].substring(2, 4);
      let semester = parseInt(value[1]);
      return `${semester}-${year}`;
    }
    return '';
  }
}

//-----------------------------------------------------------------------------

module.exports = {
  getDisplayed,
};
