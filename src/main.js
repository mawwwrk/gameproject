import { DisplayGrid } from "./classes";
import { growCrop } from "./components";
import * as PIXI from "./imports";
import { scaleToWindow } from "./imports";
import "./style.css";
import {
  adjacentGids,
  applyHandlers,
  farmCondition,
  harvest,
  Key,
} from "./util";

const app = new PIXI.Application({ width: 640, height: 480 });

document.body.insertBefore(
  app.view,
  document.body.querySelector("body > :first-child:not(:is(canvas))")
);
scaleToWindow(app.view, "darkgray");
window.addEventListener("resize", function (evt) {
  scaleToWindow(app.view);
});

let showGrid = false,
  showNums = false;

let hero,
  bg,
  state,
  input = {},
  grid = new DisplayGrid(),
  graphics = new PIXI.Graphics().lineStyle({ width: 1, color: "purple" }),
  graohicsFillOptions = {
    texture: PIXI.Texture.WHITE,
    color: 0xffffff,
    alpha: 1,
  },
  textStyleOptions = {
    fontFamily: "Arial",
    fontSize: 7,
    fill: "black",
    stroke: "black",
    strokeThickness: 0.5,
    align: "center",
    dropShadow: false,
    // dropShadowColor: "#000000", // dropShadowBlur: 4, // dropShadowAngle: Math.PI / 6, // dropShadowDistance: 6,
  };
let grids;

if (showNums) {
  grids = new PIXI.Container();
}

let gridProps = grid.createGridprops(),
  gridRefs = gridProps.map((props, index) => {
    let { x, y, width, height } = props,
      rect = new PIXI.Rectangle(x, y, width, height);

    if (showNums) {
      let text = new PIXI.Text(index.toString(), textStyleOptions);
      Object.assign(text, { x, y });
      grids.addChild(text);
    }
    let info = {};
    if (farmCondition(index)) info.farm = true;
    return {
      rect,
      info,
      // text
    };
  });

function drawGrid(graphics, input, fillStyle) {
  graphics.clear();
  graphics.beginTextureFill(fillStyle);
  for (let i = 0; i < input.length; i++) {
    let { rect } = input[i];
    graphics.drawShape(rect);
  }
}

function drawHitBox(graphics, input, fillStyle) {
  graphics.clear();
  graphics.beginTextureFill(fillStyle);
  graphics.drawShape(input);
}

PIXI.Loader.shared
  .add(["src/assets/Link.json", "src/assets/sprites.json"])
  .load(setup);
let spriteSheet;
function setup() {
  console.log(PIXI.Loader.shared.resources);
  spriteSheet =
    PIXI.Loader.shared.resources["src/assets/sprites.json"].spritesheet;
  bg = new PIXI.Sprite(
    spriteSheet.textures["bg_town"],
    spriteSheet.textures["bg_outdoors"]
  );
  bg.x = -150; //bg_town

  // bg.visible = false;
  app.stage.addChild(bg);
  app.stage.addChild(graphics);
  const linksheet =
    PIXI.Loader.shared.resources["src/assets/Link.json"].spritesheet;
  hero = new PIXI.AnimatedSprite(linksheet.animations["standDown"]);
  hero.setTransform(30, 30, 0, 0, 0, 0, 0, hero.width / 2, hero.height / 2);
  Object.assign(hero, {
    animationSpeed: 0.4,
    vx: 0,
    vy: 0,
    gid: undefined,
    facing: "Down",
  });
  hero.animations = linksheet.animations;
  // hero.hitArea = new PIXI.Rectangle(hero.x - 10, hero.y - 10, 20, 25);
  app.stage.addChild(hero);
  if (showNums) {
    app.stage.addChild(grids);
  }

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
  // console.log(hero);
  const vKey = new Key("KeyV", () => console.log(hero));
  const eKey = new Key("KeyE", () => harvest(hero));
  //   app.render();

  state = farming;

  gameLoop();
  // console.log(grids.children);
}
function gameLoop() {
  let heroAdjacent = adjacentGids(hero);

  if ("plant" in gridRefs[heroAdjacent.Up]) hero.vy = Math.max(0, hero.vy);
  if ("plant" in gridRefs[heroAdjacent.Down]) hero.vy = Math.min(0, hero.vy);
  if ("plant" in gridRefs[heroAdjacent.Left]) hero.vx = Math.max(0, hero.vx);
  if ("plant" in gridRefs[heroAdjacent.Right]) hero.vx = Math.min(0, hero.vx);
  hero.x += hero.vx;
  hero.y += hero.vy;

  if (showGrid) {
    const collidingSectors = gridRefs.filter(
      (p) =>
        p.rect.contains(hero.x, hero.y) || gridRefs.indexOf(p) === gridIndex //|| p.info.farm
    );
    // console.log(collidingSectors);
    drawGrid(graphics, collidingSectors, { alpha: 0.7, color: "blue" });
  }

  // drawHitBox(graphics, hero.hitArea, { alpha: 0.7, color: "hotpink" });
  state();
  app.render();
  requestAnimationFrame(gameLoop);
}

function play() {}

let farmTiles = gridRefs.filter((v, i) => farmCondition(i)),
  growingPlants = [],
  time;

function makeCropSprite() {
  console.log("ms");
  let plantDetails = growCrop(farmTiles),
    selectedFarmTile = farmTiles[plantDetails.key];
  let plantSprite = new PIXI.Sprite(
    spriteSheet.textures[plantDetails.textureRef]
  );
  plantSprite.scale = 5;
  plantSprite.spriteSheet = spriteSheet.textures;

  plantDetails.embed(plantSprite, spriteSheet);
  selectedFarmTile.plant = plantSprite;
  growingPlants.push(selectedFarmTile.plant);
  app.stage.addChild(selectedFarmTile.plant);
}

function farming() {
  if (!time) time = 0;
  if (performance.now() - time < 1000) return;
  growingPlants.forEach((p) => p.grow(p));
  time = performance.now();
  if (growingPlants.length < 8 && Math.random() < 0.3) makeCropSprite();
}
