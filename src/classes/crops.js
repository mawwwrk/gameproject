import { Sprite } from "./sprite";

export class Crop extends Sprite {
  static types = ["Grapes", "Melon", "Tomato", "Starfruit"];

  constructor(source, x, y) {
    super(source, x, y);
    this.circular = true;
    this.diameter - 15;
    this._currentFrame = 0;

    this.showFrame(0);
    this.stages = [];
  }
}
