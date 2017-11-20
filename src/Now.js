import {
  invalidDateError,
  invalidDateRegExp,
  compare,
  isDate,
  isUndefined,
  isFunction,
  isString,
  isNumber,
  toInt,
  minus,
  nativeDatetoISOString,
  getSetGlobalLocale as locale,
  getLocale as localeData,
  listLocales as locales,
  defineLocale,
  updateLocale,
  defaultFormat,
  defaultFormatUtc,
  matchOffset,
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
} from './utils/index.js';

import format from './Format.js';
import duration from './Duration.js';

const VERSION = '0.1.0';
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const chunkOffset = /([\+\-]|\d\d)/gi;

const nativeGet = function(unit) {
  const getName = this._isUTC ? `getUTC${unit}` : `get${unit}`;
  return this.date[getName]();
};

const nativeSet = function(unit, val) {
  val = parseInt(val);
  const setName = this._isUTC ? `setUTC${unit}` : `set${unit}`;
  if (isNumber(val)) {
    this.date[setName](val);
  }
  return this;
};

function offsetFromString(matcher, string) {
  const matches = (string || '').match(matcher);

  if (matches === null) {
    return null;
  }

  const chunk = matches[matches.length - 1] || [];
  const parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
  const minutes = +(parts[1] * 60) + toInt(parts[2]);

  return minutes === 0 ?
    0 :
    parts[0] === '+' ? minutes : -minutes;
}

function initLocale() {
  Now.defineLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal: function(number) {
      const b = number % 10;
      const output = (toInt(number % 100 / 10) === 1) ? 'th' :
        (b === 1) ? 'st' :
        (b === 2) ? 'nd' :
        (b === 3) ? 'rd' : 'th';
      return number + output;
    }
  });
}

class Now {
  constructor(...args) {
    this.mondayFirst = false;
    this.now = new Date(...args);
    if (invalidDateRegExp.test(this.now)) {
      throw new TypeError(invalidDateError);
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
        dayObj = that.computeBeginningOfWeek().addDays(-(7 - offset));
        return (val && val === 'self') ? dayObj : dayObj.format('YYYY-MM-DD HH:mm:ss');
      }
      // today is not sunday, so get after sunday
      let offset = index;
      if (index === 0) {
        offset = 7;
      }
      dayObj = that.computeBeginningOfWeek().addDays(offset);
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
    const week = weekOfYear(this, 1, 4).week;
    return (+val === 0 || val) ? this.addDays((val - week) * 7) : week;
  }

  day(val) {
    return (+val === 0 || val) ? nativeSet.call(this, 'Date', val) : nativeGet.call(this, 'Date');
  }

  weekDay(val) {
    const weekDay = this._isUTC ? this.date.getUTCDay() : this.date.getDay();
    if (+val === 0 || val) {
      val = parseWeekday(val, this.localeData());
      return this.addDays(val - weekDay);
    } else {
      return weekDay;
    }
  }

  localeWeekDay(val) {
    const localeWeekDay = (this.weekDay() + 7 - this.localeData()._week.dow) % 7;
    return (+val === 0 || val) ? this.addDays(val - localeWeekDay) : localeWeekDay;
  }

  isoWeekDay(val) {
    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.
    if (+val === 0 || val) {
      const isoWeekDay = parseIsoWeekday(val, this.localeData());
      return this.day(this.day() === 0 ? isoWeekDay - 7 : isoWeekDay);
    } else {
      return this.weekDay() || 7;
    }
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
    return getSetWeekYearHelper.call(this,
      val,
      this.week(),
      this.localeWeekDay(),
      this.localeData()._week.dow,
      this.localeData()._week.doy
    )
  }

  isoWeekYear(val) {
    return getSetWeekYearHelper.call(this,
      val,
      this.isoWeek(),
      this.isoWeekDay(),
      1,
      4
    )
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
    this.date.setMilliseconds(this.date.getMilliseconds() + value);
    return this;
  }

  addSeconds(value) {
    this.date.setSeconds(this.date.getSeconds() + value);
    return this;
  }

  addMinutes(value) {
    this.date.setMinutes(this.date.getMinutes() + value);
    return this;
  }

  addHours(value) {
    this.date.setHours(this.date.getHours() + value);
    return this;
  }

  addDays(value) {
    this.date.setDate(this.date.getDate() + value);
    return this;
  }

  addWeeks(value) {
    return this.date.addDays(7 * value);
  }

  addMonths(value) {
    this.date.setMonth(this.date.getMonth() + value);
    return this;
  }

  addYears(value) {
    this.date.setFullYear(this.date.getFullYear() + value);
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
      default:
        return this;
    }
  }

  format(obj) {
    obj || (obj = this.isUtc() ? defaultFormatUtc : defaultFormat);
    const output = this._format.formatMoment(this, obj);
    return output;
  }

  computeBeginningOfMinute() {
    return this.clone().truncate('minute');
  }

  computeBeginningOfHour() {
    return this.clone().truncate('hour');
  }

  computeBeginningOfDay() {
    return this.clone().truncate('day');
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

  computeBeginningOfMonth() {
    return this.clone().truncate('month');
  }

  computeBeginningOfQuarter() {
    const clone = this.clone().computeBeginningOfMonth();
    const offset = clone.date.getMonth() % 3;
    return clone.addMonths(-offset);
  }

  computeBeginningOfYear() {
    return this.clone().truncate('year');
  }

  beginningOfMinute(val) {
    return (val && val === 'self') ?
    this.computeBeginningOfMinute() :
    this.computeBeginningOfMinute().format('YYYY-MM-DD HH:mm:ss');
  }

  beginningOfHour(val) {
    return (val && val === 'self') ?
    this.computeBeginningOfHour() :
    this.computeBeginningOfHour().format('YYYY-MM-DD HH:mm:ss');
  }

  beginningOfDay(val) {
    return (val && val === 'self') ?
    this.computeBeginningOfDay() :
    this.computeBeginningOfDay().format('YYYY-MM-DD HH:mm:ss');
  }

  beginningOfWeek(val) {
    return (val && val === 'self') ?
    this.computeBeginningOfWeek() :
    this.computeBeginningOfWeek().format('YYYY-MM-DD HH:mm:ss');
  }

  beginningOfMonth(val) {
    return (val && val === 'self') ?
    this.computeBeginningOfMonth() :
    this.computeBeginningOfMonth().format('YYYY-MM-DD HH:mm:ss');
  }

  beginningOfQuarter(val) {
    return (val && val === 'self') ?
    this.computeBeginningOfQuarter() :
    this.computeBeginningOfQuarter().format('YYYY-MM-DD HH:mm:ss');
  }

  beginningOfYear(val) {
    return (val && val === 'self') ?
    this.computeBeginningOfYear() :
    this.computeBeginningOfYear().format('YYYY-MM-DD HH:mm:ss');
  }

  endOfMinute(val) {
    const clone = this.clone().computeBeginningOfMinute().addMilliSeconds(MINUTE - 1);
    return (val && val === 'self') ?
    clone :
    clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfHour(val) {
    const clone = this.clone().computeBeginningOfHour().addMilliSeconds(HOUR - 1);
    return (val && val === 'self') ?
    clone :
    clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfDay(val) {
    const clone = this.clone().computeBeginningOfDay().addMilliSeconds(DAY - 1);
    return (val && val === 'self') ?
    clone :
    clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfWeek(val) {
    const clone = this.clone();
    clone.firstDayMonday = this.firstDayMonday;
    const computed = clone.computeBeginningOfWeek().addMilliSeconds((7 * DAY) - 1);
    return (val && val === 'self') ?
    computed :
    computed.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfMonth(val) {
    const clone = this.clone().computeBeginningOfMonth().addMonths(1).addMilliSeconds(-1);
    return (val && val === 'self') ?
    clone :
    clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfQuarter(val) {
    const clone = this.clone().computeBeginningOfQuarter().addMonths(3).addMilliSeconds(-1);
    return (val && val === 'self') ?
    clone :
    clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  endOfYear(val) {
    const clone = this.clone().computeBeginningOfYear().addYears(1).addMilliSeconds(-1);
    return (val && val === 'self') ?
    clone :
    clone.format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  dayOfYear() {
    return Math.round((this.beginningOfDay('self').date - this.beginningOfYear('self').date) / DAY) + 1;
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

  isNow(val) {
    const now = val ? val : this;
    return now instanceof Now;
  }

  isLeapYear() {
    return isLeapYear(this.year());
  }

  isBefore(obj) {
    return compare(this.date, obj) === -1;
  }

  isAfter(obj) {
    return compare(this.date, obj) === 1;
  }

  isEqual(obj) {
    return compare(this.date, obj) === 0;
  }

  toArray() {
    return [this.year(), this.month(), this.day(), this.hour(), this.minute(), this.second(), this.milliSecond()];
  }

  toObject() {
    return {
      year: this.year(),
      month: this.month(),
      day: this.day(),
      hour: this.hour(),
      minute: this.minute(),
      second: this.second(),
      milliSecond: this.milliSecond()
    };
  }

  min(...args) {
    let result = Infinity;
    let compares = args;
    let index = 0;
    const len = compares.length;
    if (len === 0) {
      throw new Error('min require at least one argument');
    }
    compares = compares.map(value => {
      if (this.isNow(value)) {
        return value.date;
      }
      return value;
    });
    const some = compares.some(value => !isDate(value));
    if (some) {
      throw new TypeError('some arguments not of Date type or Now instance');
    }
    compares = [this.date].concat(compares);
    while (index < len + 1) {
      if (+compares[index] < result) {
        result = compares[index];
      }
      index += 1;
    }
    return result;
  }

  max(...args) {
    let result = -Infinity;
    let compares = args;
    let index = 0;
    const len = compares.length;
    if (len === 0) {
      throw new Error('max require at least one argument');
    }
    compares = compares.map(value => {
      if (this.isNow(value)) {
        return value.date;
      }
      return value;
    });
    const some = compares.some(value => !isDate(value));
    if (some) {
      throw new TypeError('some arguments not of Date type or Now instance');
    }
    compares = [this.date].concat(compares);
    while (index < len + 1) {
      if (+compares[index] > result) {
        result = compares[index];
      }
      index += 1;
    }
    return result;
  }

  between(date1, date2) {
    if (isUndefined(date1) || isUndefined(date2)) {
      throw new Error('arguments must be defined');
    }
    if (this.isNow(date1)) {
      date1 = date1.date;
    }
    if (this.isNow(date2)) {
      date2 = date2.date;
    }
    if (!(isDate(date1) && isDate(date2))) {
      throw new TypeError('arguments must be Date type or Now instance');
    }
    return this.isAfter(date1) && this.isBefore(date2);
  }

  // return the duration
  sub(date, ...args) {
    if (isUndefined(date)) {
      throw new Error("sub must be receive more than one argument");
    }
    if (this.isNow(date)) {
      date = date.date;
    }
    if (args.length > 0) {
      let other = args[0];
      if (this.isNow(other)) {
        other = other.date;
      }
      return minus(date, other);
    }
    return minus(this.date, date);
  }

  // return the relativeTime format
  elapse(date) {
    let now;
    let subs;

    if (date) {
      now = new Date();
      if (this.isNow(date)) {
        subs = minus(date.date, now);
      } else {
        subs = minus(date, now);
      }
    }
    now = new Date();
    subs = minus(this.date, now);
    return new this._duration(subs).human(this, true);
  }

  // return the time elapsed since date
  since(date, ...args) {
    if (isUndefined(date)) {
      throw new Error("since must be receive more than one argument");
    }
    if (this.isNow(date)) {
      date = date.date;
    }
    if (args.length > 0) {
      let other = args[0];
      if (this.isNow(other)) {
        other = other.date;
      }
      return this.sub(other, date);
    }
    const now = new Date();
    return this.sub(now, date);
  }

  getDateOffset() {
    return -Math.round(this.date.getTimezoneOffset() / 15) * 15;
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
        minutes = minutes * 60;
      }
      if (!this._isUTC && keepLocalTime) {
        localAdjust = this.getDateOffset();
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
    } else {
      return this._isUTC ? offset : this.getDateOffset();
    }
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

initLocale();

export default Now;
