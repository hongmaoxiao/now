import {
  invalidDateError,
  invalidDateRegExp,
  compare,
  slice,
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
  defineLocale,
  defaultFormat,
  defaultFormatUtc,
  matchOffset,
  matchShortOffset,
  isLeapYear,
  getSetWeekYearHelper,
  weekOfYear,
  weeksInYear,
  parseIsoWeekday,
} from './utils';

import format from './Format';

const metaSecond = 1000;
const metaMinute = 60 * metaSecond;
const metaHour = 60 * metaMinute;
const metaDay = 24 * metaHour;
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

class Now {
  constructor(...args) {
    this.mondayFirst = false;
    this.now = new Date(...args);
    if (invalidDateRegExp.test(this.now)) {
      throw new TypeError(invalidDateError);
    }
    this._format = format;
    this._isUTC = false;
    this.now.parse = this.parse;
    this.initLocale();
    this.initDate();
    this.initIsDate();
  }

  static defineLocale(name, config) {
    return defineLocale(name, config);
  }

  localeData(key) {
    return localeData(key);
  }

  initLocale() {
    locale('en', {
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
    return () => {
      const weekDay = that.now.getDay();
      that.mondayFirst = false;
      if (weekDay === 0) {
        // today is sunday, so get before sunday
        let offset = index;
        if (index === 0) {
          offset = 7;
        }
        return that.computeBeginningOfWeek().addDays(-(7 - offset)).date;
      }
      // today is not sunday, so get after sunday
      let offset = index;
      if (index === 0) {
        offset = 7;
      }
      return that.computeBeginningOfWeek().addDays(offset).date;
    };
  }

  isDateIterator(index) {
    const that = this;
    return () => that.now.getDay() === index;
  }

  get value() {
    return +this.now;
  }

  get date() {
    return this.now;
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
    return (+val === 0 || val) ? this.addDays((input - week) * 7) : week;
  }

  isoWeek(val) {
    const week = weekOfYear(this, 1, 4).week;
    return (+val === 0 || val) ? this.addDays((input - week) * 7) : week;
  }

  day(val) {
    return (+val === 0 || val) ? nativeSet.call(this, 'Date', val) : nativeGet.call(this, 'Date');
  }

  weekDay(val) {
    return (+val === 0 || val) ? nativeSet.call(this, 'Day', val) : nativeGet.call(this, 'Day');
  }

  localeWeekDay(val) {
    const localeWeekDay = (this.weekDay() + 7 - this.localeData()._week.dow) % 7;
    return (+val === 0 || val) ? this.addDays(val - localeWeekDay) : localeWeekDay;
  }

  isoWeekDay() {
    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.

    if (+val === 0 || val) {
      const isoWeekDay = parseIsoWeekday(val, this.localeData());
      return this.day(this.day() === 0 ? isoWeekDay - 7 : isoWeekDay);
    } else {
      this.day() || 7;
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

  unixr() {
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

  clone() {
    return new Now(this.date);
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

  parse(ifMiliSecond) {
    let context;
    if (this instanceof Now) {
      context = this.date;
    } else {
      context = this;
    }
    const year = context.getFullYear();
    let month = context.getMonth() + 1;
    let date = context.getDate();
    let hour = context.getHours();
    let minute = context.getMinutes();
    let second = context.getSeconds();
    const milliSecond = context.getMilliseconds();
    month = month < 10 ? `0${month}` : month;
    date = date < 10 ? `0${date}` : date;
    hour = hour < 10 ? `0${hour}` : hour;
    minute = minute < 10 ? `0${minute}` : minute;
    second = second < 10 ? `0${second}` : second;
    if (ifMiliSecond) {
      return `${year}-${month}-${date} ${hour}:${minute}:${second}.${milliSecond}`;
    }
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
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

  beginningOfMinute() {
    return this.computeBeginningOfMinute().date;
  }

  beginningOfHour() {
    return this.computeBeginningOfHour().date;
  }

  beginningOfDay() {
    return this.computeBeginningOfDay().date;
  }

  beginningOfWeek() {
    return this.computeBeginningOfWeek().date;
  }

  beginningOfMonth() {
    return this.computeBeginningOfMonth().date;
  }

  beginningOfQuarter() {
    return this.computeBeginningOfQuarter().date;
  }

  beginningOfYear() {
    return this.computeBeginningOfYear().date;
  }

  endOfMinute() {
    return this.clone().computeBeginningOfMinute().addMilliSeconds(metaMinute - 1).date;
  }

  endOfHour() {
    return this.clone().computeBeginningOfHour().addMilliSeconds(metaHour - 1).date;
  }

  endOfDay() {
    return this.clone().computeBeginningOfDay().addMilliSeconds(metaDay - 1).date;
  }

  endOfWeek() {
    const clone = this.clone();
    clone.firstDayMonday = this.firstDayMonday;
    return clone.computeBeginningOfWeek().addMilliSeconds((7 * metaDay) - 1).date;
  }

  endOfMonth() {
    return this.clone().computeBeginningOfMonth().addMonths(1).addMilliSeconds(-1).date;
  }

  endOfQuarter() {
    return this.clone().computeBeginningOfQuarter().addMonths(3).addMilliSeconds(-1).date;
  }

  endOfYear() {
    return this.clone().computeBeginningOfYear().addYears(1).addMilliSeconds(-1).date;
  }

  dayOfYear() {
    return Math.round((this.beginningOfDay() - this.beginningOfYear()) / metaDay) + 1;
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

  isLeapYear() {
    return isLeapYear();
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
    let compares = slice.call(args);
    let index = 0;
    const len = compares.length;
    if (len === 0) {
      throw new Error('min require at least one argument');
    }
    const some = compares.some(value => !isDate(value));
    if (some) {
      throw new TypeError('min require Date type');
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
    let compares = slice.call(args);
    let index = 0;
    const len = compares.length;
    if (len === 0) {
      throw new Error('max require at least one argument');
    }
    const some = compares.some(value => !isDate(value));
    if (some) {
      throw new TypeError('max require Date type');
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
    if (!(isDate(date1) && isDate(date2))) {
      throw new TypeError('arguments must be Date type');
    }
    return this.after(date1) && this.before(date2);
  }

  // return the duration this.date - date.
  sub(date, ...args) {
    if (args.length > 0) {
      return minus(date, args[0]);
    }
    return minus(this.date, date);
  }

  // return the time elapsed by now
  elapse() {
    const now = new Date();
    return minus(now, this.date);
  }

  // return the time elapsed since date
  since(date, ...args) {
    if (args.length > 0) {
      return this.sub(args[0], date);
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


  // parseZone() {
  //   if (this._tzm != null) {
  //     this.utcOffset(this._tzm, false, true);
  //   }
  //   if (isString(this._i)) {
  //     const tZone = offsetFromString(matchOffset, this._i);
  //     if (tZone != null) {
  //       this.utcOffset(tZone);
  //     } else {
  //       this.utcOffset(0, true);
  //     }
  //   }
  //   return this;
  // }

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

default Now;

