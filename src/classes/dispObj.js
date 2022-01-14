export class DisplayObj {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  #circular;
  constructor() {
    //? position and size
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    //? velocity
    this.vx = 0;
    this.vy = 0;
  }
  get position() {
    return { x: this.x, y: this.y };
  }
  /**
   * @param {number} x
   * @param {number} y
   */
  setPosition(x, y) {
    [this.x, this.y] = [x, y];
  }
  get halfWidth() {
    return this.width * 0.5;
  }
  get halfHeight() {
    return this.height * 0.5;
  }
  get center() {
    return {
      x: this.x + this.halfWidth,
      y: this.y + this.halfHeight,
    };
  }
  get circular() {
    return this.#circular;
  }
  set circular(value) {
    if (value === true && !this.#circular) {
      Object.defineProperties(this, {
        diameter: {
          get() {
            return this.width;
          },
          set(value) {
            this.width = this.height = value;
          },
          enumerable: true,
          configurable: true,
        },
        radius: {
          get() {
            return this.halfWidth;
          },
          set(value) {
            this.width = this.height = value * 2;
          },
          enumerable: true,
          configurable: true,
        },
      });
      this.#circular = true;
    }
    if (value === false && this.#circular) {
      delete this.diameter;
      delete this.radius;
      this.#circular = false;
    }
  }
}
