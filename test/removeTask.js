const PAQ = require('../lib');
const paq = new PAQ();

const removeTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask({
      id: i,
      remove: (options) => {
        console.log('remove task id is', options.id);
      }
    }, () => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Step', i, 'async');
          resolve(i);
        }, i * 1000);
      });
    });
  }
  console.log(paq.removeTask(3));
  console.log(paq.removeTask(5));
};

removeTask(5);
