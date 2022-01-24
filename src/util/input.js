export class Key {
  constructor(
    code,
    press = () => console.log(`${code} pressed`),
    release = () => console.log(`${code} released`)
  ) {
    this.code = code;
    this.isDown = false;
    this.isUp = true;
    this.press = press;
    this.release = release;
    this.test;
    if (this.code instanceof Array) {
      let codes = new Set(this.code);
      this.test = (evcode) => codes.has(evcode);
    } else {
      this.test = (evcode) => evcode === this.code;
    }

    window.addEventListener("keydown", this.downHandler.bind(this));
    window.addEventListener("keyup", this.upHandler.bind(this));
  }

  downHandler(ev) {
    if (this.test(ev.code)) {
      ev.preventDefault();
      this.isDown = true;
      this.isUp = false;
      this.press();
    }
  }
  upHandler(ev) {
    if (this.test(ev.code)) {
      ev.preventDefault();
      this.isUp = true;
      this.isDown = false;
      this.release();
    }
  }
}

export const keys = (keys, press, release) =>
  keys.forEach((key) => {
    new Key(key, press, release);
  });
const Directions = ["Left", "Up", "Right", "Down"];

/** @type {Object<string, number>} inputDir */
export const Direction = {
  None: 0,
  [Directions[0]]: 1 << 0,
  [Directions[1]]: 1 << 1,
  [Directions[2]]: 1 << 2,
  [Directions[3]]: 1 << 3,
};

let keyPress = Direction.None;

export function checkDirection(
  valueToCheck,
  { ifUp: doUp, ifDown: doDown, ifLeft: doLeft, ifRight: doRight }
) {
  if (valueToCheck & Direction.Up) doUp();
  if (valueToCheck & Direction.Right) doRight();
  if (valueToCheck & Direction.Down) doDown();
  if (valueToCheck & Direction.Left) doLeft();
}

function mouseEvListener(ev) {
  {
    ev.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!(ev.target.nodeName === "CANVAS")) return;
    let { offsetX, offsetY } = ev,
      [dx, dy] = [offsetX - targetObj.x, offsetY - targetObj.y];
    // targetObj.rotation = Math.atan2(dy, dx);
    // targetObj.setPosition(offsetX, offsetY);
  }
}

/**
 * @typedef {PointerEvent} SpecialEvt
 * @property {EventTarget}
 *
 * */

/** @param {import("../classes").DisplayObject} targetObj */
export function initControl(targetObj = undefined) {
  document.addEventListener("click", (ev) => {
    ev.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // if (!(ev.target.nodeName === "CANVAS")) return;
    // let { offsetX, offsetY } = ev;
    // targetObj.setPosition(offsetX, offsetY);
  });
  document.addEventListener("mousemove", (ev) => {
    ev.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // if (!(ev.target.nodeName === "CANVAS")) return;
    // let { offsetX, offsetY } = ev,
    //   [dx, dy] = [offsetX - targetObj.x, offsetY - targetObj.y];
    // targetObj.rotation = Math.atan2(dy, dx);
  });

  document.addEventListener("keydown", (ev) => {
    console.log(ev);
    let match = (/** @type {RegExp} */ rg) => rg.test(ev.code);
    if (!match(/^Ar|y[WASD]$/)) return;
    ev.preventDefault();
    switch (true) {
      case match(/[yU][Wp]$/):
        keyPress |= Direction.Up;
        break;
      case match(/[yw][Sn]$/):
        keyPress |= Direction.Down;
        break;
      case match(/[yh][Dt]$/):
        keyPress |= Direction.Right;
        break;
      case match(/[yf][At]$/):
        keyPress |= Direction.Left;
        break;
    }
  });
}
