let mapData = null;

export function loadCollision(data) {
  mapData = data;
}

export function canMoveTo(col, row) {
  if (!mapData) return false;
  if (col < 0 || col >= mapData.width) return false;
  if (row < 0 || row >= mapData.height) return false;
  return mapData.walkable.includes(mapData.tiles[row][col]);
}

export function getInteraction(col, row, facing) {
  if (!mapData) return null;

  for (const zone of mapData.interactionZones) {
    if (zone.facing !== facing) continue;

    if (zone.triggerCol !== undefined) {
      // Single-column zone
      if (row === zone.triggerRow && col === zone.triggerCol) return zone;
    } else if (zone.triggerColMin !== undefined) {
      // Range zone
      if (
        row === zone.triggerRow &&
        col >= zone.triggerColMin &&
        col <= zone.triggerColMax &&
        !(zone.excludeCols?.includes(col))
      ) {
        return zone;
      }
    }
  }

  return null;
}
