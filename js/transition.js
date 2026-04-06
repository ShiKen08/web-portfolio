// Scene flash transition
// flashTransition(callback) — white flash in, run callback, flash out

const IN_DUR  = 90;   // ms to reach full white
const HOLD    = 70;   // ms at full white
const OUT_DUR = 250;  // ms to fade out

export function flashTransition(callback) {
  const flash = document.getElementById('scene-flash');
  if (!flash) { callback?.(); return; }

  flash.classList.remove('flash-out');
  flash.classList.add('flash-in');

  setTimeout(() => {
    callback?.();
    setTimeout(() => {
      flash.classList.remove('flash-in');
      flash.classList.add('flash-out');
      setTimeout(() => flash.classList.remove('flash-out'), OUT_DUR);
    }, HOLD);
  }, IN_DUR);
}
