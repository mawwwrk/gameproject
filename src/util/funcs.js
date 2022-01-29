/**
 * @param {number} min
 * @param {number} max
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {number} min
 * @param {number} max
 */
export function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

export function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function farmCondition(index) {
  return (
    index / 40 > 11 && index / 40 < 25 && index % 40 >= 4 && index % 40 < 22
  );
}

export function adjacentGids(sprite) {
  const gid = Math.floor(sprite.x / 16) + Math.floor(sprite.y / 16) * 40,
    adjacentGids = {
      Left: gid - 1,
      Up: gid - 40,
      Right: gid + 1,
      Down: gid + 40,
    };
  sprite.gid = gid;
  return adjacentGids;
}
export function checkPlantAdjacent(hero, gridRefs) {
  let heroAdjacent = adjacentGids(hero);
  let dirArr = [
    ["Left", "vx", Math.max],
    ["Up", "vy", Math.max],
    ["Right", "vx", Math.min],
    ["Down", "vy", Math.min],
  ].forEach((r) => {
    isPlantAdjacent(r);
  });

  function isPlantAdjacent(arr) {
    let [facing, prop, mathFn] = arr;
    if ("plant" in gridRefs[heroAdjacent[facing]]) {
      hero[`plant${facing}`] = gridRefs[heroAdjacent[facing]];
      hero[prop] = mathFn(0, hero[prop]);
    } else {
      hero[`plant${facing}`] = undefined;
    }
  }
}
