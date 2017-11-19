import Now from '../src/index';

// today is sunday
test('expect to return sunday if today is sunday', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.sunday()).toBe('2017-10-29 00:00:00');
});

test('expect to return monday if today is sunday', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.monday()).toBe('2017-10-23 00:00:00');
});

test('expect to return tuesday if today is sunday', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.tuesday()).toBe('2017-10-24 00:00:00');
});

test('expect to return wednesday if today is sunday', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.wednesday()).toBe('2017-10-25 00:00:00');
});

test('expect to return thursday if today is sunday', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.thursday()).toBe('2017-10-26 00:00:00');
});

test('expect to return friday if today is sunday', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.friday()).toBe('2017-10-27 00:00:00');
});

test('expect to return saturday if today is sunday', () => {
  const now = new Now(2017, 9, 29, 17, 35, 20, 100);
  expect(now.saturday()).toBe('2017-10-28 00:00:00');
});

// today is not sunday
test('expect to return sunday if today is not sunday', () => {
  const now = new Now(2017, 9, 30, 17, 35, 20, 100);
  expect(now.sunday()).toBe('2017-11-05 00:00:00');
});

test('expect to return monday if today is not sunday', () => {
  const now = new Now(2017, 9, 30, 17, 35, 20, 100);
  expect(now.monday()).toBe('2017-10-30 00:00:00');
});

test('expect to return tuesday if today is not sunday', () => {
  const now = new Now(2017, 9, 30, 17, 35, 20, 100);
  expect(now.tuesday()).toBe('2017-10-31 00:00:00');
});

test('expect to return wednesday if today is not sunday', () => {
  const now = new Now(2017, 9, 30, 17, 35, 20, 100);
  expect(now.wednesday()).toBe('2017-11-01 00:00:00');
});

test('expect to return thursday if today is not sunday', () => {
  const now = new Now(2017, 9, 30, 17, 35, 20, 100);
  expect(now.thursday()).toBe('2017-11-02 00:00:00');
});

test('expect to return friday if today is not sunday', () => {
  const now = new Now(2017, 9, 30, 17, 35, 20, 100);
  expect(now.friday()).toBe('2017-11-03 00:00:00');
});

test('expect to return saturday if today is not sunday', () => {
  const now = new Now(2017, 9, 30, 17, 35, 20, 100);
  expect(now.saturday()).toBe('2017-11-04 00:00:00');
});
