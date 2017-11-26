/* eslint no-underscore-dangle: ["error",
{ "allowAfterThis": true, "allow": ["_isUTC", "_week"] }
] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["version", "localeData"] }] */
import {
  invalidDateError,
  invalidDateRegExp,
  isDate,
  isUndefined,
  isFunction,
  isString,
  isArray,
  isNumber,
  toInt,
  flatten,
  minus,
  nativeDatetoISOString,
  getSetGlobalLocale as locale,
  getLocale as localeData,
  listLocales as locales,
  defineLocale,
  updateLocale,
  defaultFormat,
  defaultFormatUtc,
  matchShortOffset,
  isLeapYear,
  getSetWeekYearHelper,
  weekOfYear,
  weeksInYear,
  parseWeekday,
  parseIsoWeekday,
  SECOND,
  MINUTE,
  HOUR,
  DAY,
} from './utils/index';

import format from './Format';
import duration from './Duration';

const VERSION = '0.1.0';
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const chunkOffset = /([+-]|\d\d)/gi;

function nativeGet(unit) {
  const getName = this._isUTC ? `getUTC${unit}` : `get${unit}`;
  return this.date[getName]();
}

function nativeSet(unit, val) {
  let setValue = val;
  setValue = parseInt(setValue, 10);
  const setName = this._isUTC ? `setUTC${unit}` : `set${unit}`;
  if (isNumber(setValue)) {
    this.date[setName](setValue);
  }
  return this;
}

function offsetFromString(matcher, string) {
  const matches = (string || '').match(matcher);

  if (matches === null) {
    return null;
  }

  const chunk = matches[matches.length - 1] || [];
  const parts = (`${chunk}`).match(chunkOffset) || ['-', 0, 0];
  const minutes = +(parts[1] * 60) + toInt(parts[2]);

  return minutes === 0 ?
    0 :
    parts[0] === '+' ? minutes : -minutes;
}

function compare(date1, date2) {
  if (isUndefined(date1) || isUndefined(date2)) {
    throw new Error('arguments can not be undefined');
  } else if (!(isDate(date1) && isDate(date2))) {
    throw new TypeError('arguments require Date type');
  } else {
    return (date1 < date2) ? -1 : (date1 > date2) ? 1 : 0;
  }
}

const getDateOffset = (date)  => -Math.round(date.getTimezoneOffset() / 15) * 15;

class Now {
  constructor(...args) {
    this.mondayFirst = false;
    this.now = new Date(...args);
    if (invalidDateRegExp.test(this.now)) {
      throw new Error(invalidDateError);
    }
    this._format = format;
    this._duration = duration;
    this._isUTC = false;
    this.initDate();
    this.initIsDate();
  }

  static version() {
    return VERSION;
  }

  static defineLocale(name, config) {
    return defineLocale(name, config);
  }

  static updateLocale(name, config) {
    return updateLocale(name, config);
  }

  static locales() {
    return locales();
  }

  get version() {
    return VERSION;
  }

  get value() {
    return +this.now;
  }

  get date() {
    return this.now;
  }

  localeData(key) {
    return localeData(key);
  }

  locale(obj) {
    locale(obj);
    return this;
  }

  initDate() {
    let index = 0;
    const len = days.length;

    while (index < len) {
      const lower = days[index].toLowerCase();
      this[lower] = this.dateIterator(index);
      index += 1;
    }
  }

  initIsDate() {
    let index = 0;
    const len = days.length;

    while (index < len) {
      this[`is${days[index]}`] = this.isDateIterator(index);
      index += 1;
    }
  }

  dateIterator(index) {
    const that = this;
    let dayObj;
    return (val) => {
      const weekDay = that.now.getDay();
      that.mondayFirst = false;
      if (weekDay === 0) {
        // today is sunday, so get before sunday
        let offset = index;
        if (index === 0) {
          offset = 7;
        }
        dayObj = that.beginningOfWeek('self').addDays(-(7 - offset));
        return (val && val === 'self') ? dayObj : dayObj.format('YYYY-MM-DD HH:mm:ss');
      }
      // today is not sunday, so get after sunday
      let offset = index;
      if (index === 0) {
        offset = 7;
      }
      dayObj = that.beginningOfWeek('self').addDays(offset);
      return (val && val === 'self') ? dayObj : dayObj.format('YYYY-MM-DD HH:mm:ss');
    };
  }

  isDateIterator(index) {
    const that = this;
    return () => that.now.getDay() === index;
  }

  UTC(...args) {
    const len = args.length;
    let clone;
    if (len > 0) {
      clone = this.clone(Date.UTC(...args));
      clone._isUTC = true;
      return clone;
    }
    const year = this.year();
    const month = this.month();
    const day = this.day();
    const hour = this.hour();
    const minute = this.minute();
    const second = this.second();
    const milliSecond = this.milliSecond();
    clone = this.clone(Date.UTC(year, month, day, hour, minute, second, milliSecond));
    clone._isUTC = true;
    return clone;
  }

  valueOf() {
    return this.value;
  }

  year(val) {
    return (+val === 0 || val) ? nativeSet.call(this, 'FullYear', val) : nativeGet.call(this, 'FullYear');
  }

  quarter() {
    return Math.ceil((this.month() + 1) / 3);
  }

  month(val) {
    return (+val === 0 || val) ? nativeSet.call(this, 'Month', val) : nativeGet.call(this, 'Month');
  }

  week(val) {
    const week = this.localeData().week(this);
    return (+val === 0 || val) ? this.addDays((val - week) * 7) : week;
  }

  isoWeek(val) {
    const { week } = weekOfYear(this, 1, 4);
    return (+val === 0 || val) ? this.addDays((val - week) * 7) : week;
  }

  day(val) {
    return (+val === 0 || val) ? nativeSet.call(this, 'Date', val) : nativeGet.call(this, 'Date');
  }

  weekDay(val) {
    let value = val;
    const weekDay = this._isUTC ? this.date.getUTCDay() : this.date.getDay();
    if (+value === 0 || value) {
      value = parseWeekday(value, this.localeData());
      return this.addDays(value - weekDay);
    }
    return weekDay;
  }

  localeWeekDay(val) {
    const localeWeekDay = ((this.weekDay() + 7) - this.localeData()._week.dow) % 7;
    return (+val === 0 || val) ? this.addDays(val - localeWeekDay) : localeWeekDay;
  }

  isoWeekDay(val) {
    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.
    if (+val === 0 || val) {
      const isoWeekDay = parseIsoWeekday(val, this.localeData());
      return this.day(this.day() === 0 ? isoWeekDay - 7 : isoWeekDay);
    }
    return this.weekDay() || 7;
  }

  hour(val) {
    return (+val === 0 || val) ? nativeSet.call(this, 'Hours', val) : nativeGet.call(this, 'Hours');
  }

  minute(val) {
    return (+val === 0 || val) ? nativeSet.call(this, 'Minutes', val) : nativeGet.call(this, 'Minutes');
  }

  second(val) {
    return (+val === 0 || val) ? nativeSet.call(this, 'Seconds', val) : nativeGet.call(this, 'Seconds');
  }

  milliSecond(val) {
    return (+val === 0 || val) ? nativeSet.call(this, 'Milliseconds', val) : nativeGet.call(this, 'Milliseconds');
  }

  weeksInYear() {
    const weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
  }

  isoWeeksInYear() {
    return weeksInYear(this.year(), 1, 4);
  }

  weekYear(val) {
    return getSetWeekYearHelper.call(
      this,
      val,
      this.week(),
      this.localeWeekDay(),
      this.localeData()._week.dow,
      this.localeData()._week.doy,
    );
  }

  isoWeekYear(val) {
    return getSetWeekYearHelper.call(
      this,
      val,
      this.isoWeek(),
      this.isoWeekDay(),
      1,
      4,
    );
  }

  unix() {
    return Math.floor(this.valueOf() / 1000);
  }

  get firstDayMonday() {
    return this.mondayFirst;
  }

  set firstDayMonday(value) {
    this.mondayFirst = value;
  }

  addMilliSeconds(value) {
    const val = value || 0;
    this.date.setMilliseconds(this.date.getMilliseconds() + val);
    return this;
  }

  addSeconds(value) {
    const val = value || 0;
    this.date.setSeconds(this.date.getSeconds() + val);
    return this;
  }

  addMinutes(value) {
    const val = value || 0;
    this.date.setMinutes(this.date.getMinutes() + val);
    return this;
  }

  addHours(value) {
    const val = value || 0;
    this.date.setHours(this.date.getHours() + val);
    return this;
  }

  addDays(value) {
    const val = value || 0;
    this.date.setDate(this.date.getDate() + val);
    return this;
  }

  addWeeks(value) {
    const val = value || 0;
    return this.addDays(7 * val);
  }

  addMonths(value) {
    const val = value || 0;
    this.date.setMonth(this.date.getMonth() + val);
    return this;
  }

  addQuarters(value) {
    const val = value || 0;
    this.date.setMonth(this.date.getMonth() + (val * 3));
    return this;
  }

  addYears(value) {
    const val = value || 0;
    this.date.setFullYear(this.date.getFullYear() + val);
    return this;
  }

  clone(...args) {
    const len = args.length;
    return len > 0 ? new Now(...args) : new Now(this.date);
  }

  truncate(name) {
    const context = this.date;
    switch (name) {
      case 'year':
        context.setMonth(0);
        context.setDate(1);
        context.setHours(0);
        context.setMinutes(0);
        context.setSeconds(0);
        context.setMilliseconds(0);
        return this;
      case 'month':
        context.setDate(1);
        context.setHours(0);
        context.setMinutes(0);
        context.setSeconds(0);
        context.setMilliseconds(0);
        return this;
      case 'day':
        context.setHours(0);
        context.setMinutes(0);
        context.setSeconds(0);
        context.setMilliseconds(0);
        return this;
      case 'hour':
        context.setMinutes(0);
        context.setSeconds(0);
        context.setMilliseconds(0);
        return this;
      case 'minute':
        context.setSeconds(0);
        context.setMilliseconds(0);
        return this;
      case 'second':
        context.setMilliseconds(0);
        return this;
      case 'milliSecond':
        return this;
      default:
        return this;
    }
  }

  format(str) {
    const formatStr = str || (this.isUtc() ? defaultFormatUtc : defaultFormat);
    const output = this._format.formatMoment(this, formatStr);
    return output;
  }

  computeBeginningOfWeek() {
    const clone = this.clone();
    clone.firstDayMonday = this.firstDayMonday;
    let weekDay = clone.date.getDay();
    if (clone.firstDayMonday) {
      if (weekDay === 0) {
        weekDay = 7;
      }
      weekDay -= 1;
    }
    clone.addDays(-weekDay);
    return clone.truncate('day');
  }

  beginningOfSecond(val) {
    const computed = this.clone().truncate('second');
    return (val && val === 'self') ?
      computed :
      computed.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  beginningOfMinute(val) {
    const computed = this.clone().truncate('minute');
    return (val && val === 'self') ?
      computed :
      computed.format('YYYY-MM-DD HH:mm:ss');
  }

  beginningOfHour(val) {
    const computed = this.clone().truncate('hour');
    return (val && val === 'self') ?
      computed :
      computed.format('YYYY-MM-DD HH:mm:ss');
  }

  beginningOfDay(val) {
    const computed = this.clone().truncate('day');
    return (val && val === 'self') ?
      computed :
      computed.format('YYYY-MM-DD HH:mm:ss');
  }

  beginningOfWeek(val) {
    return (val && val === 'self') ?
      this.computeBeginningOfWeek() :
      this.computeBeginningOfWeek().format('YYYY-MM-DD HH:mm:ss');
  }

  beginningOfMonth(val) {
    const computed = this.clone().truncate('month');
    return (val && val === 'self') ?
      computed :
      computed.format('YYYY-MM-DD HH:mm:ss');
  }

  beginningOfQuarter(val) {
    const clone = this.clone().beginningOfMonth('self');
    const offset = clone.date.getMonth() % 3;
    const computed = clone.addMonths(-offset);
    return (val && val === 'self') ?
      computed :
      computed.format('YYYY-MM-DD HH:mm:ss');
  }

  beginningOfYear(val) {
    const computed = this.clone().truncate('year');
    return (val && val === 'self') ?
      computed :
      computed.format('YYYY-MM-DD HH:mm:ss');
  }

  endOfSecond(val) {
    const clone = this.clone().beginningOfSecond('self').addMilliSeconds(SECOND - 1);
    return (val && val === 'self') ?
      clone :
      clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfMinute(val) {
    const clone = this.clone().beginningOfMinute('self').addMilliSeconds(MINUTE - 1);
    return (val && val === 'self') ?
      clone :
      clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfHour(val) {
    const clone = this.clone().beginningOfHour('self').addMilliSeconds(HOUR - 1);
    return (val && val === 'self') ?
      clone :
      clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfDay(val) {
    const clone = this.clone().beginningOfDay('self').addMilliSeconds(DAY - 1);
    return (val && val === 'self') ?
      clone :
      clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfWeek(val) {
    const clone = this.clone();
    clone.firstDayMonday = this.firstDayMonday;
    const computed = clone.beginningOfWeek('self').addMilliSeconds((7 * DAY) - 1);
    return (val && val === 'self') ?
      computed :
      computed.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfMonth(val) {
    const clone = this.clone().beginningOfMonth('self').addMonths(1).addMilliSeconds(-1);
    return (val && val === 'self') ?
      clone :
      clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfQuarter(val) {
    const clone = this.clone().beginningOfQuarter('self').addMonths(3).addMilliSeconds(-1);
    return (val && val === 'self') ?
      clone :
      clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfYear(val) {
    const clone = this.clone().beginningOfYear('self').addYears(1).addMilliSeconds(-1);
    return (val && val === 'self') ?
      clone :
      clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  dayOfYear(val) {
    const doy = Math.round((this.beginningOfDay('self').date - this.beginningOfYear('self').date) / DAY) + 1;
    return (+val === 0 || val) ? this.addDays(val - doy) : doy;
  }

  toJSON() {
    return this.toISOString();
  }

  toString() {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
  }

  toISOString() {
    const year = this.year();
    if (year < 0 || year > 9999) {
      return this.format('YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    if (nativeDatetoISOString && isFunction(nativeDatetoISOString)) {
      return this.date.toISOString();
    }
    return this.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  }

  isNow(...args) {
    let now = args[0];
    if (args.length === 0) {
      now = this;
    }
    return now instanceof Now;
  }

  isLeapYear(...args) {
    let year = args[0];
    if (args.length === 0) {
      year = this.year();
    } else if (this.isNow(year)) {
      year = year.year();
    }
    return isLeapYear(year);
  }

  isBefore(...args) {
    const len = args.length;
    let date1;
    let date2;

    if (len === 0) {
      throw new Error('isBefore require at least one argument');
    } else if (len === 1) {
      date1 = this.date;
      date2 = this.isNow(args[0]) ? args[0].date : args[0];
    } else {
      date1 = this.isNow(args[0]) ? args[0].date : args[0];
      date2 = this.isNow(args[1]) ? args[1].date : args[1];
    }
    return compare(date1, date2) === -1;
  }

  isAfter(...args) {
    const len = args.length;
    let date1;
    let date2;

    if (len === 0) {
      throw new Error('isAfter require at least one argument');
    } else if (len === 1) {
      date1 = this.date;
      date2 = this.isNow(args[0]) ? args[0].date : args[0];
    } else {
      date1 = this.isNow(args[0]) ? args[0].date : args[0];
      date2 = this.isNow(args[1]) ? args[1].date : args[1];
    }
    return compare(date1, date2) === 1;
  }

  isEqual(...args) {
    const len = args.length;
    let date1;
    let date2;

    if (len === 0) {
      throw new Error('isEqual require at least one argument');
    } else if (len === 1) {
      date1 = this.date;
      date2 = this.isNow(args[0]) ? args[0].date : args[0];
    } else {
      date1 = this.isNow(args[0]) ? args[0].date : args[0];
      date2 = this.isNow(args[1]) ? args[1].date : args[1];
    }
    return compare(date1, date2) === 0;
  }

  toArray() {
    return [this.year(), this.month(), this.day(), this.hour(), this.minute(),
      this.second(), this.milliSecond()];
  }

  toObject() {
    return {
      year: this.year(),
      month: this.month(),
      day: this.day(),
      hour: this.hour(),
      minute: this.minute(),
      second: this.second(),
      milliSecond: this.milliSecond(),
    };
  }

  min(...args) {
    let result = Infinity;
    let resultIndex;
    let original = args;
    let index = 0;
    let len = original.length;

    if (len === 0) {
      throw new Error('min require at least one argument');
    }
    // args length is 1, add this
    if (len === 1) {
      if (isArray(original)) {
        original = flatten(original);
        len = original.length;
      }
      if (len === 0) {
        throw new Error('min require at least one argument in the array');
      } else if (len === 1) {
        original.unshift(this);
        len += 1;
      }
    }
    const compares = original.map((value) => {
      if (this.isNow(value)) {
        return value.date;
      }
      return value;
    });
    const some = compares.some(value => !isDate(value));
    if (some) {
      throw new TypeError('some arguments not of Date type or Now instance');
    }
    while (index < len) {
      if (+compares[index] < result) {
        result = compares[index];
        resultIndex = index;
      }
      index += 1;
    }
    // return the original
    return original[resultIndex];
  }

  max(...args) {
    let result = -Infinity;
    let resultIndex;
    let original = args;
    let index = 0;
    let len = original.length;

    if (len === 0) {
      throw new Error('max require at least one argument');
    }
    // args length is 1, add this
    if (len === 1) {
      if (isArray(original)) {
        original = flatten(original);
        len = original.length;
      }
      if (len === 0) {
        throw new Error('max require at least one argument in the array');
      } else if (len === 1) {
        original.unshift(this);
        len += 1;
      }
    }
    const compares = original.map((value) => {
      if (this.isNow(value)) {
        return value.date;
      }
      return value;
    });
    const some = compares.some(value => !isDate(value));
    if (some) {
      throw new TypeError('some arguments not of Date type or Now instance');
    }
    while (index < len) {
      if (+compares[index] > result) {
        result = compares[index];
        resultIndex = index;
      }
      index += 1;
    }
    // return the original
    return original[resultIndex];
  }

  between(date1, date2) {
    let compareDate1 = date1;
    let compareDate2 = date2;
    if (isUndefined(compareDate1) || isUndefined(compareDate2)) {
      throw new Error('between require two arguments');
    }
    if (this.isNow(compareDate1)) {
      compareDate1 = compareDate1.date;
    }
    if (this.isNow(compareDate2)) {
      compareDate2 = compareDate2.date;
    }
    if (!(isDate(compareDate1) && isDate(compareDate2))) {
      throw new TypeError('arguments must be Date type or Now instance');
    }
    return this.isAfter(compareDate1) && this.isBefore(compareDate2);
  }

  // return the duration
  sub(obj, ...args) {
    let dateObj = obj;
    if (isUndefined(dateObj)) {
      throw new Error('sub must be receive more than one argument');
    }
    if (this.isNow(dateObj)) {
      dateObj = dateObj.date;
    }
    if (args.length > 0) {
      let other = args[0];
      if (this.isNow(other)) {
        other = other.date;
      }
      return minus(dateObj, other);
    }
    return minus(this.date, dateObj);
  }

  // return the relativeTime format
  elapse(date) {
    let subs;
    const now = new Date();

    if (date) {
      if (this.isNow(date)) {
        subs = minus(date.date, now);
      } else {
        subs = minus(date, now);
      }
    } else {
      subs = minus(this.date, now);
    }
    return new this._duration(subs).human(this, true);
  }

  timeAgo(date) {
    return this.elapse(date);
  }

  // return the time elapsed since date
  since(obj, ...args) {
    let dateObj = obj;
    if (isUndefined(dateObj)) {
      throw new Error('since must be receive more than one argument');
    }
    if (this.isNow(dateObj)) {
      dateObj = dateObj.date;
    }
    if (args.length > 0) {
      let other = args[0];
      if (this.isNow(other)) {
        other = other.date;
      }
      return this.sub(other, dateObj);
    }
    const now = new Date();
    return this.sub(now, dateObj);
  }

  utcOffset(input, keepLocalTime, keepMinutes) {
    const offset = this._offset || 0;
    let localAdjust;
    let minutes = input;

    if (!isUndefined(minutes)) {
      if (isString(minutes)) {
        minutes = offsetFromString(matchShortOffset, minutes);
        if (minutes === null) {
          return this;
        }
      } else if (isNumber(minutes) && (Math.abs(minutes) < 16 && !keepMinutes)) {
        minutes *= 60;
      }
      if (!this._isUTC && keepLocalTime) {
        localAdjust = getDateOffset(this.date);
      }
      this._offset = minutes;
      this._isUTC = true;
      if (localAdjust != null) {
        this.addMinutes(localAdjust);
      }
      if (offset !== minutes) {
        if (!keepLocalTime) {
          this.addMinutes(minutes - offset);
        }
      }
      return this;
    }
    return this._isUTC ? offset : this.getDateOffset();
  }

  utc(keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
  }

  local(keepLocalTime) {
    if (this._isUTC) {
      this.utcOffset(0, keepLocalTime);
      this._isUTC = false;

      if (keepLocalTime) {
        this.addMinutes(-this.getDateOffset());
      }
    }
    return this;
  }

  isDST() {
    return this.utcOffset() > this.clone().month(0).utcOffset() ||
      this.utcOffset() > this.clone().month(5).utcOffset();
  }

  isLocal() {
    return !this._isUTC;
  }

  isUtcOffset() {
    return this._isUTC;
  }

  isUtc() {
    return this._isUTC && this._offset === 0;
  }

  isUTC() {
    return this.isUtc();
  }
}

function initLocale() {
  Now.defineLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal(number) {
      const b = number % 10;
      const output = (toInt((number % 100) / 10) === 1) ? 'th' :
        (b === 1) ? 'st' :
          (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
      return number + output;
    },
  });
}

initLocale();

export default Now;
