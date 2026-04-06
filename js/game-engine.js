import { renderMap }                      from './map-renderer.js';
import { loadCollision }                 from './collision.js';
import { Player }                        from './player.js';
import { openDialogue, advanceDialogue } from './dialogue.js';
import { openPC }                        from './pc-overlay.js';
import { openTrainerCard }               from './trainer-card.js';
import { showTitleScreen }              from './title-screen.js';
import { initSprites }                   from './sprites.js';
import { flashTransition }              from './transition.js';
import { startMusic, toggleMute }       from './music.js';
import { loadRoom, getCurrentRoom, getExitDestination } from './room-manager.js';

// ── State machine ──────────────────────────────────────────
export const State = {
  WALKING:      'walking',
  DIALOGUE:     'dialogue',
  PC:           'pc',
  TRAINER_CARD: 'trainer_card',
  TRANSITION:   'transition',
};

let currentState = State.WALKING;
let player  = null;
let mapData = null;

// ── Viewport scaling ───────────────────────────────────────
function fitViewport() {
  const scale = Math.min(
    window.innerWidth  / 640,
    window.innerHeight / 480
  );
  document.documentElement.style.setProperty('--viewport-scale', scale);
}
window.addEventListener('resize', fitViewport);

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

// ── Door / exit detection ──────────────────────────────────
function checkExits() {
  if (!mapData) return;

  // Check tile-based exits (door tiles at map boundary)
  const tile = mapData.tiles[player.tileY]?.[player.tileX];
  if (tile !== 4) return;  // not a door tile

  // Only trigger if player is at a boundary row/col
  const atBottom = player.tileY >= mapData.height - 1;
  const atTop    = player.tileY <= 0;

  if (!atBottom && !atTop) return;

  // Check explicit exits in mapData if present
  if (mapData.exits) {
    for (const exit of mapData.exits) {
      const inCol = player.tileX >= exit.colMin && player.tileX <= exit.colMax;
      const inRow = player.tileY === exit.row;
      if (inCol && inRow) {
        triggerRoomTransition(exit.to, exit.spawnCol, exit.spawnRow);
        return;
      }
    }
  } else {
    // Fallback: auto-route via room manager
    const dest = getExitDestination(getCurrentRoom());
    triggerRoomTransition(dest, 9, atBottom ? 2 : 12);
  }
}

async function triggerRoomTransition(destRoom, spawnCol, spawnRow) {
  setState(State.TRANSITION);
  heldKeys.clear();

  flashTransition(async () => {
    mapData = await loadRoom(destRoom);
    player.warpTo(spawnCol, spawnRow);
    setState(State.WALKING);
  });
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
      const moved = player.tryMove(dir);
      lastMoveTime = timestamp;
      if (moved) checkExits();
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
  fitViewport();

  await showTitleScreen();

  // Start music right after user interaction (title screen dismiss)
  startMusic();

  // Load room 1
  mapData = await loadRoom('room1');

  // Init pixel sprites
  initSprites();

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

  // Mute button
  const muteBtn = document.getElementById('mute-btn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const isMuted = toggleMute();
      muteBtn.textContent = isMuted ? '🔇' : '♪';
    });
  }

  // Input listeners
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup',   onKeyUp);

  // Start loop
  requestAnimationFrame(loop);
}
