const PAQ = require('../lib');
const paq = new PAQ(2);

test('Aysnc task test', (done) => {
  const sleep = (ms, order) => {
    return paq.sleep(ms).then(() => {
      console.log(order);
    });
  }

  paq.addTask(() => sleep(1000, 1));
  paq.addTask(() => sleep(500, 2));
  paq.addTask(() => sleep(300, 3));
  paq.addTask(() => sleep(400, 4));

  paq.sleep(1500).then(() => {
    done();
  });
});
