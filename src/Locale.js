/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true} ] */
/* eslint class-methods-use-this: [
  "error",
  { "exceptMethods": ["preparse", "postformat", "isPM", "meridiem"] }
]
*/
import {
  isFunction,
  isArray,
  weekOfYear,
} from './utils/index';

const MONTHS_IN_FORMAT = /D[oD]?(\[[^[\]]*\]|\s)+MMMM?/;

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
