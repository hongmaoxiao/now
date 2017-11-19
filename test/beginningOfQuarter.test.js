import Now from '../src/index';

test('return beginningOfQuarter', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.beginningOfQuarter()).toBe('2017-10-01 00:00:00');
});
