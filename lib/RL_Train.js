import {
  calculateCellSize,
  rl_options,
  simpleCellColors
} from './../constants.js';
import Board from './Board.js';

export default class RL_train {
  constructor() {
    this.gridSize = 10;
    this.offset = 100;
    this.board = null;
    this.rocks = null;
    this.policy = [];
    this.bestPolicy = [];

    this.init();
    window.addEventListener('keyup', e => this.setupKeys(e));
  }

  init() {
    const cellSize = calculateCellSize(this.gridSize, this.offset);
    const rocks_1 = [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 7]];
    const rocks_2 = [[2, 8], [2, 9], [4, 0], [4, 1], [4, 2], [4, 4], [4, 5]];
    const rocks_3 = [[4, 6], [4, 7], [4, 8], [4, 9], [6, 0], [6, 1], [6, 2]];
    const rocks_4 = [[6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 9], [8, 0]];
    const rocks_5 = [[8, 1], [8, 2], [8, 4], [8, 5], [8, 7], [8, 7], [8, 8]];

    this.rocks = [...rocks_1, ...rocks_2, ...rocks_3, ...rocks_4, ...rocks_5];

    this.board = new Board(
      this.gridSize,
      this.gridSize,
      this.offset,
      this.offset,
      cellSize
    );

    this.setupRocks();
    this.board.setCellAsGoal(9, 5);
    this.board.draw();

    return this;
  }

  setupRocks() {
    this.rocks.forEach(rock => this.board.setCellAsRock(...rock));
    this.board.draw();
  }

  setupKeys(event) {
    if (event.code === 'ArrowRight') this.board.right();
    if (event.code === 'ArrowLeft') this.board.left();
    if (event.code === 'ArrowUp') this.board.up();
    if (event.code === 'ArrowDown') this.board.down();
  }

  next() {
    let value;
    let done;
    let reward;
    let nextState;
    let q_new;

    const currentCell = this.board.selectedCell;
    this.policy.push(this.board.selected); // keep track of indexes

    const { action: nextAction, qValue: q_old } = currentCell.nextAction(
      rl_options.exploration
    );
    const nextCell = this.board[nextAction]();

    if (nextCell === null || nextCell.isRock) {
      done = true;
      reward = rl_options.reward_illegal_move;
      q_new = reward;
    } else if (nextCell.isGoal) {
      done = true;
      reward = rl_options.reward_goal;
      q_new = reward;
      this.policy.push(this.board.selected); // we will not visit again
    } else {
      done = false;
      reward = rl_options.reward_normal_move;
      q_new = reward + rl_options.reward_decay * nextCell.maxQ();
    }

    currentCell.qValues[nextAction] =
      (1 - rl_options.learning_rate) * q_old + rl_options.learning_rate * q_new;

    value = {
      old_state: currentCell,
      new_state: nextCell,
      reward,
      policy: this.policy
    };

    this.board.draw();
    this.board.drawPolicy(this.policy, simpleCellColors.policy, 3);
    this.board.drawPolicy(this.bestPolicy, simpleCellColors.bestPolicy, 5);
    return { value, done };
  }

  isBestPolicy(policy) {
    const lastElementKey = policy[policy.length - 1];
    const lastElement = this.board.cells.get(lastElementKey);
    if (
      lastElement.isGoal &&
      (this.bestPolicy.length > this.policy.length ||
        this.bestPolicy.length === 0)
    ) {
      this.bestPolicy = this.policy;
      console.log('New best policy: with length', this.bestPolicy.length);
    }
  }

  iteration() {
    let result;
    do {
      result = this.next();
    } while (!result.done);
    this.isBestPolicy(this.policy);
    this.board.setSelectedCell(0, 0);
    this.policy = [];
    return result;
  }

  train(iterations) {
    if (iterations > 0) {
      window.requestAnimationFrame(() => this.train(iterations - 1));
      this.iteration();
    }
  }
}
