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

    window.addEventListener("keydown", this.downHandler.bind(this));
    window.addEventListener("keyup", this.upHandler.bind(this));
  }

  downHandler(ev) {
    if (ev.code === this.code) {
      this.press();
      this.isDown = true;
      this.isUp = false;
    }
    ev.preventDefault();
  }
  upHandler(ev) {
    if (ev.code === this.code) {
      this.release();
      this.isUp = true;
      this.isDown = false;
    }
    ev.preventDefault();
  }
}

export function keyboardInput(code) {
  let key = {
    code,
    isDown: false,
    isUp: true,
    press: undefined,
    release: undefined,
  };
}

const keys = {
  Space: "Space",
  Arrows: ["Left", "Right", "Up", "Down"],
  Wasd: ["W", "A", "S", "D"],
};

const Dir = {
  None: 0,
  Left: 1 << 0,
  Right: 1 << 1,
  Up: 1 << 2,
  Down: 1 << 3,
};

let keyPress = Dir.None;

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
        keyPress |= Dir.Up;
        break;
      case match(/[yw][Sn]$/):
        keyPress |= Dir.Down;
        break;
      case match(/[yh][Dt]$/):
        keyPress |= Dir.Right;
        break;
      case match(/[yf][At]$/):
        keyPress |= Dir.Left;
        break;
    }
  });
}
