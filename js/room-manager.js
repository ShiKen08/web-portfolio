// Room manager — loads map JSON and switches between rooms
// Phase 2G infrastructure (map design coming from reference image)

import { renderMap }    from './map-renderer.js';
import { loadCollision } from './collision.js';

const ROOM_FILES = {
  room1: 'js/data/map.json',
  room2: 'js/data/room2.json',
};

let currentRoomId = 'room1';

export function getCurrentRoom() { return currentRoomId; }

/**
 * Load a room by id. Returns the parsed mapData.
 * @param {string} id
 */
export async function loadRoom(id) {
  const path = ROOM_FILES[id];
  if (!path) throw new Error(`Unknown room: ${id}`);

  const res  = await fetch(path);
  const data = await res.json();
  currentRoomId = id;

  const canvas = document.getElementById('map-canvas');
  renderMap(canvas, data);
  loadCollision(data);

  return data;
}

/**
 * Destination room when stepping on a door tile.
 * Extend this to support multi-room routing.
 */
export function getExitDestination(roomId) {
  const map = { room1: 'room2', room2: 'room1' };
  return map[roomId] ?? 'room1';
}
