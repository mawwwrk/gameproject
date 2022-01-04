export const initDebug = (target: HTMLDivElement) => function (args: string | string[]) {
    let debugStrings: string[] = []
    typeof args === 'string' ? debugStrings.push(args) : debugStrings = args
    const pDStrings = debugStrings.map((l) => `<p>${l}</p>`)

    // const lines = line: string => `<p>${line}</p>`
    const iDiv = document.createElement('div')
    iDiv.innerHTML = pDStrings.join("\n")

    target.append(iDiv)
}

export const canvasDimDebugString = ({ canvas }: { canvas: HTMLCanvasElement }) => [
    `<b>canvas height (att/css):</b> ${canvas.height} / ${getComputedStyle(canvas).height}`,
    `<b>canvas width (att/css):</b> ${canvas.width} / ${getComputedStyle(canvas).width}`
]

