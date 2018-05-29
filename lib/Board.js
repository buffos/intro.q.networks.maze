import {
  SCROLL_BAR_WIDTH,
  simpleCellColors,
  FORM_TOP_HEIGHT
} from './../constants.js';
import GridCell from './GridCell.js';

export default class Board {
  constructor(x = 10, y = 10, offsetX = 0, offsetY = 0, size = 50) {
    this.width = window.innerWidth - SCROLL_BAR_WIDTH;
    this.height = window.innerHeight - SCROLL_BAR_WIDTH - FORM_TOP_HEIGHT;

    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.cellsX = x;
    this.cellsY = y;
    this.size = size;
    this.cells = new Map();
    this.selected = null;
    this.selectedCell = null;

    this.initCanvas();
    this.createCells();
    this.setSizeCanvas();
    this.fillCanvas(simpleCellColors.background);

    this.drawCells();
    this.setSelectedCell(0, 0);
  }

  //#region canvas
  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
  }

  fillCanvas(color) {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  setSizeCanvas() {
    this.width = window.innerWidth - SCROLL_BAR_WIDTH;
    this.height = window.innerHeight - SCROLL_BAR_WIDTH - FORM_TOP_HEIGHT;
    this.canvas.width = `${this.width}`;
    this.canvas.height = `${this.height}`;
    this.fillCanvas(simpleCellColors.background);
    this.drawCells();
  }
  //#endregion

  draw() {
    this.fillCanvas(simpleCellColors.background);
    this.drawCells();
  }

  drawCells() {
    this.cells.forEach(cell => cell.draw());
  }

  drawPolicy(policy, color, lineWidth) {
    if (!policy || policy.length < 2) return; // need at least 2 points to draw a line

    policy.forEach((key, index) => {
      if (index === policy.length - 1) return;
      const point1 = this.cells.get(key).center();
      const nextKey = policy[index + 1];
      const point2 = this.cells.get(nextKey).center();
      this.context.beginPath();
      this.context.strokeStyle = color;
      this.context.lineWidth = lineWidth;
      this.context.moveTo(...point1);
      this.context.lineTo(...point2);
      this.context.stroke();
    });
  }

  createCells() {
    for (let i = 0; i < this.cellsX; i++)
      for (let j = 0; j < this.cellsY; j++) {
        const key = `${i},${j}`;
        const position = {
          x: this.offsetX + i * this.size,
          y: this.offsetY + j * this.size
        };

        this.cells.set(
          key,
          new GridCell(this.size, position, simpleCellColors, this.context)
        );
      }
  }

  selectRandomCell() {
    const i = Math.floor(Math.random() * this.cellsX);
    const j = Math.floor(Math.random() * this.cellsY);

    return this.setSelectedCell(i, j);
  }

  //#region set cells
  setSelectedCell(i, j) {
    // first deselect old key
    if (this.selected) this.cells.get(this.selected).selected = false;
    // now select the new key
    const key = `${i},${j}`;
    this.selected = key;
    const selectedCell = this.cells.get(key);
    selectedCell.selected = true;
    selectedCell.draw();
    this.selectedCell = selectedCell;
    return selectedCell;
  }

  setCellAsRock(i, j) {
    const key = `${i},${j}`;
    const newCell = this.cells.get(key);
    newCell.isRock = true;
  }

  setCellAsGoal(i, j) {
    const key = `${i},${j}`;
    const newCell = this.cells.get(key);
    newCell.isGoal = true;
  }
  //#endregion

  //#region handle moves

  selectedIndex() {
    const indexes = this.selected.split(',');
    const i = parseInt(indexes[0]);
    const j = parseInt(indexes[1]);
    return [i, j];
  }

  left() {
    if (!this.selected) return null;
    // find and select new cell
    const [i, j] = this.selectedIndex();
    if (i === 0) return null;
    // deselect previous cell
    this.selectedCell.selected = false;
    // select new cell and draw
    this.setSelectedCell(i - 1, j);
    this.draw();
    return this.selectedCell;
  }

  right() {
    if (!this.selected) return;
    // find and select new cell
    const [i, j] = this.selectedIndex();
    if (i === this.cellsX - 1) return null;
    // deselect previous cell
    this.selectedCell.selected = false;
    // select new cell and draw
    this.setSelectedCell(i + 1, j);
    this.draw();
    return this.selectedCell;
  }

  up() {
    if (!this.selected) return;
    // find and select new cell
    const [i, j] = this.selectedIndex();
    if (j === 0) return null;
    // deselect previous cell
    this.selectedCell.selected = false;
    // select new cell and draw
    this.setSelectedCell(i, j - 1);
    this.draw();
    return this.selectedCell;
  }

  down() {
    if (!this.selected) return;
    // find and select new cell
    const [i, j] = this.selectedIndex();
    if (j === this.cellsY - 1) return null;
    // deselect previous cell
    this.selectedCell.selected = false;
    // select new cell and draw
    this.setSelectedCell(i, j + 1);
    this.draw();
    return this.selectedCell;
  }
  //#endregion
}
