import Now from '../src/index';

test('endOfMonth which month has 31 dates', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.endOfMonth()).toBe('2017-10-31 23:59:59.999');
});

test('endOfMonth which month has 30 dates', () => {
  const now = new Now(2017, 5, 15, 17, 35, 20, 100);
  expect(now.endOfMonth()).toBe('2017-06-30 23:59:59.999');
});

test('endOfMonth which month has 28 dates', () => {
  const now = new Now(2017, 1, 10, 17, 35, 20, 100);
  expect(now.endOfMonth()).toBe('2017-02-28 23:59:59.999');
});

test('endOfMonth which month has 29 dates', () => {
  const now = new Now(2000, 1, 10, 17, 35, 20, 100);
  expect(now.endOfMonth()).toBe('2000-02-29 23:59:59.999');
});
