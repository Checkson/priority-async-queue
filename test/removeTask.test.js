const PAQ = require('../lib');
const paq = new PAQ();

test('Remove Task test', (done) => {
  const removeTask = (n) => {
    for (let i = 0; i < n; i++) {
      paq.addTask({
        id: i,
        remove: (ctx, options) => {
          expect(ctx).toBe(paq);
          console.log('remove task id is', options.id);
        }
      }, () => {
        return new Promise(resolve => {
          setTimeout(() => {
            console.log('Step', i, 'async');
            resolve(i);
            (i === n - 1) && done();
          }, i * 1000);
        });
      });
    }
    expect(paq.removeTask(3)).toBeTruthy();
    expect(paq.removeTask(5)).toBeFalsy();
  };

  removeTask(5);
}, 8000);
