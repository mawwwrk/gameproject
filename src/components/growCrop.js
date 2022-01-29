import { randomInt } from "../util";

export function growCrop(farmTiles) {
  let key, selectedFarmTile;

  do {
    key = randomInt(0, farmTiles.length);
    selectedFarmTile = farmTiles[key];
  } while ("plant" in selectedFarmTile);

  const plant = ["Grapes", "Melon", "Starfruit"][randomInt(0, 2)];
  const stage = 1;

  return { key, plant, stage };
}
