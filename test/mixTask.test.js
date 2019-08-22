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

const syncTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask(() => {
      console.log('Step', i, 'sync');
      return i;
    });
  }
};

test('Mix task test', () => {
  const mixTask = (n) => {
    asyncTask(n);
    syncTask(n);
    asyncTask(n);
  };

  mixTask(2);
}, 11000);
