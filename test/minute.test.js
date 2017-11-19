import Now from '../src/index';

test('expect to return minute', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.minute()).toBe(35);
});
