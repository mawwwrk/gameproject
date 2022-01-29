import { DisplayGrid } from "./classes";
import * as PIXI from "./imports";
import { scaleToWindow } from "./imports";
import "./style.css";
import {
  adjacentGids,
  applyHandlers,
  farmCondition,
  Key,
  randomInt,
  wait,
} from "./util";

const app = new PIXI.Application({
  width: 640,
  height: 480,
  backgroundColor: 0xffffff,
});

document.body.insertBefore(
  app.view,
  document.body.querySelector("body > :first-child:not(:is(canvas))")
);
scaleToWindow(app.view, "darkgray");
window.addEventListener("resize", function () {
  scaleToWindow(app.view);
});

let showGrid = false,
  showNums = false,
  hideBG = false;

let hero,
  bg,
  state,
  score,
  text,
  scoring = { Grapes: 1, Melon: 3, Starfruit: 5 },
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
  },
  bitmapStyle = new PIXI.TextStyle({
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: 22,
    fontWeight: "bold",
    stroke: "white",
    strokeThickness: 3,
  });
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
  .add([
    "src/assets/Link.json",
    "src/assets/sprites.json",
    "src/assets/numbers.json",
    "src/assets/rpgItems_42.png",
  ])
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

  if (hideBG) bg.visible = false;
  app.stage.addChild(bg);
  app.stage.addChild(graphics);
  const linksheet =
    PIXI.Loader.shared.resources["src/assets/Link.json"].spritesheet;
  hero = new PIXI.AnimatedSprite(linksheet.animations["standDown"]);
  hero.setTransform(200, 80, 0, 0, 0, 0, 0, hero.width / 2, hero.height / 2);
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
  const eKey = new Key(
    "KeyE",
    () => harvest(hero),
    () => console.log(hero[`plant${hero.facing}`])
  );
  //   app.render();

  PIXI.BitmapFont.from("bitmapFont", bitmapStyle);
  text = new PIXI.BitmapText("message", { fontName: "bitmapFont" });
  let coin = new PIXI.Sprite(
      PIXI.Loader.shared.resources["src/assets/rpgItems_42.png"].texture
    ),
    scoreContainer = new PIXI.Container();
  scoreContainer.addChild(coin, text);
  coin.x = text.width;
  coin.y = 5;

  scoreContainer.x = 500;

  app.stage.addChild(scoreContainer);

  state = farming;

  gameLoop();
  // console.log(grids.children);
}
function gameLoop() {
  let heroAdjacent = adjacentGids(hero);

  if ("plant" in gridRefs[heroAdjacent.Left]) {
    hero.plantLeft = gridRefs[heroAdjacent.Left];
    hero.vx = Math.max(0, hero.vx);
  } else {
    hero.plantLeft = undefined;
  }
  if ("plant" in gridRefs[heroAdjacent.Up]) {
    hero.plantUp = gridRefs[heroAdjacent.Up];
    hero.vy = Math.max(0, hero.vy);
  } else {
    hero.plantUp = undefined;
  }
  if ("plant" in gridRefs[heroAdjacent.Right]) {
    hero.plantRight = gridRefs[heroAdjacent.Right];
    hero.vx = Math.min(0, hero.vx);
  } else {
    hero.plantRight = undefined;
  }
  if ("plant" in gridRefs[heroAdjacent.Down]) {
    hero.plantDown = gridRefs[heroAdjacent.Down];
    hero.vy = Math.min(0, hero.vy);
  } else {
    hero.plantDown = undefined;
  }
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

function harvest(hero) {
  if (!farmCondition(hero.gid)) return;

  hero.textures = hero.animations[`pickup${hero.facing}`];
  hero.loop = false;
  hero.onComplete = () => {
    hero.loop = true;
    hero.onComplete = undefined;
  };
  if (!hero.playing) hero.play();

  let target = hero[`plant${hero.facing}`];

  if (target) {
    let { type, sprite } = target.plant;
    score += scoring[type];
    console.log(sprite);
    sprite.texture = spriteSheet.textures[`${type}_crop`];
    growingPlants.splice(growingPlants.indexOf(sprite), 1);
    delete target.plant;

    let interval = setInterval(() => {
      sprite.visible = !sprite.visible;
    }, 100);

    wait(320).then(() => {
      sprite.destroy();
      clearInterval(interval);
    });
  }
}

function makeCropSprite() {
  let key, tile;

  do {
    key = randomInt(0, farmTiles.length - 1);
    tile = farmTiles[key];
  } while ("plant" in tile);

  const type = ["Grapes", "Melon", "Starfruit"][randomInt(0, 2)];
  const stage = 1;

  const ref = `${type}_growing_0${stage}`;

  let { x, y } = tile.rect,
    sprite = new PIXI.Sprite(spriteSheet.textures[ref]);
  Object.assign(sprite, { x, y });
  tile.plant = { type, stage, sprite };
  growingPlants.push(tile.plant);
  app.stage.addChild(sprite);
}

function grow(plant) {
  if (plant.stage > 4) return;
  plant.stage++;
  let ref = `${plant.type}_growing_0${plant.stage}`;
  plant.sprite.texture = spriteSheet.textures[ref];
}

function farming() {
  if (!score) score = 0;
  text.text = score;
  if (!time) time = 0;
  if (performance.now() - time < 1000) return;
  growingPlants.forEach((p) => grow(p));
  time = performance.now();
  if (growingPlants.length < 28 && Math.random() < 0.3) makeCropSprite();
}
