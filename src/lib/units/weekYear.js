import {
  addFormatToken
} from '../format';

addFormatToken(0, ['gg', 2], 0, function() {
  return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function() {
  return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken(token, getter) {
  addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg', 'weekYear');
addWeekYearFormatToken('ggggg', 'weekYear');
addWeekYearFormatToken('GGGG', 'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');
