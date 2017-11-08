import Now from '../src/index';

// test('Y token', () => {
  // let now = new Now(2010, 1, 1);
  // let output = now.format('Y');
  // expect(output).toBe('2010');

  // now = new Now(-123, 1, 1);
  // output = now.format('Y');
  // expect(output).toBe('-123');

  // now = new Now(12345, 1, 1);
  // output = now.format('Y');
  // expect(output).toBe('+12345');

  // now = new Now(0, 1, 1);
  // output = now.format('Y');
  // expect(output).toBe('1900');

  // now = new Now(1, 1, 1);
  // output = now.format('Y');
  // expect(output).toBe('1901');

  // now = new Now(95, 1, 1);
  // output = now.format('Y');
  // expect(output).toBe('1995');

  // now = new Now(9999, 1, 1);
  // output = now.format('Y');
  // expect(output).toBe('9999');

  // now = new Now(10000, 1, 1);
  // output = now.format('Y');
  // expect(output).toBe('+10000');
// });

// test('k and kk', () => {
  // let now = new Now(2017, 10, 7, 1, 23, 45, 100);
  // let output = now.format('k');
  // expect(output).toBe('1');

  // now = new Now(2017, 10, 7, 12, 34, 56, 100);
  // output = now.format('k');
  // expect(output).toBe('12');

  // now = new Now(2017, 10, 7, 1, 23, 45, 100);
  // output = now.format('kk');
  // expect(output).toBe('01');

  // now = new Now(2017, 10, 7, 12, 34, 56, 100);
  // output = now.format('kk');
  // expect(output).toBe('12');

  // now = new Now(2017, 10, 7, 0, 34, 56, 100);
  // output = now.format('kk');
  // expect(output).toBe('24');

  // now = new Now(2017, 10, 7, 0, 0, 0, 100);
  // output = now.format('kk');
  // expect(output).toBe('24');
// });

// test('Hmm and Hmmss', () => {
  // let now = new Now(2017, 10, 7, 12, 34, 56, 100);
  // let output = now.format('Hmm');
  // expect(output).toBe('1234');

  // now = new Now(2017, 10, 7, 1, 34, 56, 100);
  // output = now.format('Hmm');
  // expect(output).toBe('134');

  // now = new Now(2017, 10, 7, 13, 34, 56, 100);
  // output = now.format('Hmm');
  // expect(output).toBe('1334');

  // now = new Now(2017, 10, 7, 12, 34, 56, 100);
  // output = now.format('Hmmss');
  // expect(output).toBe('123456');

  // now = new Now(2017, 10, 7, 1, 34, 56, 100);
  // output = now.format('Hmmss');
  // expect(output).toBe('13456');

  // now = new Now(2017, 10, 7, 8, 34, 56, 100);
  // output = now.format('Hmmss');
  // expect(output).toBe('83456');

  // now = new Now(2017, 10, 7, 18, 34, 56, 100);
  // output = now.format('Hmmss');
  // expect(output).toBe('183456');
// });

test('milliseconds', () => {
  const now = new Now(2017, 10, 7, 18, 34, 56, 123);

  let output = now.format('S');
  expect(output).toBe('1');

  output = now.format('SS');
  expect(output).toBe('12');

  output = now.format('SSS');
  expect(output).toBe('123');

  output = now.format('SSSS');
  expect(output).toBe('1230');

  output = now.format('SSSSS');
  expect(output).toBe('12300');

  output = now.format('SSSSSS');
  expect(output).toBe('123000');

  output = now.format('SSSSSSS');
  expect(output).toBe('1230000');

  output = now.format('SSSSSSSS');
  expect(output).toBe('12300000');

  output = now.format('SSSSSSSSS');
  expect(output).toBe('123000000');
});

