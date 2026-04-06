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

      window.removeEventListener('keydown', onKey);
      screen.removeEventListener('click', dismiss);

      if (flash) flash.classList.add('active');

      setTimeout(() => {
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

    // Focus the overlay so it receives keyboard events immediately
    screen.setAttribute('tabindex', '-1');
    screen.focus();

    // Short delay only to prevent instant skip on fast page loads
    setTimeout(() => {
      window.addEventListener('keydown', onKey);
      screen.addEventListener('click', dismiss);
    }, 300);
  });
}
