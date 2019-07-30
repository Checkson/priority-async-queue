const PAQ = require('../lib');
const paq = new PAQ();

const delayTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask({delay: 1000 * i}, () => {
      console.log('Step', i, 'sync');
      return i;
    });
  }
};

delayTask(5);
