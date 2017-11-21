/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true} ] */
/* eslint class-methods-use-this: [
  "error",
  { "exceptMethods": ["preparse", "postformat", "isPM", "meridiem"] }
]
*/
import {
  isFunction,
  isArray,
  has,
  computeMonthsParse,
  defaultMonthsRegex,
  defaultMonthsShortRegex,
  defaultWeekdaysRegex,
  defaultWeekdaysShortRegex,
  defaultWeekdaysMinRegex,
  computeWeekdaysParse,
  weekOfYear,
} from './utils/index';

const MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;

class Locale {
  constructor(config) {
    if (config != null) {
      this.set(config);
    }
  }

  calendar(key, mom, now) {
    const output = this._calendar[key] || this._calendar.sameElse;
    return isFunction(output) ? output.call(mom, now) : output;
  }

  longDateFormat(key) {
    const format = this._longDateFormat[key];
    const formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
      return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, val => val.slice(1));

    return this._longDateFormat[key];
  }

  invalidDate() {
    return this._invaliDate;
  }

  ordinal(number) {
    this._ordinal.replace('%d', number);
  }

  preparse(string) {
    return string;
  }

  postformat(string) {
    return string;
  }

  relativeTime(number, withoutSuffix, string, isFuture) {
    const output = this._relativeTime[string];
    return (isFunction(output)) ?
      output(number, withoutSuffix, string, isFuture) :
      output.replace(/%d/i, number);
  }

  pastFuture(diff, output) {
    const format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
  }

  set(config) {
    const keys = Object.keys(config);
    const len = keys.length;
    let prop;
    let i;

    for (i = 0; i <= len; i += 1) {
      prop = config[keys[i]];
      if (isFunction(prop)) {
        this[keys[i]] = prop;
      } else {
        this[`_${keys[i]}`] = prop;
      }
    }
    this._config = config;
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
    // TODO: Remove "ordinalParse" fallback in next major release.
    // this._dayOfMonthOrdinalParseLenient = new RegExp(
    // (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
    // '|' + (/\d{1,2}/).source);
  }

  months(context, format) {
    if (!context) {
      return isArray(this._months) ? this._months :
        this._months.standalone;
    }
    return isArray(this._months) ? this._months[context.month()] :
      this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][context.month()];
  }

  monthsShort(m, format) {
    if (!m) {
      return isArray(this._monthsShort) ? this._monthsShort :
        this._monthsShort.standalone;
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
      this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
  }

  // monthsParse(monthName, format, strict) {
  //   let i;
  //   let mom;
  //   let regex;

  //   if (this._monthsParseExact) {
  //     return handleMonthStrictParse.call(this, monthName, format, strict);
  //   }

  //   if (!this._monthsParse) {
  //     this._monthsParse = [];
  //     this._longMonthsParse = [];
  //     this._shortMonthsParse = [];
  //   }

  //   // TODO: add sorting
  //   // Sorting makes sure if one month (or abbr) is a prefix of another
  //   // see sorting in computeMonthsParse
  //   for (i = 0; i < 12; i += 1) {
  //     // make the regex if we don't have it already
  //     mom = createUTC([2000, i]);
  //     if (strict && !this._longMonthsParse[i]) {
  //       this._longMonthsParse[i] = new RegExp(`^${this.months(mom, '').replace('.', '')}$`, 'i');
  //       this._shortMonthsParse[i] = new RegExp(`^${this.monthsShort(mom, '')
  //           .replace('.', '')}$`, 'i');
  //     }
  //     if (!strict && !this._monthsParse[i]) {
  //       regex = `^${this.months(mom, '')}|^${this.monthsShort(mom, '')}`;
  //       this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
  //     }
  //     // test the regex
  //     if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
  //       return i;
  //     } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
  //       return i;
  //     } else if (!strict && this._monthsParse[i].test(monthName)) {
  //       return i;
  //     }
  //   }

  //   return -1;
  // }

  monthsRegex(isStrict) {
    if (this._monthsParseExact) {
      if (!has(this, '_monthsRegex')) {
        computeMonthsParse.call(this);
      }
      if (isStrict) {
        return this._monthsStrictRegex;
      }
      return this._monthsRegex;
    }
    if (!has(this, '_monthsRegex')) {
      this._monthsRegex = defaultMonthsRegex;
    }
    return this._monthsStrictRegex && isStrict ?
      this._monthsStrictRegex : this._monthsRegex;
  }

  monthsShortRegex(isStrict) {
    if (this._monthsParseExact) {
      if (!has(this, '_monthsRegex')) {
        computeMonthsParse.call(this);
      }
      if (isStrict) {
        return this._monthsShortStrictRegex;
      }
      return this._monthsShortRegex;
    }
    if (!has(this, '_monthsShortRegex')) {
      this._monthsShortRegex = defaultMonthsShortRegex;
    }
    return this._monthsShortStrictRegex && isStrict ?
      this._monthsShortStrictRegex : this._monthsShortRegex;
  }

  week(mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
  }

  firstDayOfWeek() {
    return this._week.dow;
  }

  firstDayOfYear() {
    return this._week.doy;
  }

  weekdays(m, format) {
    if (!m) {
      return isArray(this._weekdays) ? this._weekdays :
        this._weekdays.standalone;
    }
    return isArray(this._weekdays) ? this._weekdays[m.weekDay()] :
      this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.weekDay()];
  }

  weekdaysShort(m) {
    return (m) ? this._weekdaysShort[m.weekDay()] : this._weekdaysShort;
  }

  weekdaysMin(m) {
    return (m) ? this._weekdaysMin[m.weekDay()] : this._weekdaysMin;
  }

  // weekdaysParse(weekdayName, format, strict) {
  //   let i;
  //   let mom;
  //   let regex;

  //   if (this._weekdaysParseExact) {
  //     return handleWeekStrictParse.call(this, weekdayName, format, strict);
  //   }

  //   if (!this._weekdaysParse) {
  //     this._weekdaysParse = [];
  //     this._minWeekdaysParse = [];
  //     this._shortWeekdaysParse = [];
  //     this._fullWeekdaysParse = [];
  //   }

  //   for (i = 0; i < 7; i += 1) {
  //     // make the regex if we don't have it already

  //     mom = createUTC([2000, 1]).day(i);
  //     if (strict && !this._fullWeekdaysParse[i]) {
  //       this._fullWeekdaysParse[i] = new RegExp(`^${this.weekdays(mom, '')
  //           .replace('.', '\.?')}$`, 'i');
  //       this._shortWeekdaysParse[i] = new RegExp(`^${this.weekdaysShort(mom, '')
  //           .replace('.', '\.?')}$`, 'i');
  //       this._minWeekdaysParse[i] = new RegExp(`^${this.weekdaysMin(mom, '')
  //           .replace('.', '\.?')}$`, 'i');
  //     }
  //     if (!this._weekdaysParse[i]) {
  //       regex = `^${this.weekdays(mom, '')}
  //         |^${this.weekdaysShort(mom, '')}
  //         |^${this.weekdaysMin(mom, '')}`;
  //       this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
  //     }
  //     // test the regex
  //     if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
  //       return i;
  //     } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
  //       return i;
  //     } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
  //       return i;
  //     } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
  //       return i;
  //     }
  //   }
  // }

  weekdaysRegex(isStrict) {
    if (this._weekdaysParseExact) {
      if (!has(this, '_weekdaysRegex')) {
        computeWeekdaysParse.call(this);
      }
      if (isStrict) {
        return this._weekdaysStrictRegex;
      }
      return this._weekdaysRegex;
    }
    if (!has(this, '_weekdaysRegex')) {
      this._weekdaysRegex = defaultWeekdaysRegex;
    }
    return this._weekdaysStrictRegex && isStrict ?
      this._weekdaysStrictRegex : this._weekdaysRegex;
  }

  weekdaysShortRegex(isStrict) {
    if (this._weekdaysParseExact) {
      if (!has(this, '_weekdaysRegex')) {
        computeWeekdaysParse.call(this);
      }
      if (isStrict) {
        return this._weekdaysShortStrictRegex;
      }
      return this._weekdaysShortRegex;
    }
    if (!has(this, '_weekdaysShortRegex')) {
      this._weekdaysShortRegex = defaultWeekdaysShortRegex;
    }
    return this._weekdaysShortStrictRegex && isStrict ?
      this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
  }

  weekdaysMinRegex(isStrict) {
    if (this._weekdaysParseExact) {
      if (!has(this, '_weekdaysRegex')) {
        computeWeekdaysParse.call(this);
      }
      if (isStrict) {
        return this._weekdaysMinStrictRegex;
      }
      return this._weekdaysMinRegex;
    }
    if (!has(this, '_weekdaysMinRegex')) {
      this._weekdaysMinRegex = defaultWeekdaysMinRegex;
    }
    return this._weekdaysMinStrictRegex && isStrict ?
      this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
  }

  isPM(input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((`${input}`).toLowerCase().charAt(0) === 'p');
  }

  meridiem(hours, minutes, isLower) {
    if (hours > 11) {
      return isLower ? 'pm' : 'PM';
    }
    return isLower ? 'am' : 'AM';
  }
}

export default Locale;
