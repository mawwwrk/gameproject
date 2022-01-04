import { CanvasAndWindow } from "../types/types"

const dpi = window.devicePixelRatio
function dimFix(el: HTMLCanvasElement): void {
    ['height', 'width'].forEach(prop => {
        const propVal = parseFloat(getComputedStyle(el).getPropertyValue(prop)) * dpi
        el.setAttribute(prop, propVal.toString())
    })
}
function fixCanvas({ canvas, window }: CanvasAndWindow) {
    dimFix(canvas)
    window.addEventListener('resize', () => {
        dimFix(canvas)
    }
    )
}

function attachInputListeners({ canvas, window }: CanvasAndWindow) {
    let downTime: number

    function logKey(ev: KeyboardEvent) {
        if (ev.type === 'keydown') downTime = Date.now()
        const timeHeld = ev.type === 'keyup' ? Date.now() - downTime : Infinity
        if (timeHeld > 60) console.log(`${ev.key}, ${ev.type}`)
    }

    function logMouse(ev: MouseEvent) {

        const { offsetX: x, offsetY: y } = ev
        console.log(`x: ${x}, y: ${y}`)
    }

    canvas.addEventListener('click', ev => logMouse(ev))
    window.addEventListener('keydown', ev => logKey(ev))
    window.addEventListener('keyup', ev => logKey(ev))
}

export function init(propObj: CanvasAndWindow) {
    fixCanvas(propObj)
    attachInputListeners(propObj)
}

