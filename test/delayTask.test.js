const PAQ = require('../lib');
const paq = new PAQ();

test('Delay task test', (done) => {
  const delayTask = (n) => {
    for (let i = 0; i < n; i++) {
      paq.addTask({ delay: 1000 * i }, () => {
        console.log('Step', i, 'sync');
        (i === n - 1) && done();
        return i;
      });
    }
  };
  
  delayTask(5);
}, 11000);

