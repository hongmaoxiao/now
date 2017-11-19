import Now from '../src/index';

test('return beginningOfHour default', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.beginningOfHour()).toBe('2017-10-29 17:00:00');
});
