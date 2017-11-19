import Now from '../src/index';

test('return beginningOfDay default', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.beginningOfDay()).toBe('2017-10-29 00:00:00');
});
