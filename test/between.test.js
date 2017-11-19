import Now from '../src/index';

test('return true if the date between two compared days', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  const compared1 = new Date(2017, 8, 29, 17, 35, 20, 100);
  const compared2 = new Date(2017, 10, 29, 17, 35, 20, 100);
  expect(now.between(compared1, compared2)).toBeTruthy();
});

test('return false if the date not between two compared days', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  const compared1 = new Date(2017, 10, 29, 17, 35, 20, 100);
  const compared2 = new Date(2017, 11, 29, 17, 35, 20, 100);
  expect(now.between(compared1, compared2)).toBe(false);
});
