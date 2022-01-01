
const dpi = window.devicePixelRatio
function dimFix(el: HTMLCanvasElement): void {
    ['height', 'width'].forEach(prop => {
        const propVal = parseFloat(getComputedStyle(el).getPropertyValue(prop)) * dpi
        el.setAttribute(prop, propVal.toString())
    })
}

export function fixCanvas({ c, w }: { c: HTMLCanvasElement, w: Window }) {
    dimFix(c)
    w.addEventListener('resize', () => {
        dimFix(c)
    }
    )
}
