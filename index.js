import RL_train from './lib/RL_Train.js';
import { rl_options } from './constants.js';

const rl = new RL_train();
//rl.train(10000);

const next = document.getElementById('next');
const next100 = document.getElementById('next100');
const next1000 = document.getElementById('next1000');

const exploration = document.getElementById('exploration');
const exploration_label = document.querySelector('label[for=exploration]');
const learning_rate = document.getElementById('learning_rate');
const learning_rate_label = document.querySelector('label[for=learning_rate]');
const reward_decay = document.getElementById('reward_decay');
const reward_decay_label = document.querySelector('label[for=reward_decay]');

exploration_label.innerHTML = `Exploration: ${exploration.value}  `;
learning_rate_label.innerHTML = `Learning Rate: ${learning_rate.value}  `;
reward_decay_label.innerHTML = `Reward Decay: ${reward_decay.value}  `;

next.addEventListener('click', () => rl.train(1));
next100.addEventListener('click', () => rl.train(100));
next1000.addEventListener('click', () => rl.train(1000));

exploration.addEventListener('input', () => {
  exploration_label.innerHTML = `Exploration: ${exploration.value}  `;
  rl_options.exploration = exploration.value;
});

learning_rate.addEventListener('input', () => {
  learning_rate_label.innerHTML = `Learning Rate: ${learning_rate.value}  `;
  rl_options.learning_rate = learning_rate.value;
});

reward_decay.addEventListener('input', () => {
  reward_decay_label.innerHTML = `Reward Decay: ${reward_decay.value}  `;
  rl_options.reward_decay = reward_decay.value;
});
