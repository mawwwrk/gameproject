const dpi = window.devicePixelRatio;
function dimFix(canvas) {
    const [cssHeight, cssWidth] = ['height', 'width'].map((prop) => parseFloat(getComputedStyle(canvas).getPropertyValue(prop)) * dpi);
    canvas.height = cssHeight;
    canvas.width = cssWidth;
    // ['height', 'width'].forEach(prop => {
    //     const propVal = parseFloat(getComputedStyle(el).getPropertyValue(prop)) * dpi
    //     el.setAttribute(prop, propVal.toString())
    // })
}
function fixCanvas({ canvas, window }) {
    dimFix(canvas);
    window.addEventListener('resize', () => {
        dimFix(canvas);
    });
}
// function attachInputListeners({ canvas, window }: CanvasAndWindow) {
//   let keyDownTime: number
//   function logKey(ev: KeyboardEvent) {
//       if (ev.type === 'keydown') keyDownTime = Date.now()
//       const timeHeld = ev.type === 'keyup' ? Date.now() - keyDownTime : Infinity
//       if (timeHeld > 60) console.log(`${ev.key}, ${ev.type}`)
//   }
//   function logMouse(ev: MouseEvent) {
//       const { offsetX: x, offsetY: y } = ev
//       console.log(`x: ${x}, y: ${y}`)
//   }
//   canvas.addEventListener('click', ev => logMouse(ev))
//   window.addEventListener('keydown', ev => logKey(ev))
//   window.addEventListener('keyup', ev => logKey(ev))
// }
export function init(propObj) {
    fixCanvas(propObj);
    //   attachInputListeners(propObj);
}
//# sourceMappingURL=helpers.js.map