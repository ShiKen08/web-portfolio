// 8-bit chiptune — Pokémon Center-style looping melody
// Uses Web Audio API (square + triangle oscillators)

let audioCtx   = null;
let masterGain = null;
let muted      = false;

const TEMPO = 0.22; // seconds per beat

// Melody (square wave) — Pokémon Center-inspired
const MELODY = [
  [392.0, 1], [440.0, 1], [493.9, 1], [523.3, 2], [null, 1],
  [440.0, 1], [493.9, 1], [523.3, 1], [587.3, 2], [null, 1],
  [523.3, 1], [493.9, 1], [440.0, 1], [392.0, 4],
  [null,  2],
];

// Bass line (triangle wave, same total beats = 22)
const BASS = [
  [196.0, 4], [220.0, 4], [261.6, 4],
  [293.7, 4], [261.6, 4], [196.0, 2],
];

function scheduleNote(freq, startTime, beats, type, vol) {
  if (!freq || !audioCtx) return;
  const dur     = beats * TEMPO;
  const osc     = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  gainNode.gain.setValueAtTime(0.001, startTime);
  gainNode.gain.linearRampToValueAtTime(vol, startTime + 0.015);
  gainNode.gain.setValueAtTime(vol, startTime + dur - 0.04);
  gainNode.gain.linearRampToValueAtTime(0.001, startTime + dur);

  osc.connect(gainNode);
  gainNode.connect(masterGain);
  osc.start(startTime);
  osc.stop(startTime + dur + 0.05);
}

function scheduleSequence(notes, startTime, type, gain) {
  let t = startTime;
  for (const [freq, beats] of notes) {
    scheduleNote(freq, t, beats, type, gain);
    t += beats * TEMPO;
  }
  return t;
}

function loop(startTime) {
  scheduleSequence(MELODY, startTime, 'square',   0.055);
  scheduleSequence(BASS,   startTime, 'triangle', 0.04);

  const loopDur = 22 * TEMPO; // 22 beats total
  const nextStart = startTime + loopDur;

  // Re-schedule 1 s before the loop ends to avoid gaps
  const delayMs = Math.max(0, (nextStart - audioCtx.currentTime - 1) * 1000);
  setTimeout(() => loop(nextStart), delayMs);
}

export function startMusic() {
  if (audioCtx) return;
  audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.85;
  masterGain.connect(audioCtx.destination);

  loop(audioCtx.currentTime + 0.4);
}

export function toggleMute() {
  if (!audioCtx) return false;
  muted = !muted;
  masterGain.gain.setTargetAtTime(muted ? 0 : 0.85, audioCtx.currentTime, 0.1);
  return muted;
}
