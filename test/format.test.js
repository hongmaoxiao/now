import Now from '../src/index';

test('k and kk', () => {
  let now = new Now(2017, 10, 7, 1, 23, 45, 100);
  let output = now.format('k');
  expect(output).toBe('1');

  now = new Now(2017, 10, 7, 12, 34, 56, 100);
  output = now.format('k');
  expect(output).toBe('12');

  now = new Now(2017, 10, 7, 1, 23, 45, 100);
  output = now.format('kk');
  expect(output).toBe('01');

  now = new Now(2017, 10, 7, 12, 34, 56, 100);
  output = now.format('kk');
  expect(output).toBe('12');

  now = new Now(2017, 10, 7, 0, 34, 56, 100);
  output = now.format('kk');
  expect(output).toBe('24');

  now = new Now(2017, 10, 7, 0, 0, 0, 100);
  output = now.format('kk');
  expect(output).toBe('24');
});

test('Hmm and Hmmss', () => {
  let now = new Now(2017, 10, 7, 12, 34, 56, 100);
  let output = now.format('Hmm');
  expect(output).toBe('1234');

  now = new Now(2017, 10, 7, 1, 34, 56, 100);
  output = now.format('Hmm');
  expect(output).toBe('134');

  now = new Now(2017, 10, 7, 13, 34, 56, 100);
  output = now.format('Hmm');
  expect(output).toBe('1334');

  now = new Now(2017, 10, 7, 12, 34, 56, 100);
  output = now.format('Hmmss');
  expect(output).toBe('123456');

  now = new Now(2017, 10, 7, 1, 34, 56, 100);
  output = now.format('Hmmss');
  expect(output).toBe('13456');

  now = new Now(2017, 10, 7, 8, 34, 56, 100);
  output = now.format('Hmmss');
  expect(output).toBe('83456');

  now = new Now(2017, 10, 7, 18, 34, 56, 100);
  output = now.format('Hmmss');
  expect(output).toBe('183456');
});
