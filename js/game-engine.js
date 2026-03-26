import { renderMap }                    from './map-renderer.js';
import { loadCollision }               from './collision.js';
import { Player }                      from './player.js';
import { openDialogue, advanceDialogue } from './dialogue.js';
import { openPC }                        from './pc-overlay.js';
import { openTrainerCard }              from './trainer-card.js';

// ── State machine ──────────────────────────────────────────
export const State = {
  WALKING:      'walking',
  DIALOGUE:     'dialogue',
  PC:           'pc',
  TRAINER_CARD: 'trainer_card',
};

let currentState = State.WALKING;
let player = null;
let mapData = null;

// ── Input ──────────────────────────────────────────────────
const heldKeys = new Set();

const MOVE_MAP = {
  ArrowUp: 'up',   w: 'up',   W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
};

const INTERACT_KEYS = new Set(['z', 'Z', 'Enter', ' ']);
const SCROLL_KEYS   = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ']);

function onKeyDown(e) {
  heldKeys.add(e.key);
  if (SCROLL_KEYS.has(e.key)) e.preventDefault();

  if (INTERACT_KEYS.has(e.key)) {
    e.preventDefault();
    if (currentState === State.DIALOGUE) {
      advanceDialogue();
    } else if (currentState === State.WALKING) {
      const zone = player.tryInteract();
      if (zone) handleInteract(zone);
    }
  }
}

function onKeyUp(e) {
  heldKeys.delete(e.key);
}

// ── Nurse Joy dialogue script ──────────────────────────────
const NURSE_JOY_SCRIPT = [
  "Welcome to Kien's Portfolio Center!",
  "I'm Nurse Joy. Kien is a software engineer who\nloves building cool things.",
  "Explore the room, then head to the PC terminal\nin the corner to see his projects and experience.",
  "Enjoy your visit! ♪",
];

// ── Interaction dispatch ───────────────────────────────────
function handleInteract(zone) {
  if (zone.id === 'nurseJoy') {
    setState(State.DIALOGUE);
    openDialogue(NURSE_JOY_SCRIPT, () => setState(State.WALKING));
  } else if (zone.id === 'pc') {
    setState(State.PC);
    openPC(() => setState(State.WALKING));
  } else if (zone.id === 'trainerCard') {
    setState(State.TRAINER_CARD);
    openTrainerCard(() => setState(State.WALKING));
  }
}

export function setState(newState) {
  currentState = newState;
  if (newState === State.WALKING) heldKeys.clear();
}

// ── Game loop ──────────────────────────────────────────────
let lastMoveTime = 0;
const MOVE_INTERVAL = 150; // ms between tile steps when key held

function update(timestamp) {
  if (currentState !== State.WALKING) return;
  if (player.isMoving) return;
  if (timestamp - lastMoveTime < MOVE_INTERVAL) return;

  for (const [key, dir] of Object.entries(MOVE_MAP)) {
    if (heldKeys.has(key)) {
      player.tryMove(dir);
      lastMoveTime = timestamp;
      break;
    }
  }
}

function loop(timestamp) {
  update(timestamp);
  requestAnimationFrame(loop);
}

// ── Bootstrap ──────────────────────────────────────────────
export async function startGame() {
  const res = await fetch('js/data/map.json');
  mapData = await res.json();

  // Render tilemap to canvas
  const canvas = document.getElementById('map-canvas');
  renderMap(canvas, mapData);

  // Load collision data
  loadCollision(mapData);

  // Init player
  const playerEl = document.getElementById('player');
  player = new Player(
    playerEl,
    mapData.tileSize,
    mapData.playerStart.col,
    mapData.playerStart.row,
  );

  // Position Nurse Joy NPC sprite
  const nurseEl = document.getElementById('npc-nurse-joy');
  if (nurseEl) {
    nurseEl.style.left = `${9 * mapData.tileSize}px`;
    nurseEl.style.top  = `${2 * mapData.tileSize}px`;
  }

  // Input listeners
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup',   onKeyUp);

  // Start loop
  requestAnimationFrame(loop);
}
