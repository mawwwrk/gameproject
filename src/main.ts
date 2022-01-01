import './style.css'
import { fixCanvas } from './utils/helpers'

const app = document.querySelector('#app') as HTMLDivElement

app.innerHTML = `
  <h1>Hello Vite!</h1>
`
const canvas = document.getElementById('canvas') as HTMLCanvasElement
fixCanvas({ c: canvas, w: window })

const ctxt = canvas.getContext('2d') as CanvasRenderingContext2D






ctxt.fillRect(100, 100, 100, 100)

ctxt.beginPath()
ctxt.arc(100, 50, 12, 0, 1.2 * Math.PI)
ctxt.stroke()

// // // canvas
// // // ctx
// // loadScript()
