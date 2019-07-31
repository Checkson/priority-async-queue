const PAQ = require('../lib');
const paq = new PAQ();

const callbackTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask({
      id: i,
      start: (options) => {
        console.log('start running task id is', options.id);
      },
      completed: (res) => {
        console.log('complete, result is', res);
      },
      failed: (err) => {
        console.log(err);
      }
    }, () => {
      if (i < n / 2) {
        throw new Error(i + ' is too small!');
      }
      return i;
    });
  }
};

callbackTask(5);
