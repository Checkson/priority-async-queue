const PAQ = require('../lib');

test('Priority tasks execute in weight order', async () => {
  const paq = new PAQ();
  paq.pause();

  const order = [];
  const priorities = [
    { priority: 'normal', id: 'n1' },
    { priority: 'normal', id: 'n2' },
    { priority: 'urgent', id: 'u' },
    { priority: 'high', id: 'h' },
    { priority: 'low', id: 'l' }
  ];

  priorities.forEach(({ priority, id }) => {
    paq.addTask({ priority, id }, () => {
      order.push(id);
    });
  });

  paq.resume();
  await paq.sleep(50);

  expect(order).toEqual(['u', 'h', 'n1', 'n2', 'l']);
});

test('Same priority tasks keep FIFO order', async () => {
  const paq = new PAQ();
  paq.pause();

  const order = [];
  ['a', 'b', 'c'].forEach((id) => {
    paq.addTask({ priority: 'high', id }, () => {
      order.push(id);
    });
  });

  paq.resume();
  await paq.sleep(50);

  expect(order).toEqual(['a', 'b', 'c']);
});
