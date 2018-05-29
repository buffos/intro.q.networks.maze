import { round } from './../constants.js';

export default class GridCell {
  constructor(size, position, colors, ctx) {
    this.size = size;
    this.position = position;
    this.selected = false;
    this.isRock = false;
    this.isGoal = false;
    this.qValues = {
      left: 0,
      right: 0,
      up: 0,
      down: 0
    };
    this.colors = colors;
    this.ctx = ctx;
  }

  center() {
    return [
      Math.floor(this.position.x + this.size / 2),
      Math.floor(this.position.y + this.size / 2)
    ];
  }

  draw() {
    this.drawFill();
    if (!this.isRock && !this.isGoal) {
      this.drawLines();
      this.drawText();
    }
  }

  drawFill() {
    if (this.isRock) this.ctx.fillStyle = this.colors.backgroundRock;
    if (this.isGoal) this.ctx.fillStyle = this.colors.backgroundGoal;
    if (!(this.isGoal || this.isRock))
      this.ctx.fillStyle = this.colors.background;

    this.ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
    this.ctx.strokeStyle = this.selected
      ? this.colors.selected
      : this.colors.outline;
    this.ctx.lineWidth = this.selected ? 5 : 1;
    this.ctx.strokeRect(this.position.x, this.position.y, this.size, this.size);
  }

  drawLines() {
    this.ctx.beginPath();
    this.strokeStyle = this.colors.outline;
    this.ctx.moveTo(this.position.x, this.position.y);
    this.ctx.lineTo(this.position.x + this.size, this.position.y + this.size);
    this.ctx.moveTo(this.position.x + this.size, this.position.y);
    this.ctx.lineTo(this.position.x, this.position.y + this.size);
    this.ctx.stroke();
  }

  drawText() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '15px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      this.qValues.up !== null ? round(this.qValues.up, 2) : '',
      this.position.x + this.size / 2,
      this.position.y + this.size / 4
    );
    this.ctx.fillText(
      this.qValues.down !== null ? round(this.qValues.down, 2) : '',
      this.position.x + this.size / 2,
      this.position.y + this.size - this.size / 8
    );
    this.ctx.fillText(
      this.qValues.left !== null ? round(this.qValues.left, 2) : '',
      this.position.x + this.size / 6,
      this.position.y + this.size / 2 + 5
    );
    this.ctx.fillText(
      this.qValues.right !== null ? round(this.qValues.right, 2) : '',
      this.position.x + this.size - this.size / 6,
      this.position.y + this.size / 2 + 5
    );
  }

  maxQ() {
    let bestQ = -10000000000;
    for (const action in this.qValues) {
      if (this.qValues[action] > bestQ) {
        bestQ = this.qValues[action];
      }
    }
    return bestQ;
  }

  nextAction(explorationPercent) {
    const probability = Math.random();
    const explore = probability < explorationPercent;
    if (explore) {
      const actions = ['left', 'right', 'up', 'down'];
      const actionIndex = Math.floor(Math.random() * 4);
      const selectedAction = actions[actionIndex];
      return { action: selectedAction, qValue: this.qValues[selectedAction] };
    } else {
      const bestResult = { action: '', qValue: -10000000000 };
      for (const action in this.qValues) {
        if (this.qValues[action] > bestResult.qValue) {
          bestResult.action = action;
          bestResult.qValue = this.qValues[action];
        }
      }
      return bestResult;
    }
  }
}
