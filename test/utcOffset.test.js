import Now from '../src/index';

test('setter / getter blackbox', () => {
  const now = new Now(2017);
  expect(now.clone().utcOffset(0).utcOffset()).toBe(0);

  expect(now.clone().utcOffset(1).utcOffset()).toBe(60);
  expect(now.clone().utcOffset(60).utcOffset()).toBe(60);
  expect(now.clone().utcOffset('+01:00').utcOffset()).toBe(60);
  expect(now.clone().utcOffset('+0100').utcOffset()).toBe(60);

  expect(now.clone().utcOffset(-1).utcOffset()).toBe(-60);
  expect(now.clone().utcOffset(-60).utcOffset()).toBe(-60);
  expect(now.clone().utcOffset('-01:00').utcOffset()).toBe(-60);
  expect(now.clone().utcOffset('-0100').utcOffset()).toBe(-60);

  expect(now.clone().utcOffset(1.5).utcOffset()).toBe(90);
  expect(now.clone().utcOffset(90).utcOffset()).toBe(90);
  expect(now.clone().utcOffset('+01:30').utcOffset()).toBe(90);
  expect(now.clone().utcOffset('+0130').utcOffset()).toBe(90);


  expect(now.clone().utcOffset(-1.5).utcOffset()).toBe(-90);
  expect(now.clone().utcOffset(-90).utcOffset()).toBe(-90);
  expect(now.clone().utcOffset('-01:30').utcOffset()).toBe(-90);
  expect(now.clone().utcOffset('-0130').utcOffset()).toBe(-90);
  expect(now.clone().utcOffset('+00:10').utcOffset()).toBe(10);
  expect(now.clone().utcOffset('-00:10').utcOffset()).toBe(-10);
  expect(now.clone().utcOffset('+0010').utcOffset()).toBe(10);
  expect(now.clone().utcOffset('-0010').utcOffset()).toBe(-10);
});

test('utcOffset shorthand hours -> minutes', () => {
    let i;
    for (i = -15; i <= 15; ++i) {
      const now = new Now();
      expect(now.utcOffset(i).utcOffset()).toBe(i * 60);
    }
    expect(new Now().utcOffset(-16).utcOffset()).toBe(-16);
    expect(new Now().utcOffset(16).utcOffset()).toBe(16);
});


test('isUTC', () => {
  expect(new Now().utcOffset(0).isUTC()).toBeTruthy();
  expect(!new Now().utcOffset(1).isUTC()).toBeTruthy();

  // assert.ok(moment.utc().isUTC(), 'moment.utc() creates objects in utc time');
});

test('getters and setters', () => {
  const now = new Now(2011, 5, 20);
  expect(now.clone().utcOffset(-120).year(2012).year()).toBe(2012);
  expect(now.clone().utcOffset(-120).month(1).month()).toBe(1);
  expect(now.clone().utcOffset(-120).day(2).day()).toBe(2);
  expect(now.clone().utcOffset(-120).hour(1).hour()).toBe(1);
  expect(now.clone().utcOffset(-120).minute(1).minute()).toBe(1);

  // expect(now.clone().utcOffset(-120).weekDay(1).weekDay()).toBe(1);
});

test('timezone format', () => {
  expect(new Now().utcOffset(60).format('ZZ')).toBe('+0100');
  expect(new Now().utcOffset(90).format('ZZ')).toBe('+0130');
  expect(new Now().utcOffset(120).format('ZZ')).toBe('+0200');
  expect(new Now().utcOffset(-60).format('ZZ')).toBe('-0100');
  expect(new Now().utcOffset(-90).format('ZZ')).toBe('-0130');
  expect(new Now().utcOffset(-120).format('ZZ')).toBe('-0200');
});
