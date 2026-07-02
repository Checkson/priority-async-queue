const PAQ = require('../lib');

test('resume fills all available executing slots', async () => {
  const paq = new PAQ(3);
  paq.pause();

  for (let i = 0; i < 5; i++) {
    paq.addTask(() => new Promise((resolve) => setTimeout(resolve, 100)));
  }

  expect(paq.waitingQueue.length()).toBe(5);
  expect(paq.executingQueue.length).toBe(0);

  paq.resume();
  await paq.sleep(10);

  expect(paq.executingQueue.length).toBe(3);
  expect(paq.waitingQueue.length()).toBe(2);
});

test('pause keeps new tasks in waiting queue', async () => {
  const paq = new PAQ();
  paq.pause();

  paq.addTask(() => 'done');
  expect(paq.waitingQueue.length()).toBe(1);
  expect(paq.executingQueue.length).toBe(0);
});
