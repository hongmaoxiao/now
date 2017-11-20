import Now from '../src/index';

test('return elapse time from specific time', () => {
  const now = new Now();
  const compare = new Date(+now - 100);
  expect(now.elapse(compare)).toBe('a few seconds ago');
});

test('elapse receive Now instance', () => {
  const now = new Now();
  const compare = new Now(+now - 100);
  expect(now.elapse(compare)).toBe('a few seconds ago');
});
