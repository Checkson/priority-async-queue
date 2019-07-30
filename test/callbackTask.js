const PAQ = require('../lib');
const paq = new PAQ();

const callbackTask = (n) => {
  for (let i = 0; i < n; i++) {
    paq.addTask({
        success: (res) => {
          console.log('Success, result is ', res);
        },
        error: (err) => {
          console.log(err);
        }
      }, () => {
        if (i < n / 2) {
          throw new Error('i is too small!');
        }
        return i;
      }
    );
  }
};

callbackTask(5);
