const BACKGROUND_COLOR = '#616161';
const BACKGROUND_CELL = '#2E7D32';
const BACKGROUND_ROCK = '#3F51B5';
const BACKGROUND_GOAL = '#FF5722';
const CELL_OUTLINE = '#FFEE58';
const CELL_OUTLINE_SELECTED = '#FF7043';

const POLICY_COLOR = '#f44336';
const BEST_POLICY_COLOR = '#651FFF';

const TEXT_CELL = '#E8F5E9';

const RL_ILLEGAL_MOVE = -1000;
const RL_NORMAL_MOVE = -1;
const RL_GOAL = 1000;
const RL_LEARNING_RATE = 0.01;
const RL_REWARD_DECAY = 0.9;
const RL_GREEDY = 0.1;

export const SCROLL_BAR_WIDTH = 20;
export const FORM_TOP_HEIGHT = 40;

export const simpleCellColors = {
  background: BACKGROUND_CELL,
  backgroundRock: BACKGROUND_ROCK,
  backgroundGoal: BACKGROUND_GOAL,
  outline: CELL_OUTLINE,
  selected: CELL_OUTLINE_SELECTED,
  text: TEXT_CELL,
  policy: POLICY_COLOR,
  bestPolicy: BEST_POLICY_COLOR
};

export const rl_options = {
  reward_illegal_move: RL_ILLEGAL_MOVE,
  reward_normal_move: RL_NORMAL_MOVE,
  reward_goal: RL_GOAL,
  learning_rate: RL_LEARNING_RATE,
  reward_decay: RL_REWARD_DECAY,
  exploration: RL_GREEDY
};

export const calculateCellSize = function(gridSize, offset) {
  const width = Math.min(
    0.8 * (window.innerWidth - SCROLL_BAR_WIDTH),
    0.95 * (window.innerHeight - SCROLL_BAR_WIDTH)
  );
  return parseInt((width - offset) / gridSize);
};

export const round = (number, decimals) =>
  Math.round(number * Math.pow(10, decimals) / Math.pow(10, decimals));
