/**
 * showTitleScreen — displays the Pokémon-style title overlay.
 * Returns a Promise that resolves once the player dismisses it
 * (Enter / Space / Z / click), after the flash + fade-out sequence.
 */
export function showTitleScreen() {
  return new Promise(resolve => {
    const screen = document.getElementById('title-screen');
    if (!screen) { resolve(); return; }

    const flash = screen.querySelector('.ts-flash');
    let dismissed = false;

    function dismiss() {
      if (dismissed) return;
      dismissed = true;

      document.removeEventListener('keydown', onKey);
      screen.removeEventListener('click', dismiss);

      // White flash
      if (flash) flash.classList.add('active');

      setTimeout(() => {
        // Fade out the whole screen
        screen.classList.add('ts-exit');

        setTimeout(() => {
          screen.remove();
          resolve();
        }, 450);
      }, 110);
    }

    function onKey(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        dismiss();
      }
    }

    // Small delay before accepting input so rapid page load doesn't skip it
    setTimeout(() => {
      document.addEventListener('keydown', onKey);
      screen.addEventListener('click', dismiss);
    }, 900);
  });
}
