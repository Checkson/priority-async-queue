const PAQ = require('../lib');

test('event handler errors do not block other listeners', async () => {
  const paq = new PAQ();
  const seen = [];

  paq.on('completed', () => {
    throw new Error('handler boom');
  });
  paq.on('completed', () => {
    seen.push('ok');
  });

  paq.addTask(() => 'done');
  await paq.sleep(10);

  expect(seen).toEqual(['ok']);
});
