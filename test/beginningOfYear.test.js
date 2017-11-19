import Now from '../src/index';

test('return beginningOfMonth default', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.beginningOfMonth()).toBe('2017-10-01 00:00:00');
});
