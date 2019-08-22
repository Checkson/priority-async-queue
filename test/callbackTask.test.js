const PAQ = require('../lib');
const paq = new PAQ();

test('Callback task test', () => {
  const callbackTask = (n) => {
    for (let i = 0; i < n; i++) {
      paq.addTask({
        id: i,
        start: (ctx, options) => {
          console.log('start running task id is', options.id);
        },
        completed: (ctx, res) => {
          console.log('complete, result is', res);
        },
        failed: (ctx, err) => {
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
});
