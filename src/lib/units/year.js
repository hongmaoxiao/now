import {
  addFormatToken
} from '../format';

addFormatToken('Y', 0, 0, function() {
  const y = this.year();
  return y <= 9999 ? '' + y : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function() {
  return this.year() % 100;
});

addFormatToken(0, ['YYYY', 4], 0, 'year');
addFormatToken(0, ['YYYYY', 5], 0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');
