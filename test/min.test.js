import Now from '../src/index';

test('return the minimum date', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  const compare1 = new Date(2017, 1, 20, 17, 35, 20, 100);
  const compare2 = new Date(2017, 10, 29, 17, 35, 20, 100);
  expect(now.min(compare1, compare2)).toBe(compare1);
});

