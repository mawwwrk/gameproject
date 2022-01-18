import "https://cdn.skypack.dev/normalizecss";
import { assets } from "./assets";
import { DisplayObject, Sprite } from "./classes";
import { makeCanvas } from "./components/canvas";
import "./style.css";
import { proxiedResizeObserver, render } from "./util";
import { inputDir, Key } from "./util/input";

assets
  .load([
    "src/assets/link_master.json",
    "src/assets/bg.json",
    "src/assets/enemies.json",
  ])
  .then(() => setup());

function setup() {
  let keypress = inputDir.None;
  const [left, right, up, down] = ["Left", "Right", "Up", "Down"].map((ea) => {
    new Key(
      `Arrow${ea}`,
      () => (keypress |= inputDir[ea]),
      () => (keypress &= ~inputDir[ea])
    );
  });

  const canvas = makeCanvas("app");
  const stage = new DisplayObject();
  [stage.width, stage.height] = [canvas.width, canvas.height];
  proxiedResizeObserver(stage).observe(canvas);

  const backgroundImage = new Sprite(assets["outdoors.png"]);
  const linkSprite = new Sprite(assets.link_master);
  const linkScale = 1.8;

  Object.assign(linkSprite, { scaleX: linkScale, scaleY: linkScale });
  console.log(linkSprite);
  [backgroundImage, linkSprite].forEach((ea) => stage.addChild(ea));

  gameLoop();

  function gameLoop() {
    stage.putCenter(backgroundImage);

    if (keypress & inputDir.Up) linkSprite.y -= 1;
    if (keypress & inputDir.Down) linkSprite.y += 1;
    if (keypress & inputDir.Left) linkSprite.x -= 1;
    if (keypress & inputDir.Right) linkSprite.x += 1;

    requestAnimationFrame(gameLoop); //Move the ball
    render(stage, canvas);
  }
}
