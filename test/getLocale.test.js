import Now from '../src/index';

test('expect to return locale', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  const compared = new Date(2017, 8, 29, 17, 35, 20, 100);
  expect(now.after(compared)).toBe(true);
});

test('expect to return day', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  const compared = new Date(2017, 8, 29, 17, 35, 20, 100);
  expect(now.day()).toBe(compared.getDate());
});

test('setDate', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  now.day(10);

  const compared = new Date(2017, 9, 29, 17, 35, 20, 100);
  compared.setDate(10);

  expect(+now).toBe(+compared);
});
