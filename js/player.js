import { canMoveTo, getInteraction } from './collision.js';
import { sprites, applySprite }      from './sprites.js';

const MOVE_DURATION = 150; // ms — time to slide one tile

const DIR_DELTA = {
  up:    { col:  0, row: -1 },
  down:  { col:  0, row:  1 },
  left:  { col: -1, row:  0 },
  right: { col:  1, row:  0 },
};

export class Player {
  constructor(element, tileSize, startCol, startRow) {
    this.el       = element;
    this.tileSize = tileSize;
    this.tileX    = startCol;
    this.tileY    = startRow;
    this.facing   = 'down';
    this.isMoving = false;

    this._setPosition(true);
  }

  tryMove(direction) {
    if (this.isMoving) return false;

    const prevFacing = this.facing;
    this.facing = direction;
    this.el.dataset.facing = direction;

    // Update sprite when direction changes
    if (direction !== prevFacing) this._updateSprite(direction);

    const { col: dc, row: dr } = DIR_DELTA[direction];
    const newX = this.tileX + dc;
    const newY = this.tileY + dr;

    if (!canMoveTo(newX, newY)) return false;

    this.tileX = newX;
    this.tileY = newY;
    this.isMoving = true;
    this.el.classList.add('is-walking');
    this._setPosition(false);

    setTimeout(() => {
      this.isMoving = false;
      this.el.classList.remove('is-walking');
    }, MOVE_DURATION);

    return true;
  }

  tryInteract() {
    return getInteraction(this.tileX, this.tileY, this.facing);
  }

  /** Teleport player to a new tile position (used for room transitions). */
  warpTo(col, row) {
    this.tileX = col;
    this.tileY = row;
    this._setPosition(true);
  }

  _updateSprite(direction) {
    const sp = sprites.player[direction];
    if (sp) applySprite(this.el, sp());
  }

  _setPosition(instant) {
    const x = this.tileX * this.tileSize;
    const y = this.tileY * this.tileSize;

    if (instant) {
      this.el.style.transition = 'none';
      void this.el.offsetWidth;
    } else {
      this.el.style.transition =
        `left ${MOVE_DURATION}ms linear, top ${MOVE_DURATION}ms linear`;
    }

    this.el.style.left = `${x}px`;
    this.el.style.top  = `${y}px`;
  }
}
