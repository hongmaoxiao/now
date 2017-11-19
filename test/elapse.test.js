import Now from '../src/index';

test('return elapse time by now', () => {
  const now = new Now();
  const pass = 500;

  const cb = () => {
    expect(now.elapse()).toBe(pass);
  }
  const timer = (cb, time) => {
    setTimeout(() => {
      cb && cb();
    }, time)
  };

  timer(cb, pass);
});

