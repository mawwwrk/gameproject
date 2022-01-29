export class DisplayGrid {
  constructor(
    gridProperties = {
      gridHeight: 16,
      gridWidth: 16,
      canvasHeight: 480,
      canvasWidth: 640,
    }
  ) {
    Object.assign(this, gridProperties);
  }

  setProperties(props) {
    let { gridHeight, gridWidth, canvasHeight, canvasWidth } = props;
    Object.assign(this, {
      gridHeight,
      gridWidth,
      canvasHeight,
      canvasWidth,
    });
  }
  gridDimensions() {
    let numRows = this.canvasWidth / this.gridWidth,
      numColumns = this.canvasHeight / this.gridHeight;
    return { numRows, numColumns };
  }
  buildPositionsArray(n, prop) {
    let positionsArray = [];
    for (let i = 0; i < n; i++) {
      positionsArray.push(i * prop);
    }
    return positionsArray;
  }
  createGridprops() {
    let { numColumns, numRows } = this.gridDimensions(),
      gridProps = [];
    let [yPosArray, xPosArray] = [
      [numColumns, this.gridWidth],
      [numRows, this.gridHeight],
    ].map((arr) => this.buildPositionsArray(...arr));

    for (let yPos of yPosArray) {
      for (let xPos of xPosArray) {
        gridProps.push({
          x: xPos,
          y: yPos,
          width: this.gridWidth,
          height: this.gridHeight,
        });
      }
    }
    return gridProps;
  }
}
