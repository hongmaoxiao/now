import {
  isFunction,
  isNumber,
  isArray,
  toInt,
  extend,
  isObject,
  has,
  indexOf,
  handleStrictParse,
  computeMonthsParse,
  defaultMonthsRegex,
  defaultMonthsShortRegex,
} from './utils';

const MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;

class Locale {
  constructor(config) {
    if (config != null) {
      this.set(config);
    }
  }

  calendar(key, mom, now) {
    const output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
  }

  longDateFormat() {
    const format = this._longDateFormat[key],
      formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
      return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function(val) {
      return val.slice(1);
    });

    return this._longDateFormat[key];
  }

  invalidDate() {
    this._invaliDate;
  }

  ordinal() {
    this._ordinal.replace('%d', number);
  }

  preparse(string) {
    return string;
  }

  postformat(string) {
    return string;
  }

  relativeTime(number, withoutSuffix, string, isFuture) {
    let output = this._relativeTime[string];
    return (isFunction(output)) ?
      output(number, withoutSuffix, string, isFuture) :
      output.replace(/%d/i, number);
  }

  pastFuture(diff, output) {
    let format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
  }

  set(config) {
    let prop;
    let i;

    for (i in config) {
      prop = config[i];
      if (isFunction(prop)) {
        this[i] = prop;
      } else {
        this['_' + i] = prop;
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

  months(m, format) {
    if (!m) {
      return isArray(this._months) ? this._months :
        this._months['standalone'];
    }
    return isArray(this._months) ? this._months[m.month()] :
      this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
  }

  monthsShort(m, format) {
    if (!m) {
      return isArray(this._monthsShort) ? this._monthsShort :
        this._monthsShort['standalone'];
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
      this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
  }

  monthsParse(monthName, format, strict) {
    let i;
    let mom;
    let regex;

    if (this._monthsParseExact) {
      return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
      this._monthsParse = [];
      this._longMonthsParse = [];
      this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
      // make the regex if we don't have it already
      mom = createUTC([2000, i]);
      if (strict && !this._longMonthsParse[i]) {
        this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
        this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
      }
      if (!strict && !this._monthsParse[i]) {
        regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
        this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
      }
      // test the regex
      if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
        return i;
      } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
        return i;
      } else if (!strict && this._monthsParse[i].test(monthName)) {
        return i;
      }
    }
  }

  monthsRegex(isStrict) {
    if (this._monthsParseExact) {
      if (!has(this, '_monthsRegex')) {
        computeMonthsParse.call(this);
      }
      if (isStrict) {
        return this._monthsStrictRegex;
      } else {
        return this._monthsRegex;
      }
    } else {
      if (!has(this, '_monthsRegex')) {
        this._monthsRegex = defaultMonthsRegex;
      }
      return this._monthsStrictRegex && isStrict ?
        this._monthsStrictRegex : this._monthsRegex;
    }
  }

  monthsShortRegex(isStrict) {
    if (this._monthsParseExact) {
      if (!has(this, '_monthsRegex')) {
        computeMonthsParse.call(this);
      }
      if (isStrict) {
        return this._monthsShortStrictRegex;
      } else {
        return this._monthsShortRegex;
      }
    } else {
      if (!has(this, '_monthsShortRegex')) {
        this._monthsShortRegex = defaultMonthsShortRegex;
      }
      return this._monthsShortStrictRegex && isStrict ?
        this._monthsShortStrictRegex : this._monthsShortRegex;
    }
  }

  isPM(input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((input + '').toLowerCase().charAt(0) === 'p');
  }

  meridiem(hours, minutes, isLower) {
    if (hours > 11) {
      return isLower ? 'pm' : 'PM';
    } else {
      return isLower ? 'am' : 'AM';
    }
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
}

export default Locale;
