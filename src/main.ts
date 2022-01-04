import { canvasDimDebugString, initDebug } from './components/debugBox'
import './style.css'
import { CanvasAndWindow } from './types/types'
import { init } from './utils/helpers'

const app = document.querySelector('#app') as HTMLDivElement

app.innerHTML = `
  <h1>Hello Vite!</h1>
`
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const canvasWindowObj: CanvasAndWindow = { canvas, window }

init(canvasWindowObj)

const context = canvas.getContext('2d') as CanvasRenderingContext2D

const addDebug = initDebug(document.getElementById('debug') as HTMLDivElement)
addDebug(canvasDimDebugString(canvasWindowObj))

type circleArgs = [x: number, y: number, radius: number, startAngle: number, endAngle: number]

enum Axis { Horizontal, Vertical }

class Animate {
  private static potentialPositions(obj, selectedAxis: Axis) {
    let prop
    selectedAxis === Axis.Horizontal ? prop = 'width' : prop = 'height'
    return (canvas[prop] - obj[prop])
  }
  static randomPosition(selectedAxis: Axis) {

  }
}

class Circle extends Animate {
  constructor(
    public x: number = 100,
    public y: number = 100,
    public radius: number = 100,
    public startAngle: number = 0,
    public endAngle: number = 2 * Math.PI
  ) {
    super()

  }
}
