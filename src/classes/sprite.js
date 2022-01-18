import { Rectangle } from ".";
import { DisplayObject } from "./dispObject";

export class Sprite extends DisplayObject {
  constructor(source, x = 0, y = 0) {
    super();
    Object.assign(this, { x, y });

    if (source instanceof Image) this.createFromImage(source);
    if (source.frameTags) this.createFromFrameTags(source);
    if (source.frame) this.createFromAtlas(source);
  }

  createFromImage(source) {
    this.source = source;
    this.sourceX = 0;
    this.sourceY = 0;
    this.width = source.width;
    this.height = source.height;
    this.sourceWidth = source.width;
    this.sourceHeight = source.height;
  }

  createFromAtlas(source) {
    this.tilesetFrame = source;
    this.source = this.tilesetFrame.source;
    this.sourceX = this.tilesetFrame.frame.x;
    this.sourceY = this.tilesetFrame.frame.y;
    this.width = this.tilesetFrame.frame.w;
    this.height = this.tilesetFrame.frame.h;
    this.sourceWidth = this.tilesetFrame.frame.w;
    this.sourceHeight = this.tilesetFrame.frame.h;
  }

  createFromFrameTags(source) {
    this.source = source.image;
    this.frameTags = source.frameTags;
    const ref = Object.keys(this.frameTags)[0];
    this.sourceX = this.frameTags[ref][0].x;
    this.sourceY = this.frameTags[ref][0].y;
    this.width = this.sourceWidth = this.frameTags[ref][0].w;
    this.height = this.sourceHeight = this.frameTags[ref][0].h;
  }

  draw(ctx) {
    ctx.drawImage(
      this.source,
      this.sourceX,
      this.sourceY,
      this.sourceWidth,
      this.sourceHeight,
      -this.width * this.pivotX,
      -this.height * this.pivotY,
      this.width,
      this.height
    );
  }
}

export class Hero extends Sprite {
  constructor(source, width, height) {
    super(source);
    this.hitbox = new Rectangle(width, height, "none", "none");
    this.addChild(this.hitbox);
    this.putCenter(this.hitbox);

    Object.assign(this, { x: 120, y: 120, shadow: true });
  }
  beAhero() {
    console.log("ima hero");
  }
}
