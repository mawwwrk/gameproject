import "https://cdn.skypack.dev/normalizecss";
import { assets } from "./assets";
import {
  Blob,
  Crop,
  DisplayObject,
  Group,
  Hero,
  Rectangle,
  Sprite,
  TextSprite,
} from "./classes";
import { contain, makeCanvas } from "./components";
import "./style.css";
import {
  Direction,
  filterPropsIn,
  frameInterval,
  getCrops,
  hit,
  Key,
  makePointer,
  outsideBounds,
  projectile,
  proxiedResizeObserver,
  randomInt,
  remove,
  render,
  shoot,
  wait,
} from "./util";

let state = "inTown";

assets
  .load([
    "src/assets/bg.json",
    "src/assets/sprites.json",
    "src/assets/Link.json",
    "src/assets/silver.ttf",
    // "src/assets/music.mp3",
  ])
  .then(() => setup());

const storage = window.sessionStorage;
let maxPlants = 6,
  maxEnemies = 6,
  enemies = [],
  enemyGrp,
  arrows;

function setup() {
  getCrops(assets);
  console.log(assets);

  const canvas = makeCanvas("app");
  let ctx = canvas.ctx,
    previousTime = 0,
    framesDrawn = 0,
    updateCycles = 0,
    totalElapsed = 0;

  const stage = new DisplayObject();
  [stage.width, stage.height] = [canvas.width, canvas.height];
  proxiedResizeObserver(stage).observe(canvas);

  const border = new Rectangle();
  // border.fillStyle = "none";
  if (state === "inTown")
    Object.assign(border, { width: 25, height: 90, x: 495, y: 270 });
  if (state === "inTheWoods")
    Object.assign(border, { width: 180, height: 40, x: 400, y: 360 });

  const filler = document.querySelector(".modal");
  filler.classList.add("hidden");

  const bg = ["bg_outdoors.png", "bg_town.png"];
  const key = state === "inTown" ? 1 : 0;
  const backgroundImage = new Sprite(assets[bg[key]]);

  const hero = new Hero(assets.Link, 16, 26);

  let message = new TextSprite("", "12px puzzler", "black", 8, 8);
  const groupObj = new Group();

  // backgroundImage.addChild(new Rectangle(200, 100, "white", "none", 0, 20, 20));
  [backgroundImage, border, hero, groupObj, message].forEach((ea) =>
    stage.addChild(ea)
  );

  console.log(stage);

  const garden = new Rectangle(250, 200, "none", "red", 1, 100, 180);
  stage.addChild(garden);

  if (state !== "inTown") garden.visible = false;

  if (state === "inTheWoods") {
    let spacing = 48,
      xOffset = 150;
    for (let i = 0; i < maxEnemies; i++) {
      const blob = new Blob(
        filterPropsIn(assets)("slime_blue"),
        spacing * i + xOffset,
        randomInt(0, canvas.height - 20)
      );
      //Give the enemy a random y position
      blob.circular = true;
      blob.radius = 26;
      enemies = [...enemies, blob];
      stage.addChild(blob);
    }

    enemyGrp = new Group(enemies);
  }
  arrows = [];
  const arrow = () =>
    projectile(
      stage,
      assets
    )(
      Object.keys(assets)
        .filter((x) => /arrow.+/.test(x))
        .map((y) => assets[y])
    )({
      scale: stage.children[1].scale,
    });
  const fire = (shooter, angle) => {
    if (fire.reloading) return;
    shoot(shooter, angle, 0, 20, arrows, arrow);
    fire.reloading = true;
  };

  let input = {
    kb: {
      dir: Direction.None,

      left: new Key(
        ["ArrowLeft", "KeyA"],
        function leftPress() {
          input.kb.dir |= Direction.Left;
          hero.facing = "Left";
        },
        function leftRelease() {
          input.kb.dir &= ~Direction.Left;
        }
      ),

      up: new Key(
        ["ArrowUp", "KeyW"],
        function upPress() {
          input.kb.dir |= Direction.Up;
          hero.facing = "Up";
        },
        function upRelease() {
          input.kb.dir &= ~Direction.Up;
        }
      ),

      right: new Key(
        ["ArrowRight", "KeyD"],
        function rightPress() {
          input.kb.dir |= Direction.Right;
          hero.facing = "Right";
        },
        function rightRelease() {
          input.kb.dir &= ~Direction.Right;
        }
      ),
      down: new Key(
        ["ArrowDown", "KeyS"],
        function downPress() {
          input.kb.dir |= Direction.Down;
          hero.facing = "Down";
        },
        function downRelease() {
          input.kb.dir &= ~Direction.Down;
        }
      ),
    },
    mouse: {},
    gamestate: state,
  };

  const pointer = makePointer(canvas);
  pointer.press = (event) => {
    input.mouse.button = event.button;
    if (fire.reloading && input.mouse.button === 2)
      input.mouse.button === undefined;
    if (event.button === 2 && !fire.reloading) {
      fire(
        hero,
        Math.atan2(pointer.centerY - hero.y, pointer.centerX - hero.x)
      );
      wait(300).then(() => (fire.reloading = false));
    }
    input.mouse.atan2 = Math.atan2(
      pointer.centerY - hero.y,
      pointer.centerX - hero.x
    );
    // console.log(input.mouse.atan2);
  };
  pointer.release = (event) => {
    input.mouse.button = undefined;
  };

  const preventDefaultKeys = new Set(["Space"]);
  addEventListener("contextmenu", (ev) => ev.preventDefault());
  addEventListener("keypress", (ev) => {
    if (preventDefaultKeys.has(ev.code)) ev.preventDefault;
  });

  function update() {
    stage.putCenter(backgroundImage);
    hero.update(input);
    contain(hero, stage.localBounds);
    if (state === "inTown") {
      inTown();
      if (
        hit(hero, border, false, false, "none", (s, u) =>
          console.log(s, u, hero.vX)
        ) &&
        Math.abs(hero.vX) < 0.1
      ) {
        state === "inTheWoods";
        setup();
      }
    }
    if (state === "inTheWoods") {
      inTheWoods();
      if (hit(hero, border) && hero.vX === 0) {
        state === "inTown";
        setup();
      }
    }
    ++updateCycles;
  }
  function inTheWoods() {
    enemies.forEach((ea) => ea.act());
    /* const hitBoxCollision = */
    contain(enemyGrp, stage.localBounds);

    let heroHit = hit(hero, enemies, false, false, null, (str, obj) => {
      if (hero.state === "attack") {
        //   hero.proxy.fillStyle = "rgba(0,200,0, 50%)";
        //   obj.proxy.fillStyle = "rgba(200,0,0,50%)";
        obj.hp -= 2;
        obj.state = "aggro";
        obj.target = hero;
        obj.aggro(hero);
        //   wait(1250).then(() => {
        //     hero.proxy.fillStyle = "none";
        //     obj.proxy.fillStyle = "none";
        //   });
        //   // obj.hp -= 2;sss
        //   // console.log(obj);
      }
    });

    enemies = enemies.filter((enemy) => {
      if (enemy.hp < 1) {
        remove(enemy);
        return false;
      }
      return true;
    });
    arrows = arrows.filter((arrow) => {
      arrow.x += arrow.vx;
      arrow.y += arrow.vy;
      // if (arrow.falling && arrow.y <= arrow.dropHeight) {
      //   arrow.vy += 1;
      //   arrow.x += arrow.vx;
      //   arrow.y += arrow.vy;
      // }
      if (!arrow.inFlight) {
        arrow.vx *= arrow.friction;
        arrow.vy *= arrow.friction;
      }

      if (arrow.inFlight) {
        let didhit = hit(arrow, enemies, true, true, null, (str, obj) => {
          obj.hp -= 1;
          arrow.inFlight = false;
        });
      }

      let collision = outsideBounds(arrow, stage.localBounds);

      if (collision) {
        // message.content = "The arrow hit the " + collision;
        remove(arrow);
        return false;
      }
      return true;
    });
  }
  // render(stage, canvas);
  runGame();
  function runGame(timestamp) {
    if (!timestamp) timestamp = 0;
    let elapsed = timestamp - previousTime;
    totalElapsed += elapsed;
    // console.log(1);
    while (totalElapsed >= frameInterval) {
      update();
      totalElapsed -= frameInterval;
    }

    render(stage, canvas);
    ++framesDrawn;

    previousTime = timestamp;
    requestAnimationFrame(runGame);
  }

  const plants = [];
  let shouldGrow = true;

  setInterval(() => {
    console.log(plants);
  }, 5000);
  function inTown() {
    if (shouldGrow && plants.length < maxPlants)
      Math.random() < 0.8 ? addNewCrop(plants) : null;
    plants.forEach((plant) => {
      plant.showFrame(plant._currentFrame);
      if (!shouldGrow) return;
      if (Math.random() < 0.8) advanceCrop(plant);

      function advanceCrop(crop) {
        crop._currentFrame += 1;
        crop.showFrame(crop._currentFrame);
        shouldGrow = false;
        wait(randomInt(4, 20) * 1000).then(() => (shouldGrow = true));
      }
    });
    // setInterval(console.log(plants), 3000);
    function addNewCrop(arr) {
      if (!shouldGrow) return;
      console.log(arr);
      let cropType =
          Math.random() < 0.7 ? "Starfruit" : Crop.types[randomInt(0, 2)],
        cropFiles = assets.crops[cropType];

      console.log(arr);
      const crop = new Crop(
        cropFiles.growing.map((x) => x.frame),
        Math.random() * garden.width,
        Math.random() * garden.height
      );
      console.log(crop);

      garden.addChild(crop);

      crop.scale = 1;
      crop.harvest = cropFiles.crop;
      arr.push(crop);

      shouldGrow = false;
      wait(randomInt(4, 20) * 1000).then(() => (shouldGrow = true));
    }
  }
}
