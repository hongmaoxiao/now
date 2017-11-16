(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.nowjs = factory());
}(this, (function () { 'use strict';

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

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;

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
      var output = this._calendar[key] || this._calendar['sameElse'];
      return isFunction(output) ? output.call(mom, now) : output;
    }
  }, {
    key: 'longDateFormat',
    value: function longDateFormat(key) {
      var format = this._longDateFormat[key],
          formatUpper = this._longDateFormat[key.toUpperCase()];

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
      this._invaliDate;
    }
  }, {
    key: 'ordinal',
    value: function ordinal() {
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
      var prop = void 0;
      var i = void 0;

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
  }, {
    key: 'months',
    value: function months(context, format) {
      if (!context) {
        return isArray(this._months) ? this._months : this._months['standalone'];
      }
      console.log('isaaaaa: ', isArray(this._months));
      console.log('months: ', this._months);
      console.log('context: ', context.month());
      return isArray(this._months) ? this._months[context.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][context.month()];
    }
  }, {
    key: 'monthsShort',
    value: function monthsShort(m, format) {
      if (!m) {
        return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort['standalone'];
      }
      return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }
  }, {
    key: 'monthsParse',
    value: function monthsParse(monthName, format, strict) {
      var i = void 0;
      var mom = void 0;
      var regex = void 0;

      if (this._monthsParseExact) {
        return handleMonthStrictParse.call(this, monthName, format, strict);
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
  }, {
    key: 'monthsRegex',
    value: function monthsRegex(isStrict) {
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
        return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
      }
    }
  }, {
    key: 'monthsShortRegex',
    value: function monthsShortRegex(isStrict) {
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
        return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
      }
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
        return isArray(this._weekdays) ? this._weekdays : this._weekdays['standalone'];
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
    key: 'weekdaysParse',
    value: function weekdaysParse(weekdayName, format, strict) {
      var i = void 0;
      var mom = void 0;
      var regex = void 0;

      if (this._weekdaysParseExact) {
        return handleWeekStrictParse.call(this, weekdayName, format, strict);
      }

      if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
      }

      for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already

        mom = createUTC([2000, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
          this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
          this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
          this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
        }
        if (!this._weekdaysParse[i]) {
          regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
          this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
          return i;
        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
          return i;
        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
          return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
          return i;
        }
      }
    }
  }, {
    key: 'weekdaysRegex',
    value: function weekdaysRegex(isStrict) {
      if (this._weekdaysParseExact) {
        if (!has(this, '_weekdaysRegex')) {
          computeWeekdaysParse.call(this);
        }
        if (isStrict) {
          return this._weekdaysStrictRegex;
        } else {
          return this._weekdaysRegex;
        }
      } else {
        if (!has(this, '_weekdaysRegex')) {
          this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
      }
    }
  }, {
    key: 'weekdaysShortRegex',
    value: function weekdaysShortRegex(isStrict) {
      if (this._weekdaysParseExact) {
        if (!has(this, '_weekdaysRegex')) {
          computeWeekdaysParse.call(this);
        }
        if (isStrict) {
          return this._weekdaysShortStrictRegex;
        } else {
          return this._weekdaysShortRegex;
        }
      } else {
        if (!has(this, '_weekdaysShortRegex')) {
          this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
      }
    }
  }, {
    key: 'weekdaysMinRegex',
    value: function weekdaysMinRegex(isStrict) {
      if (this._weekdaysParseExact) {
        if (!has(this, '_weekdaysRegex')) {
          computeWeekdaysParse.call(this);
        }
        if (isStrict) {
          return this._weekdaysMinStrictRegex;
        } else {
          return this._weekdaysMinRegex;
        }
      } else {
        if (!has(this, '_weekdaysMinRegex')) {
          this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
      }
    }
  }, {
    key: 'isPM',
    value: function isPM(input) {
      // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
      // Using charAt should be more compatible.
      return (input + '').toLowerCase().charAt(0) === 'p';
    }
  }, {
    key: 'meridiem',
    value: function meridiem(hours, minutes, isLower) {
      if (hours > 11) {
        return isLower ? 'pm' : 'PM';
      } else {
        return isLower ? 'am' : 'AM';
      }
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

/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
/* eslint prefer-destructuring: ["error", { "object": false }] */

var ArrayProto = Array.prototype;
var toString = Object.prototype.toString;
var nativeIsArray = Array.isArray;
var nativeIndexOf = ArrayProto.indexOf;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
var regexEscape = function regexEscape(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

var nativeDatetoISOString = Date.prototype.toISOString;

var slice = ArrayProto.slice;
var invalidDateError = 'Invalid Date';
var invalidDateRegExp = /Invalid Date/;
var defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
var defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';
var defaultMonthsShortRegex = matchWord;
var defaultMonthsRegex = matchWord;
var defaultWeekdaysRegex = matchWord;
var defaultWeekdaysShortRegex = matchWord;
var defaultWeekdaysMinRegex = matchWord;
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

function has(obj, key) {
  return hasOwnProperty.call(obj, key);
}

var keys = Object.keys || function (obj) {
  var i = void 0;
  var res = [];
  for (i in obj) {
    if (has(obj, i)) {
      res[res.length] = i;
    }
  }
  return res;
};



function absFloor(number) {
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}



function toInt(number) {
  return +number !== 0 && isFinite(+number) ? absFloor(+number) : 0;
}

var isLeapYear = function isLeapYear(year) {
  return year % 100 !== 0 && year % 4 === 0 || year % 400 === 0;
};

function compare(date1, date2) {
  if (isUndefined(date1) || isUndefined(date2)) {
    throw new Error('arguments can not be undefined');
  } else if (!(isDate(date1) && isDate(date2))) {
    throw new TypeError('arguments require Date type');
  } else {
    return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
  }
}

function minus(date1, date2) {
  if (isUndefined(date1) || isUndefined(date2)) {
    throw new Error('arguments must be defined');
  }
  if (!(isDate(date1) && isDate(date2))) {
    throw new TypeError('arguments must be Date type');
  }
  return date1 - date2;
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

function extend(a, b) {
  for (var i in b) {
    if (has(b, i)) {
      a[i] = b[i];
    }
  }

  if (has(b, 'toString')) {
    a.toString = b.toString;
  }

  if (has(b, 'valueOf')) {
    a.valueOf = b.valueOf;
  }

  return a;
}

var indexOf = nativeIndexOf || function (o) {
  var len = this.length;
  var i = void 0;
  for (i = 0; i < len; i++) {
    if (this[i] === o) {
      return i;
    }
  }
  return -1;
};

var hookCallback = void 0;
function hooks() {
  return hookCallback.apply(null, arguments);
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

function zeroFill(number, targetLength, forceSign) {
  var absNumber = '' + Math.abs(number);
  var zeroToFill = targetLength - absNumber.length;
  var sign = number >= 0;
  return (sign ? forceSign ? '+' : '' : '-') + Math.pow(10, Math.max(0, zeroToFill)).toString().substr(1) + absNumber;
}

function handleMonthStrictParse(monthName, format, strict) {
  var i = void 0;
  var ii = void 0;
  var mom = void 0;
  var llc = monthName.toLocaleLowerCase();

  if (!this._monthsParse) {
    // this is not used
    this._monthsParse = [];
    this._longMonthsParse = [];
    this._shortMonthsParse = [];
    for (i = 0; i < 12; ++i) {
      mom = createUTC([2000, i]);
      this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
      this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
    }
  }

  if (strict) {
    if (format === 'MMM') {
      ii = indexOf.call(this._shortMonthsParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = indexOf.call(this._longMonthsParse, llc);
      return ii !== -1 ? ii : null;
    }
  } else {
    if (format === 'MMM') {
      ii = indexOf.call(this._shortMonthsParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._longMonthsParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = indexOf.call(this._longMonthsParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._shortMonthsParse, llc);
      return ii !== -1 ? ii : null;
    }
  }
}

function handleWeekStrictParse(weekdayName, format, strict) {
  var i = void 0;
  var ii = void 0;
  var mom = void 0;
  var llc = weekdayName.toLocaleLowerCase();

  if (!this._weekdaysParse) {
    this._weekdaysParse = [];
    this._shortWeekdaysParse = [];
    this._minWeekdaysParse = [];

    for (i = 0; i < 7; ++i) {
      mom = createUTC([2000, 1]).day(i);
      this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
      this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
      this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
    }
  }

  if (strict) {
    if (format === 'dddd') {
      ii = indexOf.call(this._weekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else if (format === 'ddd') {
      ii = indexOf.call(this._shortWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = indexOf.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    }
  } else {
    if (format === 'dddd') {
      ii = indexOf.call(this._weekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._shortWeekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else if (format === 'ddd') {
      ii = indexOf.call(this._shortWeekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._weekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = indexOf.call(this._minWeekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._weekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._shortWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    }
  }
}

function computeMonthsParse() {
  function cmpLenRev(a, b) {
    return b.length - a.length;
  }

  var shortPieces = [];
  var longPieces = [];
  var mixedPieces = [];
  var i = void 0;
  var mom = void 0;

  for (i = 0; i < 12; i++) {
    // make the regex if we don't have it already
    mom = createUTC([2000, i]);
    shortPieces.push(this.monthsShort(mom, ''));
    longPieces.push(this.months(mom, ''));
    mixedPieces.push(this.months(mom, ''));
    mixedPieces.push(this.monthsShort(mom, ''));
  }
  // Sorting makes sure if one month (or abbr) is a prefix of another it
  // will match the longer piece.
  shortPieces.sort(cmpLenRev);
  longPieces.sort(cmpLenRev);
  mixedPieces.sort(cmpLenRev);
  for (i = 0; i < 12; i++) {
    shortPieces[i] = regexEscape(shortPieces[i]);
    longPieces[i] = regexEscape(longPieces[i]);
  }
  for (i = 0; i < 24; i++) {
    mixedPieces[i] = regexEscape(mixedPieces[i]);
  }

  this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
  this._monthsShortRegex = this._monthsRegex;
  this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
  this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

function computeWeekdaysParse() {
  function cmpLenRev(a, b) {
    return b.length - a.length;
  }

  var minPieces = [];
  var shortPieces = [];
  var longPieces = [];
  var mixedPieces = [];
  var i = void 0;
  var mom = void 0;
  var minp = void 0;
  var shortp = void 0;
  var longp = void 0;

  for (i = 0; i < 7; i++) {
    // make the regex if we don't have it already
    mom = createUTC([2000, 1]).day(i);
    minp = this.weekdaysMin(mom, '');
    shortp = this.weekdaysShort(mom, '');
    longp = this.weekdays(mom, '');
    minPieces.push(minp);
    shortPieces.push(shortp);
    longPieces.push(longp);
    mixedPieces.push(minp);
    mixedPieces.push(shortp);
    mixedPieces.push(longp);
  }
  // Sorting makes sure if one weekday (or abbr) is a prefix of another it
  // will match the longer piece.
  minPieces.sort(cmpLenRev);
  shortPieces.sort(cmpLenRev);
  longPieces.sort(cmpLenRev);
  mixedPieces.sort(cmpLenRev);
  for (i = 0; i < 7; i++) {
    shortPieces[i] = regexEscape(shortPieces[i]);
    longPieces[i] = regexEscape(longPieces[i]);
    mixedPieces[i] = regexEscape(mixedPieces[i]);
  }

  this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
  this._weekdaysShortRegex = this._weekdaysRegex;
  this._weekdaysMinRegex = this._weekdaysRegex;

  this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
  this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
  this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

function mergeConfigs(parentConfig, childConfig) {
  var res = extend({}, parentConfig);
  var prop = void 0;

  for (prop in childConfig) {
    if (has(childConfig, prop)) {
      if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
        res[prop] = {};
        extend(res[prop], parentConfig[prop]);
        extend(res[prop], childConfig[prop]);
      } else if (childConfig[prop] != null) {
        res[prop] = childConfig[prop];
      } else {
        delete res[prop];
      }
    }
  }

  for (prop in parentConfig) {
    if (has(parentConfig, prop) && !has(childConfig, prop) && isObject(parentConfig[prop])) {
      // make sure changes to properties don't modify parent config
      res[prop] = extend({}, res[prop]);
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

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
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
        //the next array item is better than a shallower substring of this one
        break;
      }
      j--;
    }
    i++;
  }

  return null;
}

function loadLocale(name) {
  var oldLocale = null;
  // console.log('name: ', name, locales[name]);
  // TODO: Find a better way to register and load all the locales in Node
  if (!locales[name] && typeof module !== 'undefined' && module && module.exports) {
    try {
      console.log('name: ', name);
      oldLocale = globalLocale && globalLocale._abbr;
      var aliasedRequire = require;
      aliasedRequire('../i18n/' + name);
      // console.log('oldLocale: ', oldLocale);
      getSetGlobalLocale(oldLocale);
    } catch (e) {}
  }
  return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale(key, values) {
  // console.log('keeeee: ', key, values, isUndefined(values));
  var data = void 0;
  if (key) {
    if (isUndefined(values)) {
      // console.log('getset key: ', key);
      data = getLocale(key);
      // console.log('getset value: ', data);
    } else {
      data = defineLocale(key, values);
    }

    if (data) {
      // moment.duration._locale = moment._locale = data;
      globalLocale = data;
    }
  }

  // console.log("globalLocale: ", globalLocale);

  // return globalLocale._abbr;
}

function defineLocale(name, config) {
  if (config !== null) {
    var parentConfig = baseConfig;
    config.abbr = name;
    if (locales[name] != null) {
      // console.log('locales name not null: ', locales[name]);
      deprecateSimple('defineLocaleOverride', 'use Now.updateLocale(localeName, config) to change ' + 'an existing locale. Now.defineLocale(localeName, ' + 'config) should only be used for creating a new locale');

      parentConfig = locales[name]._config;
    } else if (config.parentLocale != null) {
      // console.log('locales name is null: ', config);
      if (locales[config.parentLocale] != null) {
        parentConfig = locales[config.parentLocale]._config;
      } else {
        if (!localeFamilies[config.parentLocale]) {
          localeFamilies[config.parentLocale] = [];
        }
        localeFamilies[config.parentLocale].push({
          name: name,
          config: config
        });
        return null;
      }
    }
    // console.log("parentConfig: ", parentConfig);
    // console.log("config: ", config);
    locales[name] = new Locale(mergeConfigs(parentConfig, config));

    // console.log('locales after: ', locales[name]);
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
  } else {
    // useful for testing
    delete locales[name];
    return null;
  }
}

function updateLocale(name, config) {
  if (config != null) {
    var locale = void 0;
    var parentConfig = baseConfig;
    // MERGE
    if (locales[name] != null) {
      parentConfig = locales[name]._config;
    }
    config = mergeConfigs(parentConfig, config);
    locale = new Locale(config);
    locale.parentLocale = locales[name];
    locales[name] = locale;

    // backwards compat for now: also set the locale
    getSetGlobalLocale(name);
  } else {
    // pass null for config to unupdate, useful for tests
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

// returns locale data
function getLocale(key) {
  var locale = void 0;

  if (key && key._locale && key._locale._abbr) {
    key = key._locale._abbr;
  }

  if (!key) {
    return globalLocale;
  }

  if (!isArray(key)) {
    //short-circuit everything else
    // console.log('load key: ', key, locale);
    locale = loadLocale(key);
    // console.log('load success: ', locale);
    if (locale) {
      return locale;
    }
    key = [key];
  }

  return chooseLocale(key);
}

var listLocales = function listLocales() {
  return keys(locales);
};

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

var weeksInYear = function weeksInYear(year, dow, doy) {
  var weekOffset = firstWeekOffset(year, dow, doy);
  var weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
  return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
};

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
  var weeksTarget = void 0;
  if (input == null) {
    return weekOfYear(this, dow, doy).year;
  } else {
    weeksTarget = weeksInYear(input, dow, doy);
    if (week > weeksTarget) {
      week = weeksTarget;
    }
    return setWeekAll.call(this, input, week, weekday, dow, doy);
  }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
  var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
  var date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

  this.year(date.getUTCFullYear());
  this.month(date.getUTCMonth());
  this.day(date.getUTCDate());
  return this;
}

var parseIsoWeekday = function parseIsoWeekday(input, locale) {
  if (isString(input)) {
    return locale.weekdaysParse(input) % 7 || 7;
  }
  return isNaN(input) ? null : input;
};

var parseWeekday = function parseWeekday(input, locale) {
  if (isString(input)) {
    return input;
  }

  if (!isNaN(input)) {
    return parseInt(input, 10);
  }

  input = locale.weekdaysParse(input);
  if (isNumber(input)) {
    return input;
  }

  return null;
};

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

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

function offset(token, separator) {
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
  function Format(config) {
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
      offset.call(this, 'Z', ':');
      offset.call(this, 'ZZ', '');

      // timestamp
      this.addFormatToken('X', 0, 0, 'unix');
      this.addFormatToken('x', 0, 0, 'valueOf');
    }
  }, {
    key: 'addFormatToken',
    value: function addFormatToken(token, padded, ordinal, callback) {
      // console.log('sasadad: ', token, padded, ordinal, callback);
      var func = callback;
      if (typeof callback === 'string') {
        func = function func() {
          console.log('call: ', ordinal, callback);
          console.log('call func: ', this[callback]);
          return this[callback]();
        };
      }
      if (token) {
        // console.log('token: ', token);
        this.formatTokenFunctions[token] = func;
      }
      if (padded) {
        // console.log('padded: ', padded);
        this.formatTokenFunctions[padded[0]] = function () {
          console.log('padded: ', padded[1], padded[2], func);
          return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
      }
      if (ordinal) {
        this.formatTokenFunctions[ordinal] = function () {
          console.log('token: ', ordinal);
          console.log('args: ', arguments);
          console.log('func call: ', func.apply(this, arguments));
          console.log('func call: ', func.apply(this, arguments));
          console.log('orinal call: ', this.localeData().ordinal);
          return this.localeData().ordinal(func.apply(this, arguments), token);
        };
      }
    }
  }, {
    key: 'makeFormatFunction',
    value: function makeFormatFunction(format) {
      // console.log('format: ', format);
      var array = format.match(this.formattingTokens);
      var i = void 0;
      var length = void 0;

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
      return function (context) {
        var output = '';
        var i = void 0;
        for (i = 0; i < length; i++) {
          console.log('array[i]: ', i, array[i], format);
          output += isFunction(array[i]) ? array[i].call(context, format) : array[i];
        }
        return output;
      };
    }
  }, {
    key: 'formatMoment',
    value: function formatMoment(context, format) {
      // if (!m.isValid()) {
      // return m.localeData().invalidDate();
      // }

      // console.log('m: ', context);
      // console.log("localeData: ", context.localeData());
      format = this.expandFormat(format, context.localeData());
      // console.log('format: ', format);
      this.formatFunctions[format] = this.formatFunctions[format] || this.makeFormatFunction(format);
      // console.log('this.formatFunctions: ', this.formatFunctions[format]);

      return this.formatFunctions[format](context);
    }
  }, {
    key: 'expandFormat',
    value: function expandFormat(format, locale) {
      var i = 5;

      function replaceLongDateFormatTokens(input) {
        // console.log('iiiii: ', input);
        return locale.longDateFormat(input) || input;
      }

      this.localFormattingTokens.lastIndex = 0;
      while (i >= 0 && this.localFormattingTokens.test(format)) {
        // console.log("formmmmm in: ", format)
        format = format.replace(this.localFormattingTokens, replaceLongDateFormatTokens);
        this.localFormattingTokens.lastIndex = 0;
        i -= 1;
      }
      // console.log("formmmmm: ", format)

      return format;
    }
  }]);
  return Format;
}();

var format = new Format();

var metaSecond = 1000;
var metaMinute = 60 * metaSecond;
var metaHour = 60 * metaMinute;
var metaDay = 24 * metaHour;
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var chunkOffset = /([\+\-]|\d\d)/gi;

var nativeGet = function nativeGet(unit) {
  var getName = this._isUTC ? 'getUTC' + unit : 'get' + unit;
  return this.date[getName]();
};

var nativeSet = function nativeSet(unit, val) {
  val = parseInt(val);
  var setName = this._isUTC ? 'setUTC' + unit : 'set' + unit;
  if (isNumber(val)) {
    this.date[setName](val);
  }
  return this;
};

function offsetFromString(matcher, string) {
  var matches = (string || '').match(matcher);

  if (matches === null) {
    return null;
  }

  var chunk = matches[matches.length - 1] || [];
  var parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
  var minutes = +(parts[1] * 60) + toInt(parts[2]);

  return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
}

var Now$1 = function () {
  function Now() {
    classCallCheck(this, Now);

    this.mondayFirst = false;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.now = new (Function.prototype.bind.apply(Date, [null].concat(args)))();
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

  createClass(Now, [{
    key: 'localeData',
    value: function localeData(key) {
      return getLocale(key);
    }
  }, {
    key: 'initLocale',
    value: function initLocale() {
      // locale('en');
      getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function ordinal(number) {
          var b = number % 10;
          var output = toInt(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
          return number + output;
        }
      });
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
      return function () {
        var weekDay = that.now.getDay();
        that.mondayFirst = false;
        if (weekDay === 0) {
          // today is sunday, so get before sunday
          var _offset = index;
          if (index === 0) {
            _offset = 7;
          }
          return that.computeBeginningOfWeek().addDays(-(7 - _offset)).date;
        }
        // today is not sunday, so get after sunday
        var offset = index;
        if (index === 0) {
          offset = 7;
        }
        return that.computeBeginningOfWeek().addDays(offset).date;
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
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this.clone(Date.UTC(args));
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
      // console.log('localeData: ', this.localeData());
      // console.log('get week: ', week);
      return +val === 0 || val ? this.addDays((val - week) * 7) : week;
    }
  }, {
    key: 'isoWeek',
    value: function isoWeek(val) {
      var week = weekOfYear(this, 1, 4).week;
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
      var weekDay = this._isUTC ? this.date.getUTCDay() : this.date.getDay();
      if (+val === 0 || val) {
        val = parseWeekday(val, this.localeData());
        return this.addDays(val - weekDay);
      } else {
        return weekDay;
      }
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
        console.log('set week: ', val);
        var isoWeekDay = parseIsoWeekday(val, this.localeData());
        return this.day(this.day() === 0 ? isoWeekDay - 7 : isoWeekDay);
      } else {
        console.log('in week: ', this.weekDay());
        return this.weekDay() || 7;
      }
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
      console.log('weekYear for week: ', this.week(), this.localeWeekDay());
      return getSetWeekYearHelper.call(this, val, this.week(), this.localeWeekDay(), this.localeData()._week.dow, this.localeData()._week.doy);
    }
  }, {
    key: 'isoWeekYear',
    value: function isoWeekYear(val) {
      return getSetWeekYearHelper.call(this, val, this.isoWeek(), this.isoWeekDay(), 1, 4);
    }
  }, {
    key: 'unixr',
    value: function unixr() {
      return Math.floor(this.valueOf() / 1000);
    }
  }, {
    key: 'addMilliSeconds',
    value: function addMilliSeconds(value) {
      this.date.setMilliseconds(this.date.getMilliseconds() + value);
      return this;
    }
  }, {
    key: 'addSeconds',
    value: function addSeconds(value) {
      this.date.setSeconds(this.date.getSeconds() + value);
      return this;
    }
  }, {
    key: 'addMinutes',
    value: function addMinutes(value) {
      this.date.setMinutes(this.date.getMinutes() + value);
      return this;
    }
  }, {
    key: 'addHours',
    value: function addHours(value) {
      this.date.setHours(this.date.getHours() + value);
      return this;
    }
  }, {
    key: 'addDays',
    value: function addDays(value) {
      this.date.setDate(this.date.getDate() + value);
      return this;
    }
  }, {
    key: 'addWeeks',
    value: function addWeeks(value) {
      return this.date.addDays(7 * value);
    }
  }, {
    key: 'addMonths',
    value: function addMonths(value) {
      this.date.setMonth(this.date.getMonth() + value);
      return this;
    }
  }, {
    key: 'addYears',
    value: function addYears(value) {
      this.date.setFullYear(this.date.getFullYear() + value);
      return this;
    }
  }, {
    key: 'clone',
    value: function clone(val) {
      return val ? new Now(val) : new Now(this.date);
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
        default:
          return this;
      }
    }
  }, {
    key: 'parse',
    value: function parse(ifMiliSecond) {
      var context = void 0;
      if (this instanceof Now) {
        context = this.date;
      } else {
        context = this;
      }
      var year = context.getFullYear();
      var month = context.getMonth() + 1;
      var date = context.getDate();
      var hour = context.getHours();
      var minute = context.getMinutes();
      var second = context.getSeconds();
      var milliSecond = context.getMilliseconds();
      month = month < 10 ? '0' + month : month;
      date = date < 10 ? '0' + date : date;
      hour = hour < 10 ? '0' + hour : hour;
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;
      if (ifMiliSecond) {
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second + '.' + milliSecond;
      }
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
    }
  }, {
    key: 'format',
    value: function format$$1(obj) {
      obj || (obj = this.isUtc() ? defaultFormatUtc : defaultFormat);
      var output = this._format.formatMoment(this, obj);
      return output;
    }
  }, {
    key: 'computeBeginningOfMinute',
    value: function computeBeginningOfMinute() {
      return this.clone().truncate('minute');
    }
  }, {
    key: 'computeBeginningOfHour',
    value: function computeBeginningOfHour() {
      return this.clone().truncate('hour');
    }
  }, {
    key: 'computeBeginningOfDay',
    value: function computeBeginningOfDay() {
      return this.clone().truncate('day');
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
    key: 'computeBeginningOfMonth',
    value: function computeBeginningOfMonth() {
      return this.clone().truncate('month');
    }
  }, {
    key: 'computeBeginningOfQuarter',
    value: function computeBeginningOfQuarter() {
      var clone = this.clone().computeBeginningOfMonth();
      var offset = clone.date.getMonth() % 3;
      return clone.addMonths(-offset);
    }
  }, {
    key: 'computeBeginningOfYear',
    value: function computeBeginningOfYear() {
      return this.clone().truncate('year');
    }
  }, {
    key: 'beginningOfMinute',
    value: function beginningOfMinute() {
      return this.computeBeginningOfMinute().date;
    }
  }, {
    key: 'beginningOfHour',
    value: function beginningOfHour() {
      return this.computeBeginningOfHour().date;
    }
  }, {
    key: 'beginningOfDay',
    value: function beginningOfDay() {
      return this.computeBeginningOfDay().date;
    }
  }, {
    key: 'beginningOfWeek',
    value: function beginningOfWeek() {
      return this.computeBeginningOfWeek().date;
    }
  }, {
    key: 'beginningOfMonth',
    value: function beginningOfMonth() {
      return this.computeBeginningOfMonth().date;
    }
  }, {
    key: 'beginningOfQuarter',
    value: function beginningOfQuarter() {
      return this.computeBeginningOfQuarter().date;
    }
  }, {
    key: 'beginningOfYear',
    value: function beginningOfYear() {
      return this.computeBeginningOfYear().date;
    }
  }, {
    key: 'endOfMinute',
    value: function endOfMinute() {
      return this.clone().computeBeginningOfMinute().addMilliSeconds(metaMinute - 1).date;
    }
  }, {
    key: 'endOfHour',
    value: function endOfHour() {
      return this.clone().computeBeginningOfHour().addMilliSeconds(metaHour - 1).date;
    }
  }, {
    key: 'endOfDay',
    value: function endOfDay() {
      return this.clone().computeBeginningOfDay().addMilliSeconds(metaDay - 1).date;
    }
  }, {
    key: 'endOfWeek',
    value: function endOfWeek() {
      var clone = this.clone();
      clone.firstDayMonday = this.firstDayMonday;
      return clone.computeBeginningOfWeek().addMilliSeconds(7 * metaDay - 1).date;
    }
  }, {
    key: 'endOfMonth',
    value: function endOfMonth() {
      return this.clone().computeBeginningOfMonth().addMonths(1).addMilliSeconds(-1).date;
    }
  }, {
    key: 'endOfQuarter',
    value: function endOfQuarter() {
      return this.clone().computeBeginningOfQuarter().addMonths(3).addMilliSeconds(-1).date;
    }
  }, {
    key: 'endOfYear',
    value: function endOfYear() {
      return this.clone().computeBeginningOfYear().addYears(1).addMilliSeconds(-1).date;
    }
  }, {
    key: 'dayOfYear',
    value: function dayOfYear() {
      return Math.round((this.beginningOfDay() - this.beginningOfYear()) / metaDay) + 1;
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
    key: 'isLeapYear',
    value: function isLeapYear$$1() {
      return isLeapYear(this.year());
    }
  }, {
    key: 'isBefore',
    value: function isBefore(obj) {
      return compare(this.date, obj) === -1;
    }
  }, {
    key: 'isAfter',
    value: function isAfter(obj) {
      return compare(this.date, obj) === 1;
    }
  }, {
    key: 'isEqual',
    value: function isEqual(obj) {
      return compare(this.date, obj) === 0;
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
      var result = Infinity;

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var compares = slice.call(args);
      var index = 0;
      var len = compares.length;
      if (len === 0) {
        throw new Error('min require at least one argument');
      }
      var some = compares.some(function (value) {
        return !isDate(value);
      });
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
  }, {
    key: 'max',
    value: function max() {
      var result = -Infinity;

      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      var compares = slice.call(args);
      var index = 0;
      var len = compares.length;
      if (len === 0) {
        throw new Error('max require at least one argument');
      }
      var some = compares.some(function (value) {
        return !isDate(value);
      });
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
  }, {
    key: 'between',
    value: function between(date1, date2) {
      if (isUndefined(date1) || isUndefined(date2)) {
        throw new Error('arguments must be defined');
      }
      if (!(isDate(date1) && isDate(date2))) {
        throw new TypeError('arguments must be Date type');
      }
      return this.after(date1) && this.before(date2);
    }

    // return the duration this.date - date.

  }, {
    key: 'sub',
    value: function sub(date) {
      if ((arguments.length <= 1 ? 0 : arguments.length - 1) > 0) {
        return minus(date, arguments.length <= 1 ? undefined : arguments[1]);
      }
      return minus(this.date, date);
    }

    // return the time elapsed by now

  }, {
    key: 'elapse',
    value: function elapse() {
      var now = new Date();
      return minus(now, this.date);
    }

    // return the time elapsed since date

  }, {
    key: 'since',
    value: function since(date) {
      if ((arguments.length <= 1 ? 0 : arguments.length - 1) > 0) {
        return this.sub(arguments.length <= 1 ? undefined : arguments[1], date);
      }
      var now = new Date();
      return this.sub(now, date);
    }
  }, {
    key: 'getDateOffset',
    value: function getDateOffset() {
      return -Math.round(this.date.getTimezoneOffset() / 15) * 15;
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

return Now$1;

})));
//# sourceMappingURL=nowjs.js.map
