import {
  addFormatToken
} from '../format';

function hFormat() {
  return this.hours() % 12 || 12;
}

function kFormat() {
  return this.hours() % 12 || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function() {
  return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function() {
  return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function() {
  return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function() {
  return '' + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
});

function meridiem(token, lowercase) {
  addFormatToken(token, 0, 0, function() {
    return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
  });
}

meridiem('a', true);
meridiem('A', false);

