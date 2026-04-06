const TILE_STYLES = {
  0:  { fill: '#3a3050', shade: '#2a2040' },  // wall (indoor)
  1:  { fill: '#e8dfc0', shade: '#d8cfa8' },  // floor
  2:  { fill: '#c8a464', shade: '#a8843c' },  // counter
  3:  { fill: '#4a7a9b', shade: '#2a5a7b' },  // PC terminal
  4:  { fill: '#c0e8c8', shade: '#90c898' },  // door/exit
  5:  { fill: '#4a8a50', shade: '#2a6a30' },  // plant (indoor)
  6:  { fill: '#9a7040', shade: '#7a5020' },  // table
  7:  { fill: '#e888a8', shade: '#b85878' },  // Nurse Joy placeholder
  // ── Outdoor tiles ─────────────────────────────────────────
  8:  { fill: '#5ac040', shade: '#3a9020' },  // grass
  9:  { fill: '#1e4a1e', shade: '#0e2a0e' },  // pine tree
  10: { fill: '#2870c8', shade: '#1050a8' },  // river/water
  11: { fill: '#b88840', shade: '#987020' },  // wooden bridge
  12: { fill: '#787878', shade: '#585858' },  // stone bank
  13: { fill: '#c83818', shade: '#981808' },  // house roof
  14: { fill: '#ecdcc4', shade: '#ccbca4' },  // house wall
  15: { fill: '#5ac040', shade: '#3a9020' },  // flower (grass base)
  16: { fill: '#5ac040', shade: '#3a9020' },  // corn (grass base)
  17: { fill: '#5ac040', shade: '#3a9020' },  // mailbox (grass base)
  18: { fill: '#c0a870', shade: '#a08850' },  // dirt path
  19: { fill: '#ecdcc4', shade: '#ccbca4' },  // house door (wall base)
};

export function renderMap(canvas, mapData) {
  const ctx = canvas.getContext('2d');
  const { tiles, width, height, tileSize } = mapData;

  canvas.width  = width  * tileSize;
  canvas.height = height * tileSize;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      drawTile(ctx, tiles[row][col], col * tileSize, row * tileSize, tileSize, col, row);
    }
  }
}

function drawTile(ctx, type, x, y, size, col, row) {
  const style = TILE_STYLES[type] ?? TILE_STYLES[0];

  ctx.fillStyle = style.fill;
  ctx.fillRect(x, y, size, size);

  switch (type) {
    case 0:  drawWall(ctx, x, y, size, style);         break;
    case 1:  drawFloor(ctx, x, y, size, col, row);     break;
    case 2:  drawCounter(ctx, x, y, size, style);      break;
    case 3:  drawPC(ctx, x, y, size);                  break;
    case 4:  drawDoor(ctx, x, y, size);                break;
    case 5:  drawPlant(ctx, x, y, size);               break;
    case 6:  drawTable(ctx, x, y, size, style);        break;
    case 7:  drawNurseJoyTile(ctx, x, y, size);        break;
    case 8:  drawGrass(ctx, x, y, size, col, row);     break;
    case 9:  drawTree(ctx, x, y, size);                break;
    case 10: drawWater(ctx, x, y, size, col, row);     break;
    case 11: drawBridge(ctx, x, y, size);              break;
    case 12: drawStoneBank(ctx, x, y, size, col, row); break;
    case 13: drawHouseRoof(ctx, x, y, size);           break;
    case 14: drawHouseWall(ctx, x, y, size);           break;
    case 15: drawFlower(ctx, x, y, size);              break;
    case 16: drawCorn(ctx, x, y, size);                break;
    case 17: drawMailbox(ctx, x, y, size);             break;
    case 18: drawPath(ctx, x, y, size, col, row);      break;
    case 19: drawHouseDoor(ctx, x, y, size);           break;
  }
}

// ── Indoor tiles ───────────────────────────────────────────────

function drawWall(ctx, x, y, size, style) {
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(x, y, size, 3);
  ctx.fillRect(x, y, 3, size);
  ctx.fillStyle = style.shade;
  ctx.fillRect(x, y + size - 3, size, 3);
  ctx.fillRect(x + size - 3, y, 3, size);
}

function drawFloor(ctx, x, y, size, col, row) {
  if ((col + row) % 2 === 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.fillRect(x, y, size, size);
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
}

function drawCounter(ctx, x, y, size, style) {
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(x, y, size, size / 3);
  ctx.fillStyle = style.shade;
  ctx.fillRect(x, y + size - 5, size, 5);
}

function drawPC(ctx, x, y, size) {
  ctx.fillStyle = '#2a3a4a';
  ctx.fillRect(x + 4, y + 4, size - 8, size - 12);
  ctx.fillStyle = '#88ccff';
  ctx.fillRect(x + 6, y + 6, size - 12, size - 18);
  ctx.fillStyle = '#2a3a4a';
  ctx.fillRect(x + size / 2 - 4, y + size - 10, 8, 6);
}

function drawDoor(ctx, x, y, size) {
  ctx.strokeStyle = '#88b890';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, size - 4, size - 4);
}

function drawPlant(ctx, x, y, size) {
  ctx.fillStyle = '#a05030';
  ctx.fillRect(x + size / 4, y + size * 0.6, size / 2, size * 0.35);
  ctx.fillStyle = '#2a7a30';
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size * 0.45, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a9a40';
  ctx.beginPath();
  ctx.arc(x + size * 0.38, y + size * 0.38, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawTable(ctx, x, y, size, style) {
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(x + 2, y + 2, size - 4, size * 0.4);
  ctx.fillStyle = style.shade;
  ctx.fillRect(x + 4, y + size - 6, 5, 6);
  ctx.fillRect(x + size - 9, y + size - 6, 5, 6);
}

function drawNurseJoyTile(ctx, x, y, size) {
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(x, y, size, size);
}

// ── Outdoor tiles ──────────────────────────────────────────────

function drawGrass(ctx, x, y, size, col, row) {
  if ((col * 3 + row * 5) % 7 === 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(x, y, size, size);
  }
  const bx = x + (col * 17 + row * 13) % (size - 4);
  const by = y + (col * 11 + row * 19) % (size - 6);
  ctx.fillStyle = 'rgba(0,0,0,0.09)';
  ctx.fillRect(bx, by, 1, 3);
  ctx.fillRect(bx + 5, by + 2, 1, 4);
}

function drawTree(ctx, x, y, size) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.arc(cx + 2, cy + 3, size * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2d6830';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a8040';
  ctx.beginPath();
  ctx.arc(cx - 1, cy - 1, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#52a850';
  ctx.beginPath();
  ctx.arc(cx - 4, cy - 4, size * 0.14, 0, Math.PI * 2);
  ctx.fill();
}

function drawWater(ctx, x, y, size, col, row) {
  const wy1 = y + ((col * 7  + row * 11) % (size - 10)) + 4;
  const wy2 = y + ((col * 13 + row * 5)  % (size - 10)) + 5;
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(x + 3, wy1, size * 0.45, 2);
  ctx.fillRect(x + size * 0.45, wy2, size * 0.4, 2);
  ctx.fillStyle = 'rgba(0,30,70,0.2)';
  ctx.fillRect(x, y, 2, size);
  ctx.fillRect(x + size - 2, y, 2, size);
}

function drawBridge(ctx, x, y, size) {
  ctx.fillStyle = '#c8a050';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(x + 4, y + i * 7 + 2, size - 8, 6);
  }
  ctx.fillStyle = '#7a5020';
  ctx.fillRect(x, y, 4, size);
  ctx.fillRect(x + size - 4, y, 4, size);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(x + 1, y, 1, size);
  ctx.fillRect(x + size - 2, y, 1, size);
}

function drawStoneBank(ctx, x, y, size, col, row) {
  const off = (col * 7 + row * 11) % 3;
  ctx.fillStyle = '#9898a0';
  ctx.fillRect(x + 2,  y + 3 + off, 9, 7);
  ctx.fillRect(x + 13, y + 4,       8, 6 + off);
  ctx.fillRect(x + 22, y + 5,       6, 6);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(x + 2,  y + 3 + off, 9, 2);
  ctx.fillRect(x + 13, y + 4,       8, 2);
  ctx.fillRect(x + 22, y + 5,       6, 2);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x + 2,  y + 3 + off + 5, 9, 2);
  ctx.fillRect(x + 13, y + 8,           8, 2);
}

function drawHouseRoof(ctx, x, y, size) {
  ctx.fillStyle = '#a02810';
  for (let i = 0; i <= size; i += 6) {
    ctx.fillRect(x + i, y, 3, size);
  }
  ctx.fillStyle = 'rgba(255,200,100,0.15)';
  ctx.fillRect(x, y, size, 5);
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(x, y + size - 4, size, 4);
}

function drawHouseWall(ctx, x, y, size) {
  const wx = x + Math.floor(size / 2) - 6;
  const wy = y + Math.floor(size / 2) - 6;
  ctx.fillStyle = '#8a6030';
  ctx.fillRect(wx - 2, wy - 2, 16, 16);
  ctx.fillStyle = '#a8dcf0';
  ctx.fillRect(wx, wy, 12, 12);
  ctx.fillStyle = '#8a6030';
  ctx.fillRect(wx + 5, wy, 2, 12);
  ctx.fillRect(wx, wy + 5, 12, 2);
  ctx.fillStyle = '#c0a060';
  ctx.fillRect(wx - 2, wy + 12, 16, 3);
}

function drawFlower(ctx, x, y, size) {
  const cx = x + Math.floor(size / 2);
  ctx.fillStyle = '#408030';
  ctx.fillRect(cx - 1, y + Math.floor(size * 0.52), 2, Math.floor(size * 0.48));
  ctx.fillStyle = '#58a840';
  ctx.fillRect(cx - 7, y + Math.floor(size * 0.62), 6, 2);
  ctx.fillRect(cx + 2,  y + Math.floor(size * 0.70), 6, 2);
  ctx.fillStyle = '#f8de20';
  ctx.beginPath();
  ctx.arc(cx, y + Math.floor(size * 0.36), 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e85020';
  ctx.beginPath();
  ctx.arc(cx, y + Math.floor(size * 0.36), 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawCorn(ctx, x, y, size) {
  ctx.fillStyle = '#70a838';
  ctx.fillRect(x + 6,  y + Math.floor(size * 0.35), 3, Math.floor(size * 0.65));
  ctx.fillRect(x + 18, y + Math.floor(size * 0.25), 3, Math.floor(size * 0.75));
  ctx.fillStyle = '#90c848';
  ctx.fillRect(x + 3,  y + Math.floor(size * 0.48), 9, 3);
  ctx.fillRect(x + 16, y + Math.floor(size * 0.38), 9, 3);
  ctx.fillRect(x + 8,  y + Math.floor(size * 0.62), 8, 3);
  ctx.fillStyle = '#f8c820';
  ctx.fillRect(x + 5,  y + Math.floor(size * 0.12), 5, 9);
  ctx.fillRect(x + 17, y + Math.floor(size * 0.05), 5, 9);
  ctx.fillStyle = '#e8a020';
  ctx.fillRect(x + 6,  y + Math.floor(size * 0.12), 1, 9);
  ctx.fillRect(x + 18, y + Math.floor(size * 0.05), 1, 9);
}

function drawMailbox(ctx, x, y, size) {
  const cx = x + Math.floor(size / 2);
  ctx.fillStyle = '#6a4820';
  ctx.fillRect(cx - 2, y + Math.floor(size * 0.46), 4, Math.floor(size * 0.54));
  ctx.fillStyle = '#d03020';
  ctx.fillRect(cx - 10, y + Math.floor(size * 0.16), 20, 14);
  ctx.fillStyle = '#b02010';
  ctx.fillRect(cx - 10, y + Math.floor(size * 0.16), 20, 3);
  ctx.fillStyle = '#801008';
  ctx.fillRect(cx - 8, y + Math.floor(size * 0.27), 13, 2);
  ctx.fillStyle = '#d03020';
  ctx.fillRect(cx + 9, y + Math.floor(size * 0.08), 3, 9);
  ctx.fillRect(cx + 9, y + Math.floor(size * 0.08), 7, 4);
}

function drawPath(ctx, x, y, size, col, row) {
  if ((col + row) % 2 === 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(x, y, size, size);
  }
  const px = x + (col * 13 + row * 7)  % (size - 5);
  const py = y + (col * 7  + row * 17) % (size - 4);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(px, py, 2, 2);
  ctx.fillRect(px + 9, py + 3, 3, 2);
}

function drawHouseDoor(ctx, x, y, size) {
  ctx.fillStyle = '#8a6030';
  ctx.fillRect(x + 4, y + 4, size - 8, size - 4);
  ctx.fillStyle = '#1a0e06';
  ctx.fillRect(x + 6, y + 6, size - 12, size - 6);
  ctx.fillStyle = '#d4a030';
  ctx.beginPath();
  ctx.arc(x + size - 11, y + Math.floor(size * 0.55), 2.5, 0, Math.PI * 2);
  ctx.fill();
}
