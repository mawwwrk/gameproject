/**
 * @param {ResizeObserverEntry[]} entries
 */
export const resizeCallback = (entries) => {
  entries.forEach(
    (
      /** @type {{ contentRect: { width: any; height: any; }; target: any; }} */ entry
    ) => {
      let { width, height } = entry.contentRect;
      Object.assign(entry.target, { width, height });
    }
  );
};

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

/**
 * @param {import("../classes").dispObj} targetObj
 */
export function initControl(targetObj) {
  /**
   * @param {PointerEvent} ev
   */
  document.addEventListener("click", (ev) => {
    ev.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!(ev.target.nodeName === "CANVAS")) return;
    let { offsetX, offsetY } = ev;
    targetObj.setPosition(offsetX, offsetY);
  });
}
