import Now from '../src/index';

test('timezone format', () => {
  expect(new Now().utcOffset(60).format('ZZ')).toBe('+0100');
  expect(new Now().utcOffset(90).format('ZZ')).toBe('+0130');
  expect(new Now().utcOffset(120).format('ZZ')).toBe('+0200');
  expect(new Now().utcOffset(-60).format('ZZ')).toBe('-0100');
  expect(new Now().utcOffset(-90).format('ZZ')).toBe('-0130');
  expect(new Now().utcOffset(-120).format('ZZ')).toBe('-0200');
});

test('utc and local', () => {
  const now = new Now(Date.UTC(2011, 1, 2, 3, 4, 5, 6));
  let offset;
  let expected;

  // utc
  now.utc();
  expect(now.day()).toBe(2);
  expect(now.weekDay()).toBe(3);
  expect(now.hour()).toBe(3);

  // local
  now.local();
  if (now.utcOffset() < -180) {
    expect(now.day()).toBe(1);
    expect(now.weekDay()).toBe(2);
  } else {
    expect(now.day()).toBe(2);
    expect(now.weekDay()).toBe(3);
    expect(now.weekDay()).toBe(3);
  }

  offset = Math.floor(now.utcOffset() / 60);
  expected = (24 + 3 + offset) % 24;
  expect(now.hour()).toBe(expected);
});
