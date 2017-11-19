import Now from '../src/index';

test('expect to return true if now isAfter given date', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  const compared = new Date(2017, 8, 29, 17, 35, 20, 100);
  expect(now.isAfter(compared)).toBeTruthy();
});

