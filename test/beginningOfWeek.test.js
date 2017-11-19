import Now from '../src/index';

test('return beginningOfWeek default', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.beginningOfWeek()).toBe('2017-10-29 00:00:00');
});

test('beginningOfWeek if firstDayMonday if true', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  now.firstDayMonday = true;
  expect(now.beginningOfWeek()).toBe('2017-10-23 00:00:00');
});
