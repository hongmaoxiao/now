import Now from '../src/index';

test('expect to return locale', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  const compared = new Date(2017, 8, 29, 17, 35, 20, 100);
  expect(now.isAfter(compared)).toBe(true);
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

test('expect to leap year', () => {
  let now = new Now(2010, 0, 1);
  expect(!now.isLeapYear()).toBeTruthy();

  now = new Now(2100, 0, 1);
  expect(!now.isLeapYear()).toBeTruthy();

  now = new Now(2008, 0, 1);
  expect(now.isLeapYear()).toBeTruthy();

  now = new Now(2000, 0, 1);
  expect(now.isLeapYear()).toBeTruthy();
});

test('expect to toArray', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  const output = [2017, 9, 29, 17, 35, 20, 100];

  expect(now.toArray()).toEqual(output);
});

test('expect to toObject', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  const output = {
      year: 2017,
      month: 9,
      day: 29,
      hour: 17,
      minute: 35,
      second: 20,
      milliSecond: 100
    };

  expect(now.toObject()).toEqual(output);
});
