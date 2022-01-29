import { randomInt } from "../util";

export class CropPlant {
  static varieties = ["Tomato", "Grapes", "Melon", "Starfruit"];
  static spriteSheet;
  constructor(refObj) {
    let { x, y } = refObj.rect;
    Object.assign(this, { x, y });
    this.type = CropPlant.varieties[randomInt(0, CropPlant.varieties.length)];
    this.stage = 1;
    this.refObj = refObj;
  }
  get growingStage() {
    return `growing_0${this.stage}`;
  }
  get textureRef() {
    return `${this.type}_${this.growingStage}`;
  }
  grow(sprite) {
    if (Math.random() < 0.3) {
      //   console.log(this);
      this.stage++;
      sprite.texture = CropPlant.spriteSheet[this.textureRef];
      //   console.log(sprite, this.textureRef);
    }
  }
  yieldCrop() {
    let cropTextureRef = "";
    if (this.stage < 2 || this.stage > 5) {
      cropTextureRef = "_bad";
    } else if (this.stage < 5) {
      cropTextureRef = "_small";
    }
    this.sprite.texture =
      CropPlant.spriteSheet[`${this.type}_crop${cropTextureRef}`];
    delete this.refObj.plant;
    return this.sprite;
  }

  embed(sprite, spriteSheet) {
    if (!CropPlant.spriteSheet) CropPlant.spriteSheet = spriteSheet;
    Object.assign(sprite, { x: this.x, y: this.y });
    Object.defineProperties(sprite, {
      grow: { value: this.grow.bind(this) },
      yieldCrop: { value: this.yieldCrop.bind(this) },
    });
    this.sprite = sprite;
  }
}
