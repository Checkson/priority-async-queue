const PAQ = require('../lib');
const paq = new PAQ();

test('Priority task test', (done) => {
  const priorityTask = (n) => {
    for (let i = 0; i < n; i++) {
      paq.addTask({ priority: i === n - 1 ? 'high' : 'normal' }, () => {
        return new Promise(resolve => {
          setTimeout(() => {
            console.log('Step', i, 'async');
            resolve(i);
            (i === n - 2) && done();
          }, i * 1000);
        });
      });
    }
  };

  priorityTask(5);
}, 11000);
