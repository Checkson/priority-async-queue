const PAQ = require('../lib');
const paq = new PAQ();

test('Simple task test', () => {
  paq.addTask((ctx, options) => {
    expect(ctx).toEqual(paq);
    console.log('This is a simple task!');
  });
});
