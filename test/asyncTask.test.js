const PAQ = require('../lib');
const paq = new PAQ();

test('Aysnc task test', (done) => {
  const asyncTask = (n) => {
    for (let i = 0; i < n; i++) {
      paq.addTask(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            console.log('Step', i, 'async');
            resolve(i);
            (i === n - 1) && done();
          }, i * 1000);
        });
      });
    }
  };

  asyncTask(5);
}, 11000);
