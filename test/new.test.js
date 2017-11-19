import Now from '../src/index';

test('create by none args', () => {
  const now = new Now();
  const compare = new Date();
  const result = Math.abs(now.date - compare) <= 1;
  expect(result).toBeTruthy();
});

test('create by one arg', () => {
  const now = new Now("October 13, 2017 11:13:00");
  const compare = new Date("October 13, 2017 11:13:00");
  expect(now.value).toBe(+compare);
});

test('create by two args', () => {
  const now = new Now(2017, 10);
  const compare = new Date(2017, 10);
  expect(now.value).toBe(+compare);
});

test('create by three args', () => {
  const now = new Now(2017, 10, 10);
  const compare = new Date(2017, 10, 10);
  expect(now.value).toBe(+compare);
});

test('create by four args', () => {
  const now = new Now(2017, 10, 10, 10);
  const compare = new Date(2017, 10, 10, 10);
  expect(now.value).toBe(+compare);
});

test('create by five args', () => {
  const now = new Now(2017, 10, 10, 10, 10);
  const compare = new Date(2017, 10, 10, 10, 10);
  expect(now.value).toBe(+compare);
});

test('create by six args', () => {
  const now = new Now(2017, 10, 10, 10, 10, 10);
  const compare = new Date(2017, 10, 10, 10, 10, 10);
  expect(now.value).toBe(+compare);
});

test('create by seven args', () => {
  const now = new Now(2017, 10, 10, 10, 10, 10, 100);
  const compare = new Date(2017, 10, 10, 10, 10, 10, 100);
  expect(now.value).toBe(+compare);
});
