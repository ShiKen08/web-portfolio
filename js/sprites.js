// Pixel-art sprite generator
// Draws 28×28 sprites onto offscreen canvases, returns data URLs
// Applied as background-image on .player and .npc elements

// ── Palette ────────────────────────────────────────────────
const PC = {
  hat:   '#c03030', hatD:  '#901a1a',
  hair:  '#2a1a08',
  skin:  '#f5b590',
  eye:   '#1a1010',
  shirt: '#2050c0', shirtD: '#1030a0',
  pants: '#0f1f80',
  shoe:  '#1a1010',
};

const NJC = {
  hair:  '#ff88cc',
  band:  '#f8f8f8',
  cross: '#cc2233',
  skin:  '#f5b590',
  eye:   '#1a1010',
  shirt: '#f0f0f0',
  skirt: '#dce4f0',
  shoe:  '#404040',
};

// ── Canvas helper ──────────────────────────────────────────
function make28() {
  const c = document.createElement('canvas');
  c.width = 28; c.height = 28;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

// Short alias: fill rect
function r(ctx, col, x, y, w, h) {
  if (!col) return;
  ctx.fillStyle = col;
  ctx.fillRect(x, y, w, h);
}

// ── Player sprites ─────────────────────────────────────────

function playerDown() {
  const ctx = make28();
  r(ctx, PC.hat,    6,  0, 16,  4);  // hat top
  r(ctx, PC.hatD,   4,  4, 20,  3);  // hat brim
  r(ctx, PC.hair,   4,  7,  4,  6);  // left hair
  r(ctx, PC.hair,  20,  7,  4,  6);  // right hair
  r(ctx, PC.skin,   8,  7, 12,  9);  // face
  r(ctx, PC.eye,   10, 11,  3,  3);  // left eye
  r(ctx, PC.eye,   15, 11,  3,  3);  // right eye
  r(ctx, PC.shirt,  3, 16, 22,  6);  // shirt
  r(ctx, PC.skin,  11, 16,  6,  2);  // neck
  r(ctx, PC.pants,  3, 22,  9,  4);  // left leg
  r(ctx, PC.pants, 16, 22,  9,  4);  // right leg
  r(ctx, PC.shoe,   3, 26,  9,  2);  // left shoe
  r(ctx, PC.shoe,  16, 26,  9,  2);  // right shoe
  return ctx.canvas.toDataURL();
}

function playerUp() {
  const ctx = make28();
  r(ctx, PC.hat,    6,  0, 16,  4);
  r(ctx, PC.hatD,   4,  4, 20,  3);
  r(ctx, PC.hair,   4,  7, 20,  9);  // full back of head
  r(ctx, PC.shirt,  3, 16, 22,  6);
  r(ctx, PC.pants,  3, 22,  9,  4);
  r(ctx, PC.pants, 16, 22,  9,  4);
  r(ctx, PC.shoe,   3, 26,  9,  2);
  r(ctx, PC.shoe,  16, 26,  9,  2);
  return ctx.canvas.toDataURL();
}

function playerLeft() {
  const ctx = make28();
  r(ctx, PC.hat,    4,  0, 14,  4);   // narrower hat profile
  r(ctx, PC.hatD,   3,  4, 15,  3);
  r(ctx, PC.hair,   4,  7,  3,  6);   // left side hair tuft
  r(ctx, PC.skin,   7,  7, 10,  9);   // side face
  r(ctx, PC.eye,    9, 11,  3,  3);   // near eye
  r(ctx, PC.shirt,  4, 16, 18,  6);
  r(ctx, PC.shirtD, 3, 16,  2,  6);   // arm
  r(ctx, PC.pants,  4, 22, 16,  4);   // both legs visible as one from side
  r(ctx, PC.shoe,   4, 26, 18,  2);
  return ctx.canvas.toDataURL();
}

function playerRight() {
  const ctx = make28();
  r(ctx, PC.hat,   10,  0, 14,  4);
  r(ctx, PC.hatD,  10,  4, 15,  3);
  r(ctx, PC.hair,  21,  7,  3,  6);   // right side hair tuft
  r(ctx, PC.skin,  11,  7, 10,  9);   // side face (mirrored)
  r(ctx, PC.eye,   16, 11,  3,  3);   // near eye
  r(ctx, PC.shirt,  6, 16, 18,  6);
  r(ctx, PC.shirtD,23, 16,  2,  6);   // arm
  r(ctx, PC.pants,  8, 22, 16,  4);
  r(ctx, PC.shoe,   6, 26, 18,  2);
  return ctx.canvas.toDataURL();
}

// ── Nurse Joy sprites ──────────────────────────────────────

function nurseDown() {
  const ctx = make28();
  // Nurse band/hat (white cap)
  r(ctx, NJC.band,   5,  0, 18,  5);
  // Red cross on cap
  r(ctx, NJC.cross, 12,  1,  4,  3);  // vertical
  r(ctx, NJC.cross, 11,  2,  6,  1);  // horizontal
  // Pink hair sides
  r(ctx, NJC.hair,   4,  5,  4,  8);
  r(ctx, NJC.hair,  20,  5,  4,  8);
  // Face
  r(ctx, NJC.skin,   8,  5, 12,  8);
  // Eyes
  r(ctx, NJC.eye,   10, 10,  3,  2);
  r(ctx, NJC.eye,   15, 10,  3,  2);
  // Blush
  r(ctx, '#f0a8a8',  9, 12,  3,  1);
  r(ctx, '#f0a8a8', 16, 12,  3,  1);
  // White uniform
  r(ctx, NJC.shirt,  3, 16, 22,  6);
  r(ctx, NJC.skin,  11, 16,  6,  2);  // neck
  // Skirt
  r(ctx, NJC.skirt,  3, 22, 22,  4);
  // Shoes
  r(ctx, NJC.shoe,   3, 26, 10,  2);
  r(ctx, NJC.shoe,  15, 26, 10,  2);
  return ctx.canvas.toDataURL();
}

function nurseUp() {
  const ctx = make28();
  r(ctx, NJC.band,   5,  0, 18,  5);
  r(ctx, NJC.hair,   4,  5, 20, 11);  // full back with pink hair
  r(ctx, NJC.shirt,  3, 16, 22,  6);
  r(ctx, NJC.skirt,  3, 22, 22,  4);
  r(ctx, NJC.shoe,   3, 26, 10,  2);
  r(ctx, NJC.shoe,  15, 26, 10,  2);
  return ctx.canvas.toDataURL();
}

// ── Public API ─────────────────────────────────────────────

const cache = {};

function get(key, fn) {
  if (!cache[key]) cache[key] = fn();
  return cache[key];
}

export const sprites = {
  player: {
    down:  () => get('pd', playerDown),
    up:    () => get('pu', playerUp),
    left:  () => get('pr', playerRight),  // mirrored in CSS via scaleX(-1)
    right: () => get('pr', playerRight),
  },
  nurseJoy: {
    down: () => get('nd', nurseDown),
    up:   () => get('nu', nurseUp),
  },
};

/**
 * Apply the correct sprite to an element and add 'has-sprite' class.
 * @param {HTMLElement} el
 * @param {string} dataUrl
 */
export function applySprite(el, dataUrl) {
  el.style.backgroundImage = `url(${dataUrl})`;
  el.style.backgroundSize  = 'cover';
  el.textContent = '';
  el.classList.add('has-sprite');
}

/**
 * Initialise sprites on the player and NPC elements.
 */
export function initSprites() {
  const playerEl = document.getElementById('player');
  if (playerEl) applySprite(playerEl, sprites.player.down());

  const nurseEl = document.getElementById('npc-nurse-joy');
  if (nurseEl) applySprite(nurseEl, sprites.nurseJoy.down());
}
