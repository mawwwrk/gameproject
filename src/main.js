import * as PIXI from "./imports";
import { scaleToWindow } from "./imports";
import "./style.css";
import { applyHandlers, Key } from "./util";

const app = new PIXI.Application({ width: 640, height: 480 });

document.body.insertBefore(
  app.view,
  document.body.querySelector("body > :first-child:not(:is(canvas))")
);
scaleToWindow(app.view, "darkgray");
window.addEventListener("resize", function (evt) {
  scaleToWindow(app.view);
});

PIXI.Loader.shared
  .add(["src/assets/Link.json", "src/assets/sprites.json"])
  .load(setup);
let hero,
  bg,
  state,
  input = {};

function setup() {
  console.log(PIXI.Loader.shared.resources);
  const spriteSheet =
    PIXI.Loader.shared.resources["src/assets/sprites.json"].spritesheet;
  bg = new PIXI.Sprite(
    spriteSheet.textures["bg_town"],
    spriteSheet.textures["bg_outdoors"]
  );
  bg.x = -150; //bg_town
  app.stage.addChild(bg);
  const linksheet =
    PIXI.Loader.shared.resources["src/assets/Link.json"].spritesheet;
  hero = new PIXI.AnimatedSprite(linksheet.animations["standDown"]);
  hero.animations = linksheet.animations;
  app.stage.addChild(hero);

  input.keys = {
    left: new Key("KeyA"),
    up: new Key("KeyW"),
    right: new Key("KeyD"),
    down: new Key("KeyS"),
  };

  applyHandlers(
    [input.keys.left, input.keys.up, input.keys.right, input.keys.down],
    hero
  );
  console.log(hero);
  //   app.render();
  state = play;
}

function gameLoop() {
  state();
}

function play() {}
