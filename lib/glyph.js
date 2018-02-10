function getTable (category) {
  switch (category) {
    case 'transport':
      return [
        {glyph: 'solid/bicycle', text: 'bike'},
        {glyph: 'solid/cube', text: 'cargo'},
        {glyph: 'solid/car', text: 'car'},
        {glyph: 'solid/train', text: 'train'},
        {glyph: 'solid/truck', text: 'truck'},
      ];
    case 'desk':
      return [
        {glyph: 'solid/asterisk', text: 'asterisk'},
        {glyph: 'solid/ban', text: 'ban'},
        {glyph: 'solid/bell', text: 'bell'},
        {glyph: 'solid/binoculars', text: 'binoculars'},
        {glyph: 'solid/bullhorn', text: 'bullhorn'},
        {glyph: 'solid/check-square', text: 'check'},
        {glyph: 'solid/cog', text: 'cog'},
        {glyph: 'solid/eye', text: 'eye'},
        {glyph: 'solid/lock', text: 'lock'},
        {glyph: 'solid/minus-circle', text: 'minus'},
        {glyph: 'solid/plus-circle', text: 'plus'},
        {glyph: 'solid/share-alt', text: 'share'},
        {glyph: 'solid/star', text: 'star'},
        {glyph: 'solid/trash', text: 'trash'},
        {glyph: 'solid/exclamation-triangle', text: 'warning'},
      ];
    case 'place':
      return [
        {glyph: 'solid/map-marker-alt', text: ''},
        {glyph: 'solid/university', text: 'bank'},
        {glyph: 'solid/cube', text: 'box'},
        {glyph: 'solid/building', text: 'building'},
        {glyph: 'regular/hospital', text: 'hospital'},
        {glyph: 'solid/bed', text: 'hotel'},
        {glyph: 'solid/home', text: 'house'},
        {glyph: 'solid/envelope', text: 'mailbox'},
        {glyph: 'solid/tree', text: 'park'},
        {glyph: 'solid/train', text: 'railway-station'},
        {glyph: 'solid/subway', text: 'subway-station'},
        {glyph: 'solid/taxi', text: 'taxi-station'},
      ];
    case 'contact-mean':
      return [
        {glyph: 'solid/phone', text: 'phone'},
        {glyph: 'solid/at', text: 'email'},
        {glyph: 'brands/skype', text: 'skype'},
        {glyph: 'solid/fax', text: 'fax'},
      ];
    default:
      console.error (`Unknown category '${category}'`);
      return null;
  }
}

function getGlyph (category, text) {
  const a = getTable (category);
  for (const item of a) {
    if (item.text === text) {
      return item.glyph;
    }
  }
  return null;
}

//-----------------------------------------------------------------------------
exports.getTable = getTable;
exports.getGlyph = getGlyph;
