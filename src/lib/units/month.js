import {
  addFormatToken
} from '../format';

addFormatToken('M', ['MM', 2], 'Mo', function() {
  return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function(format) {
  return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function(format) {
  return this.localeData().months(this, format);
});

