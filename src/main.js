import * as PIXI from "./imports";

const app = new PIXI.Application();

document.body.insertBefore(
  app.view,
  document.body.querySelector("body > :first-child:not(:is(canvas))")
);

PIXI.Loader.shared
  .add(["src/assets/Link.json", "src/assets/sprites.json"])
  .load(setup);

function setup() {
  console.log(PIXI.Loader.shared.resources);
  const spriteSheet =
    PIXI.Loader.shared.resources["src/assets/sprites.json"].spritesheet;
  const bg = new PIXI.Sprite(
    spriteSheet.textures["bg_town"],
    spriteSheet.textures["bg_outdoors"]
  );
  app.stage.addChild(bg);
  const linksheet =
    PIXI.Loader.shared.resources["src/assets/Link.json"].spritesheet;
  const sprite = new PIXI.Sprite(linksheet.textures["customLink 258.ase"]);
  app.stage.addChild(sprite);
  console.log(bg);
}

function gameLoop() {}
