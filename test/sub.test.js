import Now from '../src/index';

test('return subtract milliSecond value if one argument', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  const compared = new Date(2017, 8, 29, 15, 35, 20, 100);
  const result = now.date - compared;
  expect(now.sub(compared)).toBe(result);
});

test('return subtract milliSeconds value between two arguments if pass two arguments to sub', () => {
  const now = new Now();
  const date1 = new Date(2017, 8, 29, 15, 35, 20, 100);
  const date2 = new Date(2017, 9, 29, 15, 35, 20, 100);
  const result = date1 - date2;
  expect(now.sub(date1, date2)).toBe(result);
});
