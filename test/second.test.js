import Now from '../src/index';

test('expect to return second', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.second()).toBe(20);
});
