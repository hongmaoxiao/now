import {
  addFormatToken
} from '../format';

addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('S', 0, 0, function() {
  return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function() {
  return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');

addFormatToken(0, ['SSSS', 4], 0, function() {
  return this.millisecond() * 10;
});

addFormatToken(0, ['SSSSS', 5], 0, function() {
  return this.millisecond() * 100;
});

addFormatToken(0, ['SSSSSS', 6], 0, function() {
  return this.millisecond() * 1000;
});

addFormatToken(0, ['SSSSSSS', 7], 0, function() {
  return this.millisecond() * 10000;
});

addFormatToken(0, ['SSSSSSSS', 8], 0, function() {
  return this.millisecond() * 100000;
});

addFormatToken(0, ['SSSSSSSSS', 9], 0, function() {
  return this.millisecond() * 1000000;
});

