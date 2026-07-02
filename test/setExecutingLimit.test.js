const PAQ = require('../lib');

test('setExcutingLimit increases concurrent execution', async () => {
  const paq = new PAQ(1);

  paq.addTask(() => new Promise((resolve) => setTimeout(resolve, 100)));
  paq.addTask(() => new Promise((resolve) => setTimeout(resolve, 100)));
  paq.addTask(() => new Promise((resolve) => setTimeout(resolve, 100)));

  await paq.sleep(10);
  expect(paq.executingQueue.length).toBe(1);
  expect(paq.waitingQueue.length()).toBe(2);

  paq.setExcutingLimit(3);
  await paq.sleep(10);

  expect(paq.executingQueue.length).toBe(3);
  expect(paq.waitingQueue.length()).toBe(0);
});

test('setExecutingLimit alias works', () => {
  const paq = new PAQ(1);
  paq.setExecutingLimit(2);
  expect(paq.executeLimit).toBe(2);
});

test('invalid executeLimit is rejected', () => {
  expect(() => new PAQ(0)).toThrow('executeLimit must be an integer greater than or equal to 1!');
  expect(() => new PAQ(-1)).toThrow('executeLimit must be an integer greater than or equal to 1!');
  expect(() => new PAQ(1.5)).toThrow('executeLimit must be an integer greater than or equal to 1!');
});
