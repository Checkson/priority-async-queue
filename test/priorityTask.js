const PAQ = require('../lib');
const paq = new PAQ();

const priorityTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask({ priority: i === n - 1 ? 'high' : 'normal' }, () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Step', i, 'async');
          resolve(i);
        }, i * 1000);
      });
    });
  }
};

priorityTask(5);
