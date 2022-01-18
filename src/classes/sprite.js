import { DisplayObject } from "./dispObject";

export class Sprite extends DisplayObject {
  constructor(source, x = 0, y = 0) {
    super();
    Object.assign(this, { x, y });

    if (source instanceof Image) this.createFromImage(source);
    if (source.taggedFrames) this.createFromTaggedFrames(source);
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

  createFromTaggedFrames(source) {
    this.source = source.image;
    this.sourceX = source.taggedFrames[0].x;
    this.sourceY = source.taggedFrames[0].y;
    this.width = this.sourceWidth = source.taggedFrames[0].w;
    this.height = this.sourceHeight = source.taggedFrames[0].h;
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
