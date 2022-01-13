export class dispObj {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

  }
  get position() {
    return { x: this.x, y: this.y };
  }
  setPosition(x, y) {
    [this.x, this.y] = [x, y];
  }
  get halfWidth() {
    return this.width * 0.5;
  }
  get halfHeight() {
    return this.height * 0.5;
  }
}
