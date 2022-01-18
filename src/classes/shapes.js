import { DisplayObject } from "./dispObject";


export class Rectangle extends DisplayObject {
  constructor(
    width = 32,
    height = 32,
    fillStyle = "hotpink",
    strokeStyle = "none",
    lineWidth = 0,
    x = 0,
    y = 0
  ) {
    super();

    Object.assign(this, {
      width,
      height,
      fillStyle,
      strokeStyle,
      lineWidth,
      x,
      y,
    });

    this.mask = false;
  }

  //The `render` method explains how to draw the sprite
  draw(ctx) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.rect(
      //Draw the sprite around its `pivotX` and `pivotY` point
      -this.width * this.pivotX,
      -this.height * this.pivotY,
      this.width,
      this.height
    );
    if (this.strokeStyle !== "none") ctx.stroke();
    if (this.fillStyle !== "none") ctx.fill();
    if (this.mask && this.mask === true) ctx.clip();
  }
}
