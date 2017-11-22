/* eslint no-bitwise: ["error", { "allow": ["~"] }] */
import {
  zeroFill,
  isFunction,
} from './utils/index';

const formattingTokens = /(\[[^[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
const localFormattingTokens = /(\[[^[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

const removeFormattingTokens = (input) => {
  if (input.match(/\[[\s\S]/)) {
    return input.replace(/^\[|\]$/g, '');
  }
  return input.replace(/\\/g, '');
};

function hFormat() {
  return this.hour() % 12 || 12;
}

function kFormat() {
  return this.hour() || 24;
}

function addWeekYearFormatToken(token, getter) {
  this.addFormatToken(0, [token, token.length], 0, getter);
}

function meridiem(token, lowercase) {
  this.addFormatToken(token, 0, 0, function () {
    return this.localeData().meridiem(this.hour(), this.minute(), lowercase);
  });
}

function offsetToken(token, separator) {
  this.addFormatToken(token, 0, 0, function () {
    let offset = this.utcOffset();
    let sign = '+';
    if (offset < 0) {
      offset = -offset;
      sign = '-';
    }
    return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
  });
}

class Format {
  constructor() {
    this.formattingTokens = formattingTokens;
    this.localFormattingTokens = localFormattingTokens;
    this.formatFunctions = {};
    this.formatTokenFunctions = {};
    this.initFormat();
  }

  initFormat() {
    // year
    this.addFormatToken('Y', 0, 0, function () {
      const y = this.year();
      return y <= 9999 ? `${y}` : `+${y}`;
    });
    this.addFormatToken(0, ['YY', 2], 0, function () {
      return this.year() % 100;
    });
    this.addFormatToken(0, ['YYYY', 4], 0, 'year');
    this.addFormatToken(0, ['YYYYY', 5], 0, 'year');
    this.addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // quarter
    this.addFormatToken('Q', 0, 'Qo', 'quarter');

    // month
    this.addFormatToken('M', ['MM', 2], 'Mo', function () {
      return this.month() + 1;
    });
    this.addFormatToken('MMM', 0, 0, function (format) {
      return this.localeData().monthsShort(this, format);
    });
    this.addFormatToken('MMMM', 0, 0, function (format) {
      return this.localeData().months(this, format);
    });

    // weekYear
    this.addFormatToken(0, ['gg', 2], 0, function () {
      return this.weekYear() % 100;
    });
    this.addFormatToken(0, ['GG', 2], 0, function () {
      return this.isoWeekYear() % 100;
    });
    addWeekYearFormatToken.call(this, 'gggg', 'weekYear');
    addWeekYearFormatToken.call(this, 'ggggg', 'weekYear');
    addWeekYearFormatToken.call(this, 'GGGG', 'isoWeekYear');
    addWeekYearFormatToken.call(this, 'GGGGG', 'isoWeekYear');

    // week
    // this.addFormatToken('w', ['ww', 2], 'wo', 'week');
    this.addFormatToken('w', ['ww', 2], 'wo', 'week');
    this.addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // dayOfYear
    this.addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // dayOfMonth
    this.addFormatToken('D', ['DD', 2], 'Do', 'day');

    // dayOfWeek
    this.addFormatToken('d', 0, 'do', 'weekDay');
    this.addFormatToken('dd', 0, 0, function (format) {
      return this.localeData().weekdaysMin(this, format);
    });
    this.addFormatToken('ddd', 0, 0, function (format) {
      return this.localeData().weekdaysShort(this, format);
    });
    this.addFormatToken('dddd', 0, 0, function (format) {
      return this.localeData().weekdays(this, format);
    });
    this.addFormatToken('e', 0, 0, 'localeWeekDay');
    this.addFormatToken('E', 0, 0, 'isoWeekDay');

    // hour
    this.addFormatToken('H', ['HH', 2], 0, 'hour');
    this.addFormatToken('h', ['hh', 2], 0, hFormat);
    this.addFormatToken('k', ['kk', 2], 0, kFormat);
    this.addFormatToken('hmm', 0, 0, function () {
      return `${hFormat.apply(this)}${zeroFill(this.minute(), 2)}`;
    });
    this.addFormatToken('hmmss', 0, 0, function () {
      return `${hFormat.apply(this)}${zeroFill(this.minute(), 2)}${zeroFill(this.second(), 2)}`;
    });
    this.addFormatToken('Hmm', 0, 0, function () {
      return `${this.hour()}${zeroFill(this.minute(), 2)}`;
    });
    this.addFormatToken('Hmmss', 0, 0, function () {
      return `${this.hour()}${zeroFill(this.minute(), 2)}${zeroFill(this.second(), 2)}`;
    });

    meridiem.call(this, 'a', true);
    meridiem.call(this, 'A', false);

    // minute
    this.addFormatToken('m', ['mm', 2], 0, 'minute');

    // second
    this.addFormatToken('s', ['ss', 2], 0, 'second');

    // milliSecond
    this.addFormatToken('h', ['hh', 2], 0, hFormat);
    this.addFormatToken('k', ['kk', 2], 0, kFormat);
    this.addFormatToken('S', 0, 0, function () {
      return ~~(this.milliSecond() / 100);
    });
    this.addFormatToken(0, ['SS', 2], 0, function () {
      return ~~(this.milliSecond() / 10);
    });
    this.addFormatToken(0, ['SSS', 3], 0, 'milliSecond');
    this.addFormatToken(0, ['SSSS', 4], 0, function () {
      return this.milliSecond() * 10;
    });
    this.addFormatToken(0, ['SSSSS', 5], 0, function () {
      return this.milliSecond() * 100;
    });
    this.addFormatToken(0, ['SSSSSS', 6], 0, function () {
      return this.milliSecond() * 1000;
    });
    this.addFormatToken(0, ['SSSSSSS', 7], 0, function () {
      return this.milliSecond() * 10000;
    });
    this.addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
      return this.milliSecond() * 100000;
    });
    this.addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
      return this.milliSecond() * 1000000;
    });

    // offset
    offsetToken.call(this, 'Z', ':');
    offsetToken.call(this, 'ZZ', '');

    // timestamp
    this.addFormatToken('X', 0, 0, 'unix');
    this.addFormatToken('x', 0, 0, 'valueOf');
  }

  addFormatToken(token, padded, ordinal, callback) {
    let func = callback;
    if (typeof callback === 'string') {
      func = function () {
        return this[callback]();
      };
    }
    if (token) {
      this.formatTokenFunctions[token] = func;
    }
    if (padded) {
      this.formatTokenFunctions[padded[0]] = function (...args) {
        return zeroFill(func.apply(this, args), padded[1], padded[2]);
      };
    }
    if (ordinal) {
      this.formatTokenFunctions[ordinal] = function (...args) {
        return this.localeData().ordinal(func.apply(this, args), token);
      };
    }
  }

  makeFormatFunction(format) {
    const array = format.match(this.formattingTokens);
    const len = array.length;
    let i;

    for (i = 0; i < len; i += 1) {
      if (this.formatTokenFunctions[array[i]]) {
        array[i] = this.formatTokenFunctions[array[i]];
      } else {
        array[i] = removeFormattingTokens(array[i]);
      }
    }

    return function (context) {
      let output = '';
      let j = 0;

      for (j = 0; j < len; j += 1) {
        output += isFunction(array[j]) ? array[j].call(context, format) : array[j];
      }
      return output;
    };
  }

  formatMoment(context, format) {
    let f = format;
    f = this.expandFormat(f, context.localeData());
    this.formatFunctions[f] = this.formatFunctions[f] || this.makeFormatFunction(f);

    return this.formatFunctions[f](context);
  }

  expandFormat(format, locale) {
    let i = 5;
    let f = format;

    function replaceLongDateFormatTokens(input) {
      return locale.longDateFormat(input) || input;
    }

    this.localFormattingTokens.lastIndex = 0;
    while (i >= 0 && this.localFormattingTokens.test(f)) {
      f = f.replace(this.localFormattingTokens, replaceLongDateFormatTokens);
      this.localFormattingTokens.lastIndex = 0;
      i -= 1;
    }

    return f;
  }
}

export default new Format();
