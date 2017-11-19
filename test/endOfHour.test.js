import Now from '../src/index';

test('return endOfHour default', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.endOfHour()).toBe('2017-10-29 17:59:59.999');
});
