import Now from '../src/index';

test('return the time elapsed since specify date', () => {
  const now = new Now();
  const compare = new Date(2017, 9, 29, 17, 35, 20, 100);
  const cb = () => {
    const recent = new Date();
    const since = now.since(compare);
    const result = Math.abs(since - (recent - compare)) <= 1;
    expect(result).toBeTruthy();
  }
  const timer = (cb, time) => {
    setTimeout(() => {
      cb && cb();
    }, time)
  };
  timer(cb, 100);
});

test('return the time elapsed between two arguments', () => {
  const now = new Now();
  const date1 = new Date(2017, 9, 29, 17, 35, 20, 100);
  const date2 = new Date(2017, 10, 29, 17, 35, 20, 100);
  const result = date2 - date1;
  expect(now.since(date1, date2)).toBe(result);
});

