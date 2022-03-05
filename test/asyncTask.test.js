const PAQ = require('../lib');
const paq = new PAQ();

test('Aysnc task test', (done) => {
  const sleep = (ms, order) => {
    return paq.sleep(ms).then(() => {
      console.log(`async task order ${order}`);
    });
  };

  const asyncTask = (n) => {
    for (let i = 1; i <= n; i++) {
      paq.addTask(() => sleep(i * 500, i));
    }
  };

  asyncTask(5);

  paq.sleep(8000).then(() => {
    done();
  });
}, 8000);
