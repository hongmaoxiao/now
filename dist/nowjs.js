(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Now = factory());
}(this, (function () { 'use strict';

/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
/* eslint prefer-destructuring: ["error", { "object": false }] */
/* eslint no-void: 0 */
/* global isFinite */

var toString = Object.prototype.toString;
var nativeIsArray = Array.isArray;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var nativeDatetoISOString = Date.prototype.toISOString;

var SECOND = 1000;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

var invalidDateError = 'Invalid Date';
var invalidDateRegExp = /Invalid Date/;
var defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
var defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';



 // +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

function isDate(value) {
  return value instanceof Date || toString.call(value) === '[object Date]';
}

function isString(value) {
  return typeof value === 'string' || toString.call(value) === '[object String]';
}

function isNumber(value) {
  return typeof value === 'number' || toString.call(value) === '[object Number]';
}

function isNaN(value) {
  return isNumber && value !== +value;
}

function isUndefined(value) {
  return value === void 0;
}

function isFunction(value) {
  return value instanceof Function || toString.call(value) === '[object Function]';
}

function isArray(value) {
  return nativeIsArray(value) || toString.call(value) === '[object Array]';
}

function isObject(value) {
  // return value === Object(value);
  return value != null && Object.prototype.toString.call(value) === '[object Object]';
}

function isArguments(value) {
  return toString.call(value) === '[object Arguments]';
}

function zeroFill(number, targetLength, forceSign) {
  var absNumber = '' + Math.abs(number);
  var zeroToFill = targetLength - absNumber.length;
  var sign = number >= 0;
  return (sign ? forceSign ? '+' : '' : '-') + Math.pow(10, Math.max(0, zeroToFill)).toString().substr(1) + absNumber;
}

var isArrayLike = function isArrayLike(obj) {
  var len = obj.length;
  return typeof len === 'number' && len >= 0 && len < MAX_ARRAY_INDEX;
};

var baseFlatten = function baseFlatten(input, shallow, strict, output) {
  var res = output || [];
  var inputLen = input.length;
  var idx = res.length;
  var i = void 0;

  for (i = 0; i < inputLen; i += 1) {
    var value = input[i];

    if (isArrayLike(value) && isArray(value) || isArguments(value)) {
      if (shallow) {
        var j = 0;
        var len = value.length;

        while (j < len) {
          res[idx] = value[j];
          idx += 1;
          j += 1;
        }
      } else {
        baseFlatten(value, shallow, strict, res);
        idx = res.length;
      }
    } else if (!strict) {
      res[idx] = value;
      idx += 1;
    }
  }

  return res;
};

var flatten = function flatten(array, shallow) {
  return baseFlatten(array, shallow, false);
};

function has(obj, key) {
  return hasOwnProperty.call(obj, key);
}

var keys = Object.keys || function (obj) {
  var i = void 0;
  var res = [];
  /* eslint no-restricted-syntax: ["error", "BinaryExpression[operator='in']"] */
  for (i in obj) {
    if (has(obj, i)) {
      res[res.length] = i;
    }
  }
  return res;
};

function absCeil(number) {
  return number < 0 ? Math.floor(number) : Math.ceil(number);
}

function absFloor(number) {
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}



// 400 years have 146097 days (taking into account leap year rules)
// 400 years have 12 months === 4800
var daysToMonths = function daysToMonths(days) {
  return days * 4800 / 146097;
};

// the reverse of daysToMonths
var monthsToDays = function monthsToDays(months) {
  return months * 146097 / 4800;
};

function toInt(number) {
  /* eslint no-restricted-globals: [ 0 ] */
  return +number !== 0 && isFinite(+number) ? absFloor(+number) : 0;
}

var isLeapYear = function isLeapYear(year) {
  return year % 100 !== 0 && year % 4 === 0 || year % 400 === 0;
};

function minus(date1, date2) {
  if (isUndefined(date1) || isUndefined(date2)) {
    throw new Error('arguments must be defined');
  }
  if (!(isDate(date1) && isDate(date2))) {
    throw new TypeError('arguments must be Date type');
  }
  return date1 - date2;
}

function extend(a, b) {
  var res = a;
  var bKeys = keys(b);
  var bKeysLen = bKeys.length;
  var i = void 0;

  for (i = 0; i < bKeysLen; i += 1) {
    if (has(b, bKeys[i])) {
      res[bKeys[i]] = b[bKeys[i]];
    }
  }

  if (has(b, 'toString')) {
    res.toString = b.toString;
  }

  if (has(b, 'valueOf')) {
    res.valueOf = b.valueOf;
  }

  return res;
}

function compareArrays(array1, array2, dontConvert) {
  var l1 = array1.length;
  var l2 = array1.length;
  var len = Math.min(l1, l2);
  var lenthDiff = Math.abs(l1 - l2);
  var diffs = 0;
  var i = void 0;

  for (i = 0; i < len; i += 1) {
    if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
      diffs += 1;
    }
  }
  return diffs + lenthDiff;
}



var daysInYear = function daysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
};

var createUTCDate = function createUTCDate() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new Date(Date.UTC.apply(null, args));
};

var firstWeekOffset = function firstWeekOffset(year, dow, doy) {
  // first-week day -- which january is always in the first week (4 for iso, 1 for other)
  var fwd = 7 + dow - doy;
  // first-week day local weekday -- which local weekday is fwd
  var fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

  return -fwdlw + fwd - 1;
};

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
var dayOfYearFromWeeks = function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
  var localWeekday = (7 + weekday - dow) % 7;
  var weekOffset = firstWeekOffset(year, dow, doy);
  var dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset;
  var resYear = void 0;
  var resDayOfYear = void 0;

  if (dayOfYear <= 0) {
    resYear = year - 1;
    resDayOfYear = daysInYear(resYear) + dayOfYear;
  } else if (dayOfYear > daysInYear(year)) {
    resYear = year + 1;
    resDayOfYear = dayOfYear - daysInYear(year);
  } else {
    resYear = year;
    resDayOfYear = dayOfYear;
  }

  return {
    year: resYear,
    dayOfYear: resDayOfYear
  };
};

var weeksInYear = function weeksInYear(year, dow, doy) {
  var weekOffset = firstWeekOffset(year, dow, doy);
  var weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
  return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
};

var weekOfYear = function weekOfYear(mom, dow, doy) {
  var weekOffset = firstWeekOffset(mom.year(), dow, doy);
  var week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1;
  var resWeek = void 0;
  var resYear = void 0;

  if (week < 1) {
    resYear = mom.year() - 1;
    resWeek = week + weeksInYear(resYear, dow, doy);
  } else if (week > weeksInYear(mom.year(), dow, doy)) {
    resWeek = week - weeksInYear(mom.year(), dow, doy);
    resYear = mom.year() + 1;
  } else {
    resYear = mom.year();
    resWeek = week;
  }

  return {
    week: resWeek,
    year: resYear
  };
};

function setWeekAll(weekYear, week, weekday, dow, doy) {
  var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
  var date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

  this.year(date.getUTCFullYear());
  this.month(date.getUTCMonth());
  this.day(date.getUTCDate());
  return this;
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
  var weekCanBeModify = week;

  if (input == null) {
    return weekOfYear(this, dow, doy).year;
  }
  var weeksTarget = weeksInYear(input, dow, doy);
  if (weekCanBeModify > weeksTarget) {
    weekCanBeModify = weeksTarget;
  }
  return setWeekAll.call(this, input, weekCanBeModify, weekday, dow, doy);
}

var parseIsoWeekday = function parseIsoWeekday(input, locale) {
  if (isString(input)) {
    return locale.weekdaysParse(input) % 7 || 7;
  }
  return isNaN(input) ? null : input;
};

var parseWeekday = function parseWeekday(input, locale) {
  var beParse = input;
  if (isString(beParse)) {
    return beParse;
  }

  if (!isNaN(beParse)) {
    return parseInt(beParse, 10);
  }

  beParse = locale.weekdaysParse(beParse);
  if (isNumber(beParse)) {
    return beParse;
  }

  return null;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true} ] */
/* eslint class-methods-use-this: [
  "error",
  { "exceptMethods": ["preparse", "postformat", "isPM", "meridiem"] }
]
*/
var MONTHS_IN_FORMAT = /D[oD]?(\[[^[\]]*\]|\s)+MMMM?/;

var Locale = function () {
  function Locale(config) {
    classCallCheck(this, Locale);

    if (config != null) {
      this.set(config);
    }
  }

  createClass(Locale, [{
    key: 'calendar',
    value: function calendar(key, mom, now) {
      var output = this._calendar[key] || this._calendar.sameElse;
      return isFunction(output) ? output.call(mom, now) : output;
    }
  }, {
    key: 'longDateFormat',
    value: function longDateFormat(key) {
      var format = this._longDateFormat[key];
      var formatUpper = this._longDateFormat[key.toUpperCase()];

      if (format || !formatUpper) {
        return format;
      }

      this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
      });

      return this._longDateFormat[key];
    }
  }, {
    key: 'invalidDate',
    value: function invalidDate() {
      return this._invaliDate;
    }
  }, {
    key: 'ordinal',
    value: function ordinal(number) {
      this._ordinal.replace('%d', number);
    }
  }, {
    key: 'preparse',
    value: function preparse(string) {
      return string;
    }
  }, {
    key: 'postformat',
    value: function postformat(string) {
      return string;
    }
  }, {
    key: 'relativeTime',
    value: function relativeTime(number, withoutSuffix, string, isFuture) {
      var output = this._relativeTime[string];
      return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
    }
  }, {
    key: 'pastFuture',
    value: function pastFuture(diff, output) {
      var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
      return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }
  }, {
    key: 'set',
    value: function set$$1(config) {
      var keys$$1 = Object.keys(config);
      var len = keys$$1.length;
      var prop = void 0;
      var i = void 0;

      for (i = 0; i <= len; i += 1) {
        prop = config[keys$$1[i]];
        if (isFunction(prop)) {
          this[keys$$1[i]] = prop;
        } else {
          this['_' + keys$$1[i]] = prop;
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
  }, {
    key: 'months',
    value: function months(context, format) {
      if (!context) {
        return isArray(this._months) ? this._months : this._months.standalone;
      }
      return isArray(this._months) ? this._months[context.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][context.month()];
    }
  }, {
    key: 'monthsShort',
    value: function monthsShort(m, format) {
      if (!m) {
        return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone;
      }
      return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }
  }, {
    key: 'week',
    value: function week(mom) {
      return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }
  }, {
    key: 'firstDayOfWeek',
    value: function firstDayOfWeek() {
      return this._week.dow;
    }
  }, {
    key: 'firstDayOfYear',
    value: function firstDayOfYear() {
      return this._week.doy;
    }
  }, {
    key: 'weekdays',
    value: function weekdays(m, format) {
      if (!m) {
        return isArray(this._weekdays) ? this._weekdays : this._weekdays.standalone;
      }
      return isArray(this._weekdays) ? this._weekdays[m.weekDay()] : this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.weekDay()];
    }
  }, {
    key: 'weekdaysShort',
    value: function weekdaysShort(m) {
      return m ? this._weekdaysShort[m.weekDay()] : this._weekdaysShort;
    }
  }, {
    key: 'weekdaysMin',
    value: function weekdaysMin(m) {
      return m ? this._weekdaysMin[m.weekDay()] : this._weekdaysMin;
    }
  }, {
    key: 'isPM',
    value: function isPM(input) {
      // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
      // Using charAt should be more compatible.
      return ('' + input).toLowerCase().charAt(0) === 'p';
    }
  }, {
    key: 'meridiem',
    value: function meridiem(hours, minutes, isLower) {
      if (hours > 11) {
        return isLower ? 'pm' : 'PM';
      }
      return isLower ? 'am' : 'AM';
    }
  }]);
  return Locale;
}();

var defaultCalendar = {
  sameDay: '[Today at] LT',
  nextDay: '[Tomorrow at] LT',
  nextWeek: 'dddd [at] LT',
  lastDay: '[Yesterday at] LT',
  lastWeek: '[Last] dddd [at] LT',
  sameElse: 'L'
};

var defaultLongDateFormat = {
  LTS: 'h:mm:ss A',
  LT: 'h:mm A',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A'
};

var defaultInvalidDate = 'Invalid date';

var defaultOrdinal = '%d';
var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

var defaultRelativeTime = {
  future: 'in %s',
  past: '%s ago',
  s: 'a few seconds',
  ss: '%d seconds',
  m: 'a minute',
  mm: '%d minutes',
  h: 'an hour',
  hh: '%d hours',
  d: 'a day',
  dd: '%d days',
  M: 'a month',
  MM: '%d months',
  y: 'a year',
  yy: '%d years'
};

var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');

var defaultLocaleWeek = {
  dow: 0, // Sunday is the first day of the week.
  doy: 6 // The week that contains Jan 1st is the first week of the year.
};

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');

var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;

var baseConfig = {
  calendar: defaultCalendar,
  longDateFormat: defaultLongDateFormat,
  invalidDate: defaultInvalidDate,
  ordinal: defaultOrdinal,
  dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
  relativeTime: defaultRelativeTime,

  months: defaultLocaleMonths,
  monthsShort: defaultLocaleMonthsShort,

  week: defaultLocaleWeek,

  weekdays: defaultLocaleWeekdays,
  weekdaysMin: defaultLocaleWeekdaysMin,
  weekdaysShort: defaultLocaleWeekdaysShort,

  meridiemParse: defaultLocaleMeridiemParse
};

//! now.js locale configuration
//! locale : Chinese (China) [zh-cn]
//! author : suupic : https://github.com/suupic
//! author : Zeno Zeng : https://github.com/zenozeng

var zhcn = {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY年MMMD日',
    LL: 'YYYY年MMMD日',
    LLL: 'YYYY年MMMD日Ah点mm分',
    LLLL: 'YYYY年MMMD日ddddAh点mm分',
    l: 'YYYY年MMMD日',
    ll: 'YYYY年MMMD日',
    lll: 'YYYY年MMMD日 HH:mm',
    llll: 'YYYY年MMMD日dddd HH:mm'
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    var h = hour;
    if (h === 12) {
      h = 0;
    }
    if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
      return h;
    } else if (meridiem === '下午' || meridiem === '晚上') {
      return h + 12;
    }
    // '中午'
    return h >= 11 ? h : h + 12;
  },
  meridiem: function meridiem(hour, minute) {
    var hm = hour * 100 + minute;
    if (hm < 600) {
      return '凌晨';
    } else if (hm < 900) {
      return '早上';
    } else if (hm < 1130) {
      return '上午';
    } else if (hm < 1230) {
      return '中午';
    } else if (hm < 1800) {
      return '下午';
    }
    return '晚上';
  },

  calendar: {
    sameDay: '[今天]LT',
    nextDay: '[明天]LT',
    nextWeek: '[下]ddddLT',
    lastDay: '[昨天]LT',
    lastWeek: '[上]ddddLT',
    sameElse: 'L'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
  ordinal: function ordinal(number, period) {
    switch (period) {
      case 'd':
      case 'D':
      case 'DDD':
        return number + '\u65E5';
      case 'M':
        return number + '\u6708';
      case 'w':
      case 'W':
        return number + '\u5468';
      default:
        return number;
    }
  },

  relativeTime: {
    future: '%s内',
    past: '%s前',
    s: '几秒',
    m: '1 分钟',
    mm: '%d 分钟',
    h: '1 小时',
    hh: '%d 小时',
    d: '1 天',
    dd: '%d 天',
    M: '1 个月',
    MM: '%d 个月',
    y: '1 年',
    yy: '%d 年'
  },
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

var i18ns = {
  'zh-cn': zhcn
};

/* eslint no-underscore-dangle: ["error",
{ "allowAfterThis": true, "allow": ["_config", "_locale", "_abbr"] }
] */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint no-use-before-define: ["error", { "functions": false }] */
var hookCallback = void 0;
function hooks() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return hookCallback(args);
}



function warn(msg) {
  if (hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
    console.warn('Deprecation warning: ' + msg);
  }
}



var deprecations = {};

function deprecateSimple(name, msg) {
  if (hooks.deprecationHandler != null) {
    hooks.deprecationHandler(name, msg);
  }
  if (!deprecations[name]) {
    warn(msg);
    deprecations[name] = true;
  }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function mergeConfigs(parentConfig, childConfig) {
  var res = extend({}, parentConfig);
  var i = void 0;
  var j = void 0;
  var cKeys = keys(childConfig);
  var cLen = cKeys.length;
  var pKeys = keys(parentConfig);
  var pLen = pKeys.length;

  for (i = 0; i < cLen; i += 1) {
    if (has(childConfig, cKeys[i])) {
      if (isObject(parentConfig[cKeys[i]]) && isObject(childConfig[cKeys[i]])) {
        res[cKeys[i]] = {};
        extend(res[cKeys[i]], parentConfig[cKeys[i]]);
        extend(res[cKeys[i]], childConfig[cKeys[i]]);
      } else if (childConfig[cKeys[i]] != null) {
        res[cKeys[i]] = childConfig[cKeys[i]];
      } else {
        delete res[cKeys[i]];
      }
    }
  }

  for (j = 0; j < pLen; j += 1) {
    if (has(parentConfig, cKeys[j]) && !has(childConfig, cKeys[j]) && isObject(parentConfig[cKeys[j]])) {
      // make sure changes to properties don't modify parent config
      res[cKeys[j]] = extend({}, res[cKeys[j]]);
    }
  }

  return res;
}

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale = void 0;

function normalizeLocale(key) {
  return key ? key.toLowerCase().replace('_', '-') : key;
}

function defineLocale(name, config) {
  var configCanBeModify = config;
  if (configCanBeModify !== null) {
    var parentConfig = baseConfig;
    configCanBeModify.abbr = name;
    if (locales[name] != null) {
      deprecateSimple('defineLocaleOverride', 'use Now.updateLocale(localeName, config) to change ' + 'an existing locale. Now.defineLocale(localeName, ' + 'config) should only be used for creating a new locale');

      parentConfig = locales[name]._config;
    } else if (configCanBeModify.parentLocale != null) {
      if (locales[configCanBeModify.parentLocale] != null) {
        parentConfig = locales[configCanBeModify.parentLocale]._config;
      } else {
        if (!localeFamilies[configCanBeModify.parentLocale]) {
          localeFamilies[configCanBeModify.parentLocale] = [];
        }
        localeFamilies[configCanBeModify.parentLocale].push({
          name: name,
          configCanBeModify: configCanBeModify
        });
        return null;
      }
    }
    locales[name] = new Locale(mergeConfigs(parentConfig, configCanBeModify));

    if (localeFamilies[name]) {
      localeFamilies[name].forEach(function (x) {
        defineLocale(x.name, x.config);
      });
    }

    // backwards compat for now: also set the locale
    // make sure we set the locale AFTER all child locales have been
    // created, so we won't end up with the child locale set.
    getSetGlobalLocale(name);

    return locales[name];
  }
  // useful for testing
  delete locales[name];
  return null;
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale(key, values) {
  var data = void 0;
  if (key) {
    if (isUndefined(values)) {
      data = getLocale(key);
    } else {
      data = defineLocale(key, values);
    }

    if (data) {
      globalLocale = data;
    }
  }

  // return globalLocale._abbr;
}

function loadLocale(name) {
  var oldLocale = null;
  if (!locales[name]) {
    oldLocale = globalLocale && globalLocale._abbr;
    defineLocale(name, i18ns[name]);
    getSetGlobalLocale(oldLocale);
  }
  return locales[name];
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list
// trying each substring from most specific to least, but move to the next array
// item if it's a more specific variant than the current root
function chooseLocale(names) {
  var i = 0;
  var j = void 0;
  var next = void 0;
  var locale = void 0;
  var split = void 0;

  while (i < names.length) {
    split = normalizeLocale(names[i]).split('-');
    j = split.length;
    next = normalizeLocale(names[i + 1]);
    next = next ? next.split('-') : null;
    while (j > 0) {
      locale = loadLocale(split.slice(0, j).join('-'));
      if (locale) {
        return locale;
      }
      if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
        // the next array item is better than a shallower substring of this one
        break;
      }
      j -= 1;
    }
    i += 1;
  }

  return null;
}

// returns locale data
function getLocale(key) {
  var locale = void 0;
  var keyCanBeModify = key;

  if (keyCanBeModify && keyCanBeModify._locale && keyCanBeModify._locale._abbr) {
    keyCanBeModify = keyCanBeModify._locale._abbr;
  }

  if (!keyCanBeModify) {
    return globalLocale;
  }

  if (!isArray(keyCanBeModify)) {
    // short-circuit everything else
    locale = loadLocale(keyCanBeModify);
    if (locale) {
      return locale;
    }
    keyCanBeModify = [keyCanBeModify];
  }

  return chooseLocale(keyCanBeModify);
}

function updateLocale(name, config) {
  var configCanBeModify = config;
  if (configCanBeModify != null) {
    var parentConfig = baseConfig;
    // MERGE
    if (locales[name] != null) {
      parentConfig = locales[name]._config;
    }
    configCanBeModify = mergeConfigs(parentConfig, configCanBeModify);
    var locale = new Locale(configCanBeModify);
    locale.parentLocale = locales[name];
    locales[name] = locale;

    // backwards compat for now: also set the locale
    getSetGlobalLocale(name);
  } else {
    // pass null for config to unupdate, useful for tests
    /* eslint no-lonely-if: 0 */
    if (locales[name] != null) {
      if (locales[name].parentLocale != null) {
        locales[name] = locales[name].parentLocale;
      } else if (locales[name] != null) {
        delete locales[name];
      }
    }
  }
  return locales[name];
}

var listLocales = function listLocales() {
  return keys(i18ns);
};

/* eslint no-bitwise: ["error", { "allow": ["~"] }] */
var formattingTokens = /(\[[^[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
var localFormattingTokens = /(\[[^[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var removeFormattingTokens = function removeFormattingTokens(input) {
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
    var offset = this.utcOffset();
    var sign = '+';
    if (offset < 0) {
      offset = -offset;
      sign = '-';
    }
    return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~offset % 60, 2);
  });
}

var Format = function () {
  function Format() {
    classCallCheck(this, Format);

    this.formattingTokens = formattingTokens;
    this.localFormattingTokens = localFormattingTokens;
    this.formatFunctions = {};
    this.formatTokenFunctions = {};
    this.initFormat();
  }

  createClass(Format, [{
    key: 'initFormat',
    value: function initFormat() {
      // year
      this.addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
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
        return '' + hFormat.apply(this) + zeroFill(this.minute(), 2);
      });
      this.addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minute(), 2) + zeroFill(this.second(), 2);
      });
      this.addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hour() + zeroFill(this.minute(), 2);
      });
      this.addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hour() + zeroFill(this.minute(), 2) + zeroFill(this.second(), 2);
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
  }, {
    key: 'addFormatToken',
    value: function addFormatToken(token, padded, ordinal, callback) {
      var func = callback;
      if (typeof callback === 'string') {
        func = function func() {
          return this[callback]();
        };
      }
      if (token) {
        this.formatTokenFunctions[token] = func;
      }
      if (padded) {
        this.formatTokenFunctions[padded[0]] = function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return zeroFill(func.apply(this, args), padded[1], padded[2]);
        };
      }
      if (ordinal) {
        this.formatTokenFunctions[ordinal] = function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return this.localeData().ordinal(func.apply(this, args), token);
        };
      }
    }
  }, {
    key: 'makeFormatFunction',
    value: function makeFormatFunction(format) {
      var array = format.match(this.formattingTokens);
      var len = array.length;
      var i = void 0;

      for (i = 0; i < len; i += 1) {
        if (this.formatTokenFunctions[array[i]]) {
          array[i] = this.formatTokenFunctions[array[i]];
        } else {
          array[i] = removeFormattingTokens(array[i]);
        }
      }

      return function (context) {
        var output = '';
        var j = 0;

        for (j = 0; j < len; j += 1) {
          output += isFunction(array[j]) ? array[j].call(context, format) : array[j];
        }
        return output;
      };
    }
  }, {
    key: 'formatMoment',
    value: function formatMoment(context, format) {
      var f = format;
      f = this.expandFormat(f, context.localeData());
      this.formatFunctions[f] = this.formatFunctions[f] || this.makeFormatFunction(f);

      return this.formatFunctions[f](context);
    }
  }, {
    key: 'expandFormat',
    value: function expandFormat(format, locale) {
      var i = 5;
      var f = format;

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
  }]);
  return Format;
}();

var format = new Format();

/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true} ] */
var round = Math.round;

var thresholds = {
  ss: 44, // a few seconds to seconds
  s: 45, // seconds to minute
  m: 45, // minutes to hour
  h: 22, // hours to day
  d: 26, // days to month
  M: 11 // months to year
};

function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
  return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

var Duration = function () {
  function Duration(val) {
    classCallCheck(this, Duration);

    var d = val;
    d = d || (d = 0);
    d = isNumber(parseInt(d, 10)) ? d : 0;
    this._data = {};
    this._milliSeconds = d;
    this.init();
  }

  createClass(Duration, [{
    key: 'init',
    value: function init() {
      var millis = this._milliSeconds;
      var seconds = absFloor(millis / SECOND);
      var minutes = absFloor(millis / MINUTE);
      var hours = absFloor(millis / HOUR);
      var days = void 0;
      var months = void 0;

      this._data.milliSeconds = millis % SECOND;
      this._data.seconds = seconds % 60;
      this._data.minutes = minutes % 60;

      this._data.hours = hours % 24;
      days = absFloor(hours / 24);

      var monthsFromDays = absFloor(daysToMonths(days));
      months = monthsFromDays;
      days -= absCeil(monthsToDays(monthsFromDays));

      var years = absFloor(months / 12);
      months %= 12;

      this._data.days = days;
      this._data.months = months;
      this._data.years = years;
    }
  }, {
    key: 'valueOf',
    value: function valueOf() {
      return this.value;
    }
  }, {
    key: 'relativeTime',
    value: function relativeTime(withoutSuffix, locale) {
      var mathAbs = Math.abs;

      var seconds = mathAbs(this.seconds());
      var minutes = mathAbs(this.minutes());
      var hours = mathAbs(this.hours());
      var days = mathAbs(this.days());
      var months = mathAbs(this.months());
      var years = mathAbs(this.years());

      var a = seconds <= thresholds.ss && ['s', seconds] || seconds < thresholds.s && ['ss', seconds] || minutes <= 1 && ['m'] || minutes < thresholds.m && ['mm', minutes] || hours <= 1 && ['h'] || hours < thresholds.h && ['hh', hours] || days <= 1 && ['d'] || days < thresholds.d && ['dd', days] || months <= 1 && ['M'] || months < thresholds.M && ['MM', months] || years <= 1 && ['y'] || ['yy', years];

      a[2] = withoutSuffix;
      a[3] = +this > 0;
      a[4] = locale;
      return substituteTimeAgo.apply(undefined, toConsumableArray(a));
    }
  }, {
    key: 'human',
    value: function human(context, withSuffix) {
      var locale = context.localeData();
      var output = this.relativeTime(!withSuffix, locale);

      if (withSuffix) {
        output = locale.pastFuture(+this, output);
      }
      return locale.postformat ? locale.postformat(output) : output;
    }
  }, {
    key: 'computeMonth',
    value: function computeMonth() {
      return daysToMonths(this.value / DAY);
    }
  }, {
    key: 'years',
    value: function years() {
      return round(this.computeMonth() / 12);
    }
  }, {
    key: 'months',
    value: function months() {
      return round(this.computeMonth());
    }
  }, {
    key: 'weeks',
    value: function weeks() {
      return round(this.value / DAY / 7);
    }
  }, {
    key: 'days',
    value: function days() {
      return round(this.value / DAY);
    }
  }, {
    key: 'hours',
    value: function hours() {
      return round(this.value / HOUR);
    }
  }, {
    key: 'minutes',
    value: function minutes() {
      return round(this.value / MINUTE);
    }
  }, {
    key: 'seconds',
    value: function seconds() {
      return round(this.value / SECOND);
    }
  }, {
    key: 'milliSeconds',
    value: function milliSeconds() {
      return this.value;
    }
  }, {
    key: 'value',
    get: function get$$1() {
      return this._milliSeconds;
    }
  }]);
  return Duration;
}();

/* eslint no-underscore-dangle: ["error",
{ "allowAfterThis": true, "allow": ["_isUTC", "_week"] }
] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["version", "localeData"] }] */
var VERSION = '0.2.0';
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var chunkOffset = /([+-]|\d\d)/gi;

function nativeGet(unit) {
  var getName = this._isUTC ? 'getUTC' + unit : 'get' + unit;
  return this.date[getName]();
}

function nativeSet(unit, val) {
  var setValue = val;
  setValue = parseInt(setValue, 10);
  var setName = this._isUTC ? 'setUTC' + unit : 'set' + unit;
  if (isNumber(setValue)) {
    this.date[setName](setValue);
  }
  return this;
}

function offsetFromString(matcher, string) {
  var matches = (string || '').match(matcher);

  if (matches === null) {
    return null;
  }

  var chunk = matches[matches.length - 1] || [];
  var parts = ('' + chunk).match(chunkOffset) || ['-', 0, 0];
  var minutes = +(parts[1] * 60) + toInt(parts[2]);

  return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
}

function compare(date1, date2) {
  if (isUndefined(date1) || isUndefined(date2)) {
    throw new Error('arguments can not be undefined');
  } else if (!(isDate(date1) && isDate(date2))) {
    throw new TypeError('arguments require Date type');
  } else {
    return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
  }
}

var getDateOffset = function getDateOffset(date) {
  return -Math.round(date.getTimezoneOffset() / 15) * 15;
};

var Now$1 = function () {
  function Now() {
    classCallCheck(this, Now);

    this.mondayFirst = false;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.now = new (Function.prototype.bind.apply(Date, [null].concat(args)))();
    if (invalidDateRegExp.test(this.now)) {
      throw new Error(invalidDateError);
    }
    this._format = format;
    this._duration = Duration;
    this._isUTC = false;
    this.initDate();
    this.initIsDate();
  }

  createClass(Now, [{
    key: 'localeData',
    value: function localeData(key) {
      return getLocale(key);
    }
  }, {
    key: 'locale',
    value: function locale(obj) {
      getSetGlobalLocale(obj);
      return this;
    }
  }, {
    key: 'initDate',
    value: function initDate() {
      var index = 0;
      var len = days.length;

      while (index < len) {
        var lower = days[index].toLowerCase();
        this[lower] = this.dateIterator(index);
        index += 1;
      }
    }
  }, {
    key: 'initIsDate',
    value: function initIsDate() {
      var index = 0;
      var len = days.length;

      while (index < len) {
        this['is' + days[index]] = this.isDateIterator(index);
        index += 1;
      }
    }
  }, {
    key: 'dateIterator',
    value: function dateIterator(index) {
      var that = this;
      var dayObj = void 0;
      return function (val) {
        var weekDay = that.now.getDay();
        that.mondayFirst = false;
        if (weekDay === 0) {
          // today is sunday, so get before sunday
          var _offset = index;
          if (index === 0) {
            _offset = 7;
          }
          dayObj = that.beginningOfWeek('self').addDays(-(7 - _offset));
          return val && val === 'self' ? dayObj : dayObj.format('YYYY-MM-DD HH:mm:ss');
        }
        // today is not sunday, so get after sunday
        var offset = index;
        if (index === 0) {
          offset = 7;
        }
        dayObj = that.beginningOfWeek('self').addDays(offset);
        return val && val === 'self' ? dayObj : dayObj.format('YYYY-MM-DD HH:mm:ss');
      };
    }
  }, {
    key: 'isDateIterator',
    value: function isDateIterator(index) {
      var that = this;
      return function () {
        return that.now.getDay() === index;
      };
    }
  }, {
    key: 'UTC',
    value: function UTC() {
      var len = arguments.length;
      var clone = void 0;
      if (len > 0) {
        clone = this.clone(Date.UTC.apply(Date, arguments));
        clone._isUTC = true;
        return clone;
      }
      var year = this.year();
      var month = this.month();
      var day = this.day();
      var hour = this.hour();
      var minute = this.minute();
      var second = this.second();
      var milliSecond = this.milliSecond();
      clone = this.clone(Date.UTC(year, month, day, hour, minute, second, milliSecond));
      clone._isUTC = true;
      return clone;
    }
  }, {
    key: 'valueOf',
    value: function valueOf() {
      return this.value;
    }
  }, {
    key: 'year',
    value: function year(val) {
      return +val === 0 || val ? nativeSet.call(this, 'FullYear', val) : nativeGet.call(this, 'FullYear');
    }
  }, {
    key: 'quarter',
    value: function quarter() {
      return Math.ceil((this.month() + 1) / 3);
    }
  }, {
    key: 'month',
    value: function month(val) {
      return +val === 0 || val ? nativeSet.call(this, 'Month', val) : nativeGet.call(this, 'Month');
    }
  }, {
    key: 'week',
    value: function week(val) {
      var week = this.localeData().week(this);
      return +val === 0 || val ? this.addDays((val - week) * 7) : week;
    }
  }, {
    key: 'isoWeek',
    value: function isoWeek(val) {
      var _weekOfYear = weekOfYear(this, 1, 4),
          week = _weekOfYear.week;

      return +val === 0 || val ? this.addDays((val - week) * 7) : week;
    }
  }, {
    key: 'day',
    value: function day(val) {
      return +val === 0 || val ? nativeSet.call(this, 'Date', val) : nativeGet.call(this, 'Date');
    }
  }, {
    key: 'weekDay',
    value: function weekDay(val) {
      var value = val;
      var weekDay = this._isUTC ? this.date.getUTCDay() : this.date.getDay();
      if (+value === 0 || value) {
        value = parseWeekday(value, this.localeData());
        return this.addDays(value - weekDay);
      }
      return weekDay;
    }
  }, {
    key: 'localeWeekDay',
    value: function localeWeekDay(val) {
      var localeWeekDay = (this.weekDay() + 7 - this.localeData()._week.dow) % 7;
      return +val === 0 || val ? this.addDays(val - localeWeekDay) : localeWeekDay;
    }
  }, {
    key: 'isoWeekDay',
    value: function isoWeekDay(val) {
      // behaves the same as moment#day except
      // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
      // as a setter, sunday should belong to the previous week.
      if (+val === 0 || val) {
        var isoWeekDay = parseIsoWeekday(val, this.localeData());
        return this.day(this.day() === 0 ? isoWeekDay - 7 : isoWeekDay);
      }
      return this.weekDay() || 7;
    }
  }, {
    key: 'hour',
    value: function hour(val) {
      return +val === 0 || val ? nativeSet.call(this, 'Hours', val) : nativeGet.call(this, 'Hours');
    }
  }, {
    key: 'minute',
    value: function minute(val) {
      return +val === 0 || val ? nativeSet.call(this, 'Minutes', val) : nativeGet.call(this, 'Minutes');
    }
  }, {
    key: 'second',
    value: function second(val) {
      return +val === 0 || val ? nativeSet.call(this, 'Seconds', val) : nativeGet.call(this, 'Seconds');
    }
  }, {
    key: 'milliSecond',
    value: function milliSecond(val) {
      return +val === 0 || val ? nativeSet.call(this, 'Milliseconds', val) : nativeGet.call(this, 'Milliseconds');
    }
  }, {
    key: 'weeksInYear',
    value: function weeksInYear$$1() {
      var weekInfo = this.localeData()._week;
      return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }
  }, {
    key: 'isoWeeksInYear',
    value: function isoWeeksInYear() {
      return weeksInYear(this.year(), 1, 4);
    }
  }, {
    key: 'weekYear',
    value: function weekYear(val) {
      return getSetWeekYearHelper.call(this, val, this.week(), this.localeWeekDay(), this.localeData()._week.dow, this.localeData()._week.doy);
    }
  }, {
    key: 'isoWeekYear',
    value: function isoWeekYear(val) {
      return getSetWeekYearHelper.call(this, val, this.isoWeek(), this.isoWeekDay(), 1, 4);
    }
  }, {
    key: 'unix',
    value: function unix() {
      return Math.floor(this.valueOf() / 1000);
    }
  }, {
    key: 'addMilliSeconds',
    value: function addMilliSeconds(value) {
      var val = value || 0;
      this.date.setMilliseconds(this.date.getMilliseconds() + val);
      return this;
    }
  }, {
    key: 'addSeconds',
    value: function addSeconds(value) {
      var val = value || 0;
      this.date.setSeconds(this.date.getSeconds() + val);
      return this;
    }
  }, {
    key: 'addMinutes',
    value: function addMinutes(value) {
      var val = value || 0;
      this.date.setMinutes(this.date.getMinutes() + val);
      return this;
    }
  }, {
    key: 'addHours',
    value: function addHours(value) {
      var val = value || 0;
      this.date.setHours(this.date.getHours() + val);
      return this;
    }
  }, {
    key: 'addDays',
    value: function addDays(value) {
      var val = value || 0;
      this.date.setDate(this.date.getDate() + val);
      return this;
    }
  }, {
    key: 'addWeeks',
    value: function addWeeks(value) {
      var val = value || 0;
      return this.addDays(7 * val);
    }
  }, {
    key: 'addMonths',
    value: function addMonths(value) {
      var val = value || 0;
      this.date.setMonth(this.date.getMonth() + val);
      return this;
    }
  }, {
    key: 'addQuarters',
    value: function addQuarters(value) {
      var val = value || 0;
      this.date.setMonth(this.date.getMonth() + val * 3);
      return this;
    }
  }, {
    key: 'addYears',
    value: function addYears(value) {
      var val = value || 0;
      this.date.setFullYear(this.date.getFullYear() + val);
      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var len = args.length;
      return len > 0 ? new (Function.prototype.bind.apply(Now, [null].concat(args)))() : new Now(this.date);
    }
  }, {
    key: 'truncate',
    value: function truncate(name) {
      var context = this.date;
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
  }, {
    key: 'format',
    value: function format$$1(str) {
      var formatStr = str || (this.isUtc() ? defaultFormatUtc : defaultFormat);
      var output = this._format.formatMoment(this, formatStr);
      return output;
    }
  }, {
    key: 'computeBeginningOfWeek',
    value: function computeBeginningOfWeek() {
      var clone = this.clone();
      clone.firstDayMonday = this.firstDayMonday;
      var weekDay = clone.date.getDay();
      if (clone.firstDayMonday) {
        if (weekDay === 0) {
          weekDay = 7;
        }
        weekDay -= 1;
      }
      clone.addDays(-weekDay);
      return clone.truncate('day');
    }
  }, {
    key: 'beginningOfSecond',
    value: function beginningOfSecond(val) {
      var computed = this.clone().truncate('second');
      return val && val === 'self' ? computed : computed.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'beginningOfMinute',
    value: function beginningOfMinute(val) {
      var computed = this.clone().truncate('minute');
      return val && val === 'self' ? computed : computed.format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'beginningOfHour',
    value: function beginningOfHour(val) {
      var computed = this.clone().truncate('hour');
      return val && val === 'self' ? computed : computed.format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'beginningOfDay',
    value: function beginningOfDay(val) {
      var computed = this.clone().truncate('day');
      return val && val === 'self' ? computed : computed.format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'beginningOfWeek',
    value: function beginningOfWeek(val) {
      return val && val === 'self' ? this.computeBeginningOfWeek() : this.computeBeginningOfWeek().format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'beginningOfMonth',
    value: function beginningOfMonth(val) {
      var computed = this.clone().truncate('month');
      return val && val === 'self' ? computed : computed.format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'beginningOfQuarter',
    value: function beginningOfQuarter(val) {
      var clone = this.clone().beginningOfMonth('self');
      var offset = clone.date.getMonth() % 3;
      var computed = clone.addMonths(-offset);
      return val && val === 'self' ? computed : computed.format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'beginningOfYear',
    value: function beginningOfYear(val) {
      var computed = this.clone().truncate('year');
      return val && val === 'self' ? computed : computed.format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'endOfSecond',
    value: function endOfSecond(val) {
      var clone = this.clone().beginningOfSecond('self').addMilliSeconds(SECOND - 1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfMinute',
    value: function endOfMinute(val) {
      var clone = this.clone().beginningOfMinute('self').addMilliSeconds(MINUTE - 1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfHour',
    value: function endOfHour(val) {
      var clone = this.clone().beginningOfHour('self').addMilliSeconds(HOUR - 1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfDay',
    value: function endOfDay(val) {
      var clone = this.clone().beginningOfDay('self').addMilliSeconds(DAY - 1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfWeek',
    value: function endOfWeek(val) {
      var clone = this.clone();
      clone.firstDayMonday = this.firstDayMonday;
      var computed = clone.beginningOfWeek('self').addMilliSeconds(7 * DAY - 1);
      return val && val === 'self' ? computed : computed.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfMonth',
    value: function endOfMonth(val) {
      var clone = this.clone().beginningOfMonth('self').addMonths(1).addMilliSeconds(-1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfQuarter',
    value: function endOfQuarter(val) {
      var clone = this.clone().beginningOfQuarter('self').addMonths(3).addMilliSeconds(-1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfYear',
    value: function endOfYear(val) {
      var clone = this.clone().beginningOfYear('self').addYears(1).addMilliSeconds(-1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'dayOfYear',
    value: function dayOfYear(val) {
      var doy = Math.round((this.beginningOfDay('self').date - this.beginningOfYear('self').date) / DAY) + 1;
      return +val === 0 || val ? this.addDays(val - doy) : doy;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.toISOString();
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }
  }, {
    key: 'toISOString',
    value: function toISOString() {
      var year = this.year();
      if (year < 0 || year > 9999) {
        return this.format('YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
      }
      if (nativeDatetoISOString && isFunction(nativeDatetoISOString)) {
        return this.date.toISOString();
      }
      return this.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
  }, {
    key: 'isNow',
    value: function isNow() {
      var now = arguments.length <= 0 ? undefined : arguments[0];
      if (arguments.length === 0) {
        now = this;
      }
      return now instanceof Now;
    }
  }, {
    key: 'isLeapYear',
    value: function isLeapYear$$1() {
      var year = arguments.length <= 0 ? undefined : arguments[0];
      if (arguments.length === 0) {
        year = this.year();
      } else if (this.isNow(year)) {
        year = year.year();
      }
      return isLeapYear(year);
    }
  }, {
    key: 'isBefore',
    value: function isBefore() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var len = args.length;
      var date1 = void 0;
      var date2 = void 0;

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
  }, {
    key: 'isAfter',
    value: function isAfter() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      var len = args.length;
      var date1 = void 0;
      var date2 = void 0;

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
  }, {
    key: 'isEqual',
    value: function isEqual() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      var len = args.length;
      var date1 = void 0;
      var date2 = void 0;

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
  }, {
    key: 'toArray',
    value: function toArray$$1() {
      return [this.year(), this.month(), this.day(), this.hour(), this.minute(), this.second(), this.milliSecond()];
    }
  }, {
    key: 'toObject',
    value: function toObject() {
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
  }, {
    key: 'min',
    value: function min() {
      var _this = this;

      var result = Infinity;
      var resultIndex = void 0;

      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      var original = args;
      var index = 0;
      var len = original.length;

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
      var compares = original.map(function (value) {
        if (_this.isNow(value)) {
          return value.date;
        }
        return value;
      });
      var some = compares.some(function (value) {
        return !isDate(value);
      });
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
  }, {
    key: 'max',
    value: function max() {
      var _this2 = this;

      var result = -Infinity;
      var resultIndex = void 0;

      for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      var original = args;
      var index = 0;
      var len = original.length;

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
      var compares = original.map(function (value) {
        if (_this2.isNow(value)) {
          return value.date;
        }
        return value;
      });
      var some = compares.some(function (value) {
        return !isDate(value);
      });
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
  }, {
    key: 'between',
    value: function between(date1, date2) {
      var compareDate1 = date1;
      var compareDate2 = date2;
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

  }, {
    key: 'sub',
    value: function sub(obj) {
      var dateObj = obj;
      if (isUndefined(dateObj)) {
        throw new Error('sub must be receive more than one argument');
      }
      if (this.isNow(dateObj)) {
        dateObj = dateObj.date;
      }
      if ((arguments.length <= 1 ? 0 : arguments.length - 1) > 0) {
        var other = arguments.length <= 1 ? undefined : arguments[1];
        if (this.isNow(other)) {
          other = other.date;
        }
        return minus(dateObj, other);
      }
      return minus(this.date, dateObj);
    }

    // return the relativeTime format

  }, {
    key: 'elapse',
    value: function elapse(date) {
      var subs = void 0;
      var now = new Date();

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
  }, {
    key: 'timeAgo',
    value: function timeAgo(date) {
      return this.elapse(date);
    }

    // return the time elapsed since date

  }, {
    key: 'since',
    value: function since(obj) {
      var dateObj = obj;
      if (isUndefined(dateObj)) {
        throw new Error('since must be receive more than one argument');
      }
      if (this.isNow(dateObj)) {
        dateObj = dateObj.date;
      }
      if ((arguments.length <= 1 ? 0 : arguments.length - 1) > 0) {
        var other = arguments.length <= 1 ? undefined : arguments[1];
        if (this.isNow(other)) {
          other = other.date;
        }
        return this.sub(other, dateObj);
      }
      var now = new Date();
      return this.sub(now, dateObj);
    }
  }, {
    key: 'utcOffset',
    value: function utcOffset(input, keepLocalTime, keepMinutes) {
      var offset = this._offset || 0;
      var localAdjust = void 0;
      var minutes = input;

      if (!isUndefined(minutes)) {
        if (isString(minutes)) {
          minutes = offsetFromString(matchShortOffset, minutes);
          if (minutes === null) {
            return this;
          }
        } else if (isNumber(minutes) && Math.abs(minutes) < 16 && !keepMinutes) {
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
      return this._isUTC ? offset : getDateOffset(this.date);
    }
  }, {
    key: 'utc',
    value: function utc(keepLocalTime) {
      return this.utcOffset(0, keepLocalTime);
    }
  }, {
    key: 'local',
    value: function local(keepLocalTime) {
      if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
          this.addMinutes(-getDateOffset(this.date));
        }
      }
      return this;
    }
  }, {
    key: 'isDST',
    value: function isDST() {
      return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }
  }, {
    key: 'isLocal',
    value: function isLocal() {
      return !this._isUTC;
    }
  }, {
    key: 'isUtcOffset',
    value: function isUtcOffset() {
      return this._isUTC;
    }
  }, {
    key: 'isUtc',
    value: function isUtc() {
      return this._isUTC && this._offset === 0;
    }
  }, {
    key: 'isUTC',
    value: function isUTC() {
      return this.isUtc();
    }
  }, {
    key: 'version',
    get: function get$$1() {
      return VERSION;
    }
  }, {
    key: 'value',
    get: function get$$1() {
      return +this.now;
    }
  }, {
    key: 'date',
    get: function get$$1() {
      return this.now;
    }
  }, {
    key: 'firstDayMonday',
    get: function get$$1() {
      return this.mondayFirst;
    },
    set: function set$$1(value) {
      this.mondayFirst = value;
    }
  }], [{
    key: 'version',
    value: function version() {
      return VERSION;
    }
  }, {
    key: 'defineLocale',
    value: function defineLocale$$1(name, config) {
      return defineLocale(name, config);
    }
  }, {
    key: 'updateLocale',
    value: function updateLocale$$1(name, config) {
      return updateLocale(name, config);
    }
  }, {
    key: 'locales',
    value: function locales() {
      return listLocales();
    }
  }]);
  return Now;
}();

function initLocale() {
  Now$1.defineLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal: function ordinal(number) {
      var b = number % 10;
      var output = toInt(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
      return number + output;
    }
  });
}

initLocale();

return Now$1;

})));
//# sourceMappingURL=nowjs.js.map
