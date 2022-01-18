import { DisplayObject } from "../classes";

export const proxiedResizeObserver = (/** @type {DisplayObject} */ alias) =>
  new ResizeObserver(resizeCallback(resizeProxy(alias)));

export const resizeCallback =
  (/** @type {ProxyHandler<any>} */ proxyHandler) =>
  (
    /** @type {{ contentRect: { width: any; height: any; }; target: any; }[]} */ entries
  ) => {
    entries.forEach(
      (
        /** @type {{ contentRect: { width: any; height: any; }; target: any; }} */ entry
      ) => {
        let target = entry.target;
        if (entry === entries[0]) {
          target = new Proxy(target, proxyHandler);
        }

        let { width, height } = entry.contentRect;

        Object.assign(target, { width, height });
      }
    );
  };

export const resizeProxy = (
  /** @type {import("../classes").DisplayObject} */ alias
) => ({
  /**
   * @param {object} target
   * @param {PropertyKey} prop
   * @param {any} value
   */
  set(target, prop, value) {
    if (prop === "width" || prop === "height") {
      alias[prop] = value;
    }
    return Reflect.set(target, prop, value);
  },
});

/**
 * @param {number} min
 * @param {number} max
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {number} min
 * @param {number} max
 */
export function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * @param { CanvasRenderingContext2D } ctx
 * @param {number} x
 * @param {number} y
 */
export function testHelper(ctx, x, y) {
  return function (
    /** @type {number} */ radius,
    /** @type {keyof typeof ctx} */ drawFunc,
    startAngle = 0,
    endAngle = Math.PI * 2
  ) {
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    /** @type {Function} */ (ctx[drawFunc])();
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
export function initControl(targetObj) {
  document.addEventListener("click", (ev) => {
    ev.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!(ev.target.nodeName === "CANVAS")) return;
    let { offsetX, offsetY } = ev;
    targetObj.setPosition(offsetX, offsetY);
  });
  document.addEventListener("mousemove", (ev) => {
    ev.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!(ev.target.nodeName === "CANVAS")) return;
    let { offsetX, offsetY } = ev,
      [dx, dy] = [offsetX - targetObj.x, offsetY - targetObj.y];
    targetObj.rotation = Math.atan2(dy, dx);
  });

  document.addEventListener("keydown", (ev) => {
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

export function point(centreX, centreY, radius, angle) {
  let x, y;
  x = centreX + radius * Math.cos(angle);
  y = centreY + radius * Math.sin(angle);

  return { x: x, y: y };
}

export function drawPoint(obj) {
  const offset = (45 / 180) * Math.PI;
  const compAngles = [obj.rotation - offset, obj.rotation + offset];
  const path = new Path2D();
  path.moveTo(obj.x, obj.y);
  const compPoints = compAngles.map((a) =>
    point(obj.x, obj.y, obj.radius * 0.35, a)
  );
  path.lineTo(compPoints[0].x, compPoints[0].y);
  const targetPoint = point(obj.x, obj.y, obj.radius, obj.rotation);
  path.lineTo(targetPoint.x, targetPoint.y);
  path.lineTo(compPoints[1].x, compPoints[1].y);
  return path;
}
