import Now from '../src/index';

test('return endOfDay default', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.endOfDay()).toBe('2017-10-29 23:59:59.999');
});
