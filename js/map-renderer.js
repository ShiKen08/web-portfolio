const TILE_STYLES = {
  0: { fill: '#3a3050', shade: '#2a2040' },  // wall
  1: { fill: '#e8dfc0', shade: '#d8cfa8' },  // floor
  2: { fill: '#c8a464', shade: '#a8843c' },  // counter
  3: { fill: '#4a7a9b', shade: '#2a5a7b' },  // PC terminal
  4: { fill: '#c0e8c8', shade: '#90c898' },  // door / entrance
  5: { fill: '#4a8a50', shade: '#2a6a30' },  // plant
  6: { fill: '#9a7040', shade: '#7a5020' },  // table
  7: { fill: '#e888a8', shade: '#b85878' },  // Nurse Joy (placeholder)
};

export function renderMap(canvas, mapData) {
  const ctx = canvas.getContext('2d');
  const { tiles, width, height, tileSize } = mapData;

  canvas.width = width * tileSize;
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
    case 0: drawWall(ctx, x, y, size, style); break;
    case 1: drawFloor(ctx, x, y, size, col, row); break;
    case 2: drawCounter(ctx, x, y, size, style); break;
    case 3: drawPC(ctx, x, y, size); break;
    case 4: drawDoor(ctx, x, y, size); break;
    case 5: drawPlant(ctx, x, y, size); break;
    case 6: drawTable(ctx, x, y, size, style); break;
    case 7: drawNurseJoyTile(ctx, x, y, size); break;
  }
}

function drawWall(ctx, x, y, size, style) {
  // Top-lit bevel
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(x, y, size, 3);
  ctx.fillRect(x, y, 3, size);
  ctx.fillStyle = style.shade;
  ctx.fillRect(x, y + size - 3, size, 3);
  ctx.fillRect(x + size - 3, y, 3, size);
}

function drawFloor(ctx, x, y, size, col, row) {
  // Subtle alternating tile shade
  if ((col + row) % 2 === 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.fillRect(x, y, size, size);
  }
  // Thin inner border to simulate tile grout
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
}

function drawCounter(ctx, x, y, size, style) {
  // Counter top surface highlight
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(x, y, size, size / 3);
  // Front edge shadow
  ctx.fillStyle = style.shade;
  ctx.fillRect(x, y + size - 5, size, 5);
}

function drawPC(ctx, x, y, size) {
  // Monitor body
  ctx.fillStyle = '#2a3a4a';
  ctx.fillRect(x + 4, y + 4, size - 8, size - 12);
  // Screen glow
  ctx.fillStyle = '#88ccff';
  ctx.fillRect(x + 6, y + 6, size - 12, size - 18);
  // Stand
  ctx.fillStyle = '#2a3a4a';
  ctx.fillRect(x + size / 2 - 4, y + size - 10, 8, 6);
}

function drawDoor(ctx, x, y, size) {
  // Door frame hints at the edges
  ctx.strokeStyle = '#88b890';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, size - 4, size - 4);
}

function drawPlant(ctx, x, y, size) {
  // Pot
  ctx.fillStyle = '#a05030';
  ctx.fillRect(x + size / 4, y + size * 0.6, size / 2, size * 0.35);
  // Leaves (two circles)
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
  // Table surface
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(x + 2, y + 2, size - 4, size * 0.4);
  // Leg hints
  ctx.fillStyle = style.shade;
  ctx.fillRect(x + 4, y + size - 6, 5, 6);
  ctx.fillRect(x + size - 9, y + size - 6, 5, 6);
}

function drawNurseJoyTile(ctx, x, y, size) {
  // Just a tinted cell — the actual NPC is a DOM sprite above the canvas
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(x, y, size, size);
}
