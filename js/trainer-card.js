// ── Trainer Card (Phase 4) ─────────────────────────────────
// Pokémon-style Trainer Card — the "About Me" section.
// Triggered by interacting with the table (facing down, row 7).

const overlay = document.getElementById('trainer-card-overlay');

// ── Trainer data ───────────────────────────────────────────
// Edit this object with your real info.
const TRAINER = {
  name:     'Kien Le',
  id:       '000001',
  role:     'Software Engineer',
  location: 'Hanoi, VN',
  time:     '3+ years',
  bio:      'Passionate software engineer who loves building\ninteractive experiences. Currently leveling up\nevery single day.',
  badges: [
    { label: 'JavaScript', color: '#f7e03c', text: '#2b2b2b' },
    { label: 'Python',     color: '#c984f8', text: '#fff'    },
    { label: 'HTML',       color: '#f4793b', text: '#fff'    },
    { label: 'CSS',        color: '#3b9af4', text: '#fff'    },
    { label: 'Node.js',    color: '#5abf5a', text: '#fff'    },
    { label: 'Git',        color: '#4a4a6a', text: '#fff'    },
  ],
  links: [
    { label: '► GITHUB',   href: null }, // replace null with your URL
    { label: '► LINKEDIN', href: null },
    { label: '► EMAIL',    href: null }, // use 'mailto:you@example.com'
  ],
};

// ── Build UI ───────────────────────────────────────────────

function buildUI() {
  const badges = TRAINER.badges
    .map(b => `<span class="tc-badge" style="background:${b.color};color:${b.text}">${b.label}</span>`)
    .join('');

  const links = TRAINER.links
    .map(l => l.href
      ? `<a  class="tc-link-btn" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`
      : `<span class="tc-link-btn tc-link-btn--disabled">${l.label}</span>`)
    .join('');

  const bioLines = TRAINER.bio.replace(/\n/g, '<br>');

  overlay.innerHTML = `
    <div class="tc-window">

      <div class="tc-header">
        <span class="tc-title">TRAINER CARD</span>
        <button class="tc-close-btn" id="tc-close">✕ CLOSE</button>
      </div>

      <div class="tc-body">

        <div class="tc-portrait-col">
          <div class="tc-portrait">
            <span class="tc-portrait-star">★</span>
            <span class="tc-portrait-label">TRAINER</span>
          </div>
          <div class="tc-bio-box">${bioLines}</div>
        </div>

        <div class="tc-info-col">
          <div class="tc-info-rows">
            <div class="tc-row">
              <span class="tc-label">NAME</span>
              <span class="tc-value">${TRAINER.name}</span>
            </div>
            <div class="tc-row">
              <span class="tc-label">ID No.</span>
              <span class="tc-value">${TRAINER.id}</span>
            </div>
            <div class="tc-row">
              <span class="tc-label">ROLE</span>
              <span class="tc-value">${TRAINER.role}</span>
            </div>
            <div class="tc-row">
              <span class="tc-label">FROM</span>
              <span class="tc-value">${TRAINER.location}</span>
            </div>
            <div class="tc-row">
              <span class="tc-label">EXP</span>
              <span class="tc-value">${TRAINER.time}</span>
            </div>
          </div>

          <div class="tc-badges-section">
            <p class="tc-badges-title">◈ TECH BADGES</p>
            <div class="tc-badges-grid">${badges}</div>
          </div>
        </div>

      </div>

      <div class="tc-footer">${links}</div>

    </div>
  `;

  document.getElementById('tc-close').addEventListener('click', closeCard);
}

// ── Keyboard handler ───────────────────────────────────────

function onKeyDown(e) {
  if (e.key === 'Escape' || e.key === 'x' || e.key === 'X') {
    e.preventDefault();
    closeCard();
  }
}

// ── Open / Close ───────────────────────────────────────────

let onCloseCb = null;

function closeCard() {
  overlay.classList.add('hidden');
  document.removeEventListener('keydown', onKeyDown);
  onCloseCb?.();
  onCloseCb = null;
}

export function openTrainerCard(onClose) {
  onCloseCb = onClose;
  buildUI();
  overlay.classList.remove('hidden');
  document.addEventListener('keydown', onKeyDown);
}
