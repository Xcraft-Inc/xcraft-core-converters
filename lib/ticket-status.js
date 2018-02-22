// This map describes all the possible status, as well as their sequences.
const statusMap = new Map([
  [
    'pre-dispatched',
    {
      order: 1,
      text: 'Non dispatché',
      glyph: 'regular/square',
      prev: 'executed',
      next: 'dispatched',
    },
  ],
  [
    'dispatched',
    {
      order: 2,
      text: 'Dispatché',
      glyph: 'regular/check-square',
      prev: 'pre-dispatched',
      next: 'executed',
    },
  ],
  [
    'executed',
    {
      order: 3,
      text: 'Exécuté',
      glyph: 'solid/check-square',
      prev: 'dispatched',
      next: 'pre-dispatched',
    },
  ],
]);

//-----------------------------------------------------------------------------

function getStatusMenu(currentStatus) {
  const result = [];
  for (const item of statusMap) {
    const s = item[0];
    const m = item[1];
    result.push({
      status: s,
      text: m.text,
      glyph: m.glyph,
      active: currentStatus === s ? 'true' : 'false',
      shortcut: currentStatus === m.prev ? 'clic' : null,
    });
  }
  return result;
}

function getNextStatus(status) {
  const item = statusMap.get(status);
  return item ? item.next : null;
}

function getStatusOrder(status) {
  const item = statusMap.get(status);
  return item ? item.order : 0;
}

function getStatusDescription(status) {
  const item = statusMap.get(status);
  return item ? item.text : '?';
}

//-----------------------------------------------------------------------------
exports.getStatusMenu = getStatusMenu;
exports.getNextStatus = getNextStatus;
exports.getStatusOrder = getStatusOrder;
exports.getStatusDescription = getStatusDescription;
