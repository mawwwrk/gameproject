import { DisplayObj } from "./dispObj";

export class Circle extends DisplayObj {
  constructor(x = 0, y = 0, diameter = 64) {
    super();
    this.circular = true;
    Object.assign(this, {
      x,
      y,
      diameter,
    });
    this.height = this.width = diameter * 2;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.beginPath();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ctx.arc(this.x, this.y, this.diameter, 0, Math.PI * 2, false);
    ctx.stroke();
  }
}
