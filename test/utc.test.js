import Now from '../src/index';

test('create UTC by zero arg', () => {
  const now = new Now(2017, 10, 19, 17, 15, 20, 123).UTC();
  const compare = Date.UTC(2017, 10, 19, 17, 15, 20, 123);

  expect(+now).toBe(+compare);
});

test('create UTC by some args', () => {
  const now = new Now(2011, 1, 2, 3, 4, 5, 6).UTC(2017, 10, 19, 17, 15, 20, 123);
  const notEqual = Date.UTC(2011, 1, 2, 3, 4, 5, 6);
  const equal = Date.UTC(2017, 10, 19, 17, 15, 20, 123);

  const isEqual = +now === equal;
  const isNotEqual = +now === notEqual;

  expect(isEqual).toBeTruthy();
  expect(!isNotEqual).toBeTruthy();
});

test('utc and local', () => {
  const now = new Now(2011, 1, 2, 3, 4, 5, 6);
  const utcNow = now.UTC();
  let offset;
  let expected;

  // utc
  utcNow.utc();
  expect(utcNow.day()).toBe(2);
  expect(utcNow.weekDay()).toBe(3);
  expect(utcNow.hour()).toBe(3);

  // local
  utcNow.local();
  if (utcNow.utcOffset() < -180) {
    expect(utcNow.day()).toBe(1);
    expect(utcNow.weekDay()).toBe(2);
  } else {
    expect(utcNow.day()).toBe(2);
    expect(utcNow.weekDay()).toBe(3);
    expect(utcNow.weekDay()).toBe(3);
  }

  offset = Math.floor(utcNow.utcOffset() / 60);
  expected = (24 + 3 + offset) % 24;
  expect(utcNow.hour()).toBe(expected);
});
