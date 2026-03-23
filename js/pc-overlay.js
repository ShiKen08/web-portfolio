// ── PC Overlay (Phase 3) ───────────────────────────────────
// Pokémon storage-box style project showcase.
// Opens when the player interacts with the PC terminal.

const overlay = document.getElementById('pc-overlay');

// ── Project data ───────────────────────────────────────────
// null = empty slot. Fill in real projects as you build them.
const PROJECTS = [
  {
    id:     '001',
    name:   'WEB PORTFOLIO',
    level:  1,
    color:  '#d9d1f6',
    langs:  ['HTML', 'CSS', 'JS'],
    desc:   'Pokémon-themed portfolio with a tile-based game engine, NPC dialogue, and this project showcase.',
    github: null, // add URL when ready
  },
  null, null, null, null,
  null, null, null, null, null,
  null, null, null, null, null,
];

const COLS  = 5;
const ROWS  = 3;
const TOTAL = COLS * ROWS; // 15 slots

let selectedSlot = 0;
let onCloseCb    = null;

// ── Helpers ────────────────────────────────────────────────

function projectAt(i) {
  return i < PROJECTS.length ? PROJECTS[i] : null;
}

// ── UI construction ────────────────────────────────────────

function buildUI() {
  overlay.innerHTML = `
    <div class="pco-window">
      <div class="pco-header">
        <div class="pco-box-nav">
          <button class="pco-arrow" id="pco-prev">◄</button>
          <span class="pco-box-title">BOX 1</span>
          <button class="pco-arrow" id="pco-next">►</button>
        </div>
        <button class="pco-close-btn" id="pco-close">✕ CLOSE</button>
      </div>

      <div class="pco-body">
        <div class="pco-grid-panel">
          <div class="pco-slot-grid" id="pco-grid"></div>
        </div>
        <div class="pco-card-panel" id="pco-card"></div>
      </div>

      <div class="pco-footer">
        <span>ARROWS — Navigate</span>
        <span>Z / ENTER — Open</span>
        <span>ESC — Close</span>
      </div>
    </div>
  `;

  document.getElementById('pco-close').addEventListener('click', closePC);
  // Arrow buttons reserved for future multi-box navigation
}

function renderGrid() {
  const grid = document.getElementById('pco-grid');
  grid.innerHTML = '';

  for (let i = 0; i < TOTAL; i++) {
    const proj = projectAt(i);
    const slot = document.createElement('div');
    slot.className = 'pco-slot' + (i === selectedSlot ? ' pco-slot--selected' : '');
    if (proj) {
      slot.style.background = proj.color;
      slot.innerHTML = `<span class="pco-slot-id">#${proj.id}</span>`;
    }
    const idx = i;
    slot.addEventListener('click', () => { selectedSlot = idx; refresh(); });
    grid.appendChild(slot);
  }
}

function renderCard() {
  const panel = document.getElementById('pco-card');
  const proj  = projectAt(selectedSlot);

  if (!proj) {
    panel.innerHTML = `
      <div class="pco-card pco-card--empty">
        <p class="pco-empty-label">— EMPTY SLOT —</p>
        <p class="pco-empty-hint">More projects coming soon!</p>
      </div>`;
    return;
  }

  const githubBtn = proj.github
    ? `<a class="pco-github-btn" href="${proj.github}" target="_blank" rel="noopener">► GITHUB</a>`
    : `<span class="pco-github-btn pco-github-btn--disabled">► GITHUB (coming soon)</span>`;

  const chips = proj.langs
    .map(l => `<span class="pco-chip">${l}</span>`)
    .join('');

  panel.innerHTML = `
    <div class="pco-card">
      <div class="pco-card-header">
        <span class="pco-card-name">${proj.name}</span>
        <span class="pco-card-id">#${proj.id}</span>
      </div>
      <div class="pco-card-sprite" style="background:${proj.color}">
        <span class="pco-sprite-placeholder">★</span>
      </div>
      <div class="pco-card-lv">LV.&nbsp;${proj.level}</div>
      <div class="pco-card-langs">${chips}</div>
      <div class="pco-card-desc">${proj.desc}</div>
      ${githubBtn}
    </div>`;
}

function refresh() {
  renderGrid();
  renderCard();
}

// ── Keyboard handler ───────────────────────────────────────

function onKeyDown(e) {
  switch (e.key) {
    case 'ArrowUp':    case 'w': case 'W':
      e.preventDefault();
      if (selectedSlot - COLS >= 0) { selectedSlot -= COLS; refresh(); }
      break;
    case 'ArrowDown':  case 's': case 'S':
      e.preventDefault();
      if (selectedSlot + COLS < TOTAL) { selectedSlot += COLS; refresh(); }
      break;
    case 'ArrowLeft':  case 'a': case 'A':
      e.preventDefault();
      if (selectedSlot % COLS !== 0) { selectedSlot--; refresh(); }
      break;
    case 'ArrowRight': case 'd': case 'D':
      e.preventDefault();
      if (selectedSlot % COLS !== COLS - 1 && selectedSlot < TOTAL - 1) { selectedSlot++; refresh(); }
      break;
    case 'z': case 'Z': case 'Enter': {
      e.preventDefault();
      const proj = projectAt(selectedSlot);
      if (proj?.github) window.open(proj.github, '_blank', 'noopener');
      break;
    }
    case 'Escape': case 'x': case 'X':
      e.preventDefault();
      closePC();
      break;
  }
}

// ── Open / Close ───────────────────────────────────────────

function closePC() {
  overlay.classList.add('hidden');
  document.removeEventListener('keydown', onKeyDown);
  onCloseCb?.();
  onCloseCb = null;
}

export function openPC(onClose) {
  onCloseCb    = onClose;
  selectedSlot = 0;
  buildUI();
  refresh();
  overlay.classList.remove('hidden');
  document.addEventListener('keydown', onKeyDown);
}
