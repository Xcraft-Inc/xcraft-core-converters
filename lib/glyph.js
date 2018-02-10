const maps = {
  transport: new Map ([
    ['bike', 'solid/bicycle'],
    ['cargo', 'solid/cube'],
    ['car', 'solid/car'],
    ['train', 'solid/train'],
    ['truck', 'solid/truck'],
  ]),
  desk: new Map ([
    ['asterisk', 'solid/asterisk'],
    ['ban', 'solid/ban'],
    ['bell', 'solid/bell'],
    ['binoculars', 'solid/binoculars'],
    ['bullhorn', 'solid/bullhorn'],
    ['check', 'solid/check-square'],
    ['cog', 'solid/cog'],
    ['eye', 'solid/eye'],
    ['lock', 'solid/lock'],
    ['minus', 'solid/minus-circle'],
    ['plus', 'solid/plus-circle'],
    ['share', 'solid/share-alt'],
    ['star', 'solid/star'],
    ['trash', 'solid/trash'],
    ['warning', 'solid/exclamation-triangle'],
  ]),
  place: new Map ([
    ['', 'solid/map-marker-alt'],
    ['bank', 'solid/university'],
    ['box', 'solid/cube'],
    ['building', 'solid/building'],
    ['hospital', 'regular/hospital'],
    ['hotel', 'solid/bed'],
    ['house', 'solid/home'],
    ['mailbox', 'solid/envelope'],
    ['park', 'solid/tree'],
    ['railway-station', 'solid/train'],
    ['subway-station', 'solid/subway'],
    ['taxi-station', 'solid/taxi'],
  ]),
  ['contact-mean']: new Map ([
    ['phone', 'solid/phone'],
    ['email', 'solid/at'],
    ['skype', 'brands/skype'],
    ['fax', 'solid/fax'],
  ]),
};

function getTable (category) {
  const table = [];
  const m = maps[category];
  if (m) {
    for (const item of m) {
      table.push ({glyph: item[1], text: item[0]});
    }
  } else {
    console.error (`Unknown glyph category '${category}'`);
  }
  return table;
}

function getGlyph (category, text) {
  const m = maps[category];
  if (m) {
    return m.get (text);
  } else {
    console.error (`Unknown glyph category '${category}'`);
    return 'solid/exclamation-circle';
  }
}

//-----------------------------------------------------------------------------
exports.getTable = getTable;
exports.getGlyph = getGlyph;
