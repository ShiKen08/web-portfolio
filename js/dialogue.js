// ── Dialogue system ────────────────────────────────────────
// Manages the Pokémon-style typewriter dialogue box.
// No imports from game-engine to avoid circular deps —
// state changes are handled via callbacks.

const box     = document.getElementById('dialogue-box');
const textEl  = document.getElementById('dialogue-text');
const arrowEl = document.querySelector('.dialogue-continue');

const CHAR_DELAY = 30; // ms per character

let script    = [];
let pageIndex = 0;
let charIndex = 0;
let typingTimer = null;
let pageComplete = false;
let onCloseCb = null;

// ── Internal ───────────────────────────────────────────────

function showPage() {
  pageComplete = false;
  charIndex    = 0;
  textEl.textContent = '';
  arrowEl.style.visibility = 'hidden';
  typeNextChar();
}

function typeNextChar() {
  const line = script[pageIndex];
  if (charIndex >= line.length) {
    pageComplete = true;
    arrowEl.style.visibility = 'visible';
    return;
  }
  textEl.textContent += line[charIndex++];
  typingTimer = setTimeout(typeNextChar, CHAR_DELAY);
}

function skipToEnd() {
  clearTimeout(typingTimer);
  textEl.textContent = script[pageIndex];
  pageComplete = true;
  arrowEl.style.visibility = 'visible';
}

function closeBox() {
  clearTimeout(typingTimer);
  script = [];
  box.classList.add('hidden');
  onCloseCb?.();
  onCloseCb = null;
}

// ── Public API ─────────────────────────────────────────────

/**
 * Open the dialogue box with a script (array of strings, one per page).
 * @param {string[]} lines
 * @param {() => void} onClose  Called when the last page is dismissed.
 */
export function openDialogue(lines, onClose) {
  script    = lines;
  pageIndex = 0;
  onCloseCb = onClose;
  box.classList.remove('hidden');
  showPage();
}

/**
 * Advance the dialogue — call this on Z / Enter press.
 * - If still typing → skip to end of current page
 * - If page complete and more pages → go to next page
 * - If on last page → close
 */
export function advanceDialogue() {
  if (!script.length) return;
  if (!pageComplete) {
    skipToEnd();
    return;
  }
  pageIndex++;
  if (pageIndex >= script.length) {
    closeBox();
  } else {
    showPage();
  }
}
