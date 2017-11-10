import {
  zeroFill,
  isFunction,
} from './utils';

const formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
const localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

const removeFormattingTokens = (input) => {
  if (input.match(/\[[\s\S]/)) {
    return input.replace(/^\[|\]$/g, '');
  }
  return input.replace(/\\/g, '');
}

function hFormat() {
  return this.hour() % 12 || 12;
}

function kFormat() {
  return this.hour() || 24;
}

class Format {
  constructor(config) {
    this.formattingTokens = formattingTokens;
    this.localFormattingTokens = localFormattingTokens;
    this.formatFunctions = {};
    this.formatTokenFunctions = {};
    this.initFormat();
  }

  initFormat() {
    // year
    this.addFormatToken('Y', 0, 0, function() {
      const y = this.year();
      return y <= 9999 ? '' + y : '+' + y;
    });
    this.addFormatToken(0, ['YY', 2], 0, function() {
      return this.year() % 100;
    });
    this.addFormatToken(0, ['YYYY', 4], 0, 'year');
    this.addFormatToken(0, ['YYYYY', 5], 0, 'year');
    this.addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // quarter
    this.addFormatToken('Q', 0, 'Qo', 'quarter');

    // month
    this.addFormatToken('M', ['MM', 2], 'Mo', function() {
      return this.month() + 1;
    });
    this.addFormatToken('MMM', 0, 0, function(format) {
      return this.localeData().monthsShort(this, format);
    });
    this.addFormatToken('MMMM', 0, 0, function(format) {
      return this.localeData().months(this, format);
    });

    // weekYear
    this.addFormatToken(0, ['gg', 2], 0, function() {
      return this.weekYear() % 100;
    });
    // this.addFormatToken(0, ['GG', 2], 0, function() {
      // return this.isoWeekYear() % 100;
    // });
    this.addWeekYearFormatToken('gggg', 'weekYear');
    this.addWeekYearFormatToken('ggggg', 'weekYear');
    // this.addWeekYearFormatToken('GGGG', 'isoWeekYear');
    // this.addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // week
    this.addFormatToken('w', ['ww', 2], 'wo', 'week');
    // this.addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // dayOfYear
    this.addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // dayOfMonth
    this.addFormatToken('D', ['DD', 2], 'Do', 'day');

    // dayOfWeek
    this.addFormatToken('d', 0, 'do', 'weekDay');
    this.addFormatToken('dd', 0, 0, function(format) {
      return this.localeData().weekdaysMin(this, format);
    });
    this.addFormatToken('ddd', 0, 0, function(format) {
      return this.localeData().weekdaysShort(this, format);
    });
    this.addFormatToken('dddd', 0, 0, function(format) {
      return this.localeData().weekdays(this, format);
    });
    this.addFormatToken('e', 0, 0, 'localeWeekDay');
    // this.addFormatToken('E', 0, 0, 'isoWeekday');

    // hour
    this.addFormatToken('H', ['HH', 2], 0, 'hour');
    this.addFormatToken('h', ['hh', 2], 0, hFormat);
    this.addFormatToken('k', ['kk', 2], 0, kFormat);
    this.addFormatToken('hmm', 0, 0, function() {
      return '' + hFormat.apply(this) + zeroFill(this.minute(), 2);
    });
    this.addFormatToken('hmmss', 0, 0, function() {
      return '' + hFormat.apply(this) + zeroFill(this.minute(), 2) + zeroFill(this.second(), 2);
    });
    this.addFormatToken('Hmm', 0, 0, function() {
      return '' + this.hour() + zeroFill(this.minute(), 2);
    });
    this.addFormatToken('Hmmss', 0, 0, function() {
      return '' + this.hour() + zeroFill(this.minute(), 2) + zeroFill(this.second(), 2);
    });
    this.meridiem('a', true);
    this.meridiem('A', false);

    // minute
    this.addFormatToken('m', ['mm', 2], 0, 'minute');

    // second
    this.addFormatToken('s', ['ss', 2], 0, 'second');

    // milliSecond
    this.addFormatToken('h', ['hh', 2], 0, hFormat);
    this.addFormatToken('k', ['kk', 2], 0, kFormat);
    this.addFormatToken('S', 0, 0, function() {
      return ~~(this.milliSecond() / 100);
    });
    this.addFormatToken(0, ['SS', 2], 0, function() {
      return ~~(this.milliSecond() / 10);
    });
    this.addFormatToken(0, ['SSS', 3], 0, 'milliSecond');
    this.addFormatToken(0, ['SSSS', 4], 0, function() {
      return this.milliSecond() * 10;
    });
    this.addFormatToken(0, ['SSSSS', 5], 0, function() {
      return this.milliSecond() * 100;
    });
    this.addFormatToken(0, ['SSSSSS', 6], 0, function() {
      return this.milliSecond() * 1000;
    });
    this.addFormatToken(0, ['SSSSSSS', 7], 0, function() {
      return this.milliSecond() * 10000;
    });
    this.addFormatToken(0, ['SSSSSSSS', 8], 0, function() {
      return this.milliSecond() * 100000;
    });
    this.addFormatToken(0, ['SSSSSSSSS', 9], 0, function() {
      return this.milliSecond() * 1000000;
    });
  }

  addFormatToken(token, padded, ordinal, callback) {
    let func = callback;
    if (typeof callback === 'string') {
      func = function() {
        console.log('call: ', callback);
        return this[callback]();
      };
    }
    if (token) {
      this.formatTokenFunctions[token] = func;
    }
    if (padded) {
      this.formatTokenFunctions[padded[0]] = function() {
        return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
      };
    }
    if (ordinal) {
      this.formatTokenFunctions[ordinal] = function() {
        return this.localeData().ordinal(func.apply(this, arguments), token);
      };
    }
  }

  addWeekYearFormatToken(token, getter) {
    this.addFormatToken(0, [token, token.length], 0, getter);
  }

  meridiem(token, lowercase) {
    this.addFormatToken(token, 0, 0, function() {
      return this.localeData().meridiem(this.hour(), this.minute(), lowercase);
    });
  }

  makeFormatFunction(format) {
    let array = format.match(this.formattingTokens);
    let i;
    let length;

    for (i = 0, length = array.length; i < length; i++) {
      if (this.formatTokenFunctions[array[i]]) {
        array[i] = this.formatTokenFunctions[array[i]];
    console.log("formmmmm array: ", i, array[i]);
      } else {
        array[i] = removeFormattingTokens(array[i]);
    console.log("formmmmm array: ", i, array[i]);
      }
    }

    console.log("format all: ", array);
    return function(context) {
      let output = '';
      let i;
      for (i = 0; i < length; i++) {
        output += isFunction(array[i]) ? array[i].call(context, format) : array[i];
      }
      return output;
    };
  }

  formatMoment(context, format) {
    // if (!m.isValid()) {
    // return m.localeData().invalidDate();
    // }

    // console.log('m: ', context);
    // console.log("localeData: ", context.localeData());
    format = this.expandFormat(format, context.localeData());
    console.log('format: ', format);
    this.formatFunctions[format] = this.formatFunctions[format] || this.makeFormatFunction(format);
    // console.log('this.formatFunctions: ', this.formatFunctions[format]);

    return this.formatFunctions[format](context);
  }

  expandFormat(format, locale) {
    let i = 5;

    function replaceLongDateFormatTokens(input) {
      console.log('iiiii: ', input);
      return locale.longDateFormat(input) || input;
    }

    this.localFormattingTokens.lastIndex = 0;
    while (i >= 0 && this.localFormattingTokens.test(format)) {
      console.log("formmmmm in: ", format)
      format = format.replace(this.localFormattingTokens, replaceLongDateFormatTokens);
      this.localFormattingTokens.lastIndex = 0;
      i -= 1;
    }
    // console.log("formmmmm: ", format)

    return format;
  }

}

export default new Format;
