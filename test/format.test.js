import Now from '../src/index';

// test('expect to return format', () => {
//   const now = new Now(2017, 10, 7, 17, 35, 20, 100);
//   const output = now.format('dddd');
//   expect(output).toBe('星期二');
// });

// test('expect to return format1', () => {
//   const now = new Now(2017, 10, 7, 17, 35, 20, 100);
//   const output = now.format('MMM Do YY');
//   console.log('output: ', output);
//   expect(output).toBe('11月 7日 17');
// });

test('k and kk', () => {
    let now = new Now(2017, 10, 7, 1, 23, 45, 100);
    let output = now.format('k');
    console.log('output: ', output);
    expect(output).toBe('1');

    now = new Now(2017, 10, 7, 12, 34, 56, 100);
    output = now.format('k');
    console.log('output: ', output);
    expect(output).toBe('12');

    now = new Now(2017, 10, 7, 1, 23, 45, 100);
    output = now.format('kk');
    console.log('output: ', output);
    expect(output).toBe('01');

    now = new Now(2017, 10, 7, 12, 34, 56, 100);
    output = now.format('kk');
    console.log('output: ', output);
    expect(output).toBe('12');

    now = new Now(2017, 10, 7, 0, 34, 56, 100);
    output = now.format('kk');
    console.log('output: ', output);
    expect(output).toBe('24');

    now = new Now(2017, 10, 7, 0, 0, 0, 100);
    output = now.format('kk');
    console.log('output: ', output);
    expect(output).toBe('24');
    // assert.equal(moment('01:23:45', 'HH:mm:ss').format('k'), '1');
    // assert.equal(moment('12:34:56', 'HH:mm:ss').format('k'), '12');
    // assert.equal(moment('01:23:45', 'HH:mm:ss').format('kk'), '01');
    // assert.equal(moment('12:34:56', 'HH:mm:ss').format('kk'), '12');
    // assert.equal(moment('00:34:56', 'HH:mm:ss').format('kk'), '24');
    // assert.equal(moment('00:00:00', 'HH:mm:ss').format('kk'), '24');
});
