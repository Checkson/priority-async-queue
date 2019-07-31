const PAQ = require('../lib');
const paq = new PAQ();

const asyncTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Step', i, 'async');
          resolve(i);
        }, i * 1000);
      });
    });
  }
};

asyncTask(5);
