import Now from '../src/index';

test('endOfWeek if firstDayMonday if false', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.endOfWeek()).toBe('2017-11-04 23:59:59.999');
});

test('beginningOfWeek if firstDayMonday if true', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  now.firstDayMonday = true;
  expect(now.endOfWeek()).toBe('2017-10-29 23:59:59.999');
});
