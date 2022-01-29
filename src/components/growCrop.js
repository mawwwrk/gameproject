import { CropPlant } from "../classes";
import { randomInt } from "../util";

export function growCrop(farmTiles) {
  let key, selectedFarmTile;
  do {
    key = randomInt(0, farmTiles.length);
    selectedFarmTile = farmTiles[key];
  } while ("plant" in selectedFarmTile);

  let plantDetails = new CropPlant(selectedFarmTile);

  plantDetails.key = key;
  return plantDetails;
}
