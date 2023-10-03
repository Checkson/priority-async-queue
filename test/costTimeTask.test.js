const PAQ = require('../lib');
const paq = new PAQ();

test('Cost time task test', (done) => {
  paq.addTask(() => paq.sleep(1000)).on('completed', (options) => {
    console.log(`The task waiting time is ${options.startTime - options.createTime}ms`);
    console.log(`The task execution time is ${options.endTime - options.startTime}ms`);
  });

  paq.sleep(1500).then(() => {
    done();
  });
});
