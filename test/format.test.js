import Now from '../src/index';

test('expect to return format', () => {
  const now = new Now(2017, 10, 7, 17, 35, 20, 100);
  const output = now.format('dddd');
  expect(output).toBe('星期二');
});

test('expect to return format1', () => {
  const now = new Now(2017, 10, 7, 17, 35, 20, 100);
  const output = now.format('MMM Do YY');
  console.log('output: ', output);
  expect(output).toBe('11月 7日 17');
});
