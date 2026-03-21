import { canMoveTo, getInteraction } from './collision.js';

const MOVE_DURATION = 150; // ms — time to slide one tile

const DIR_DELTA = {
  up:    { col:  0, row: -1 },
  down:  { col:  0, row:  1 },
  left:  { col: -1, row:  0 },
  right: { col:  1, row:  0 },
};

export class Player {
  constructor(element, tileSize, startCol, startRow) {
    this.el = tileSize && element ? element : element;
    this.tileSize = tileSize;
    this.tileX = startCol;
    this.tileY = startRow;
    this.facing = 'down';
    this.isMoving = false;

    // Snap to start without transition
    this._setPosition(true);
  }

  tryMove(direction) {
    if (this.isMoving) return false;

    this.facing = direction;
    this.el.dataset.facing = direction;

    const { col: dc, row: dr } = DIR_DELTA[direction];
    const newX = this.tileX + dc;
    const newY = this.tileY + dr;

    if (!canMoveTo(newX, newY)) {
      // Face direction but stay put
      return false;
    }

    this.tileX = newX;
    this.tileY = newY;
    this.isMoving = true;
    this._setPosition(false);

    setTimeout(() => { this.isMoving = false; }, MOVE_DURATION);
    return true;
  }

  tryInteract() {
    return getInteraction(this.tileX, this.tileY, this.facing);
  }

  _setPosition(instant) {
    const x = this.tileX * this.tileSize;
    const y = this.tileY * this.tileSize;

    if (instant) {
      this.el.style.transition = 'none';
      // Force reflow so next transition applies cleanly
      void this.el.offsetWidth;
    } else {
      this.el.style.transition =
        `left ${MOVE_DURATION}ms linear, top ${MOVE_DURATION}ms linear`;
    }

    this.el.style.left = `${x}px`;
    this.el.style.top  = `${y}px`;
  }
}
