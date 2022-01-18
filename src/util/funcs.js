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
        // target.width;
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
    const origWidth = target.width;
    if (prop === "width" || prop === "height") {
      alias[prop] = value;
    }
    if (prop === "width") {
      const childSprites = alias.children;
      const background = childSprites[0];
      let [, ...restOfThem] = childSprites;
      let mod = value / origWidth;

      const aspectRatio = background.height / background.width;
      background.width = alias.width;
      background.height = alias.width * aspectRatio;

      if (origWidth !== 256)
        restOfThem.forEach((ea) => {
          let { x, y, scaleX } = ea;
          ea.setPosition(x * mod, y * mod);
          ea.setScale(scaleX * mod);
        });
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
