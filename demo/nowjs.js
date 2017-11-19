(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Now = factory());
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

//! now.js locale configuration
//! locale : Afrikaans [af]
//! author : Werner Mollentze : https://github.com/wernerm
/* jshint -W100 */

var af = {
  months: 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
  monthsShort: 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
  weekdays: 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
  weekdaysShort: 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
  weekdaysMin: 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
  meridiemParse: /vm|nm/i,
  isPM: function isPM(input) {
    return (/^nm$/i.test(input)
    );
  },
  meridiem: function meridiem(hours, minutes, isLower) {
    if (hours < 12) {
      return isLower ? 'vm' : 'VM';
    }
    return isLower ? 'nm' : 'NM';
  },

  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Vandag om] LT',
    nextDay: '[Môre om] LT',
    nextWeek: 'dddd [om] LT',
    lastDay: '[Gister om] LT',
    lastWeek: '[Laas] dddd [om] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'oor %s',
    past: '%s gelede',
    s: '\'n paar sekondes',
    m: '\'n minuut',
    mm: '%d minute',
    h: '\'n uur',
    hh: '%d ure',
    d: '\'n dag',
    dd: '%d dae',
    M: '\'n maand',
    MM: '%d maande',
    y: '\'n jaar',
    yy: '%d jaar'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
  ordinal: function ordinal(number) {
    return number + (number === 1 || number === 8 || number >= 20 ? 'ste' : 'de'); // Thanks to Joris Röling : https://github.com/jjupiter
  },

  week: {
    dow: 1, // Maandag is die eerste dag van die week.
    doy: 4 // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
  }
};

//! now.js locale configuration
//! locale : Arabic (Algeria) [ar-dz]
//! author : Noureddine LOUAHEDJ : https://github.com/noureddineme
/* jshint -W100 */

var ardz = {
  months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
  monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
  weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
  weekdaysShort: 'احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
  weekdaysMin: 'أح_إث_ثلا_أر_خم_جم_سب'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[اليوم على الساعة] LT',
    nextDay: '[غدا على الساعة] LT',
    nextWeek: 'dddd [على الساعة] LT',
    lastDay: '[أمس على الساعة] LT',
    lastWeek: 'dddd [على الساعة] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'في %s',
    past: 'منذ %s',
    s: 'ثوان',
    m: 'دقيقة',
    mm: '%d دقائق',
    h: 'ساعة',
    hh: '%d ساعات',
    d: 'يوم',
    dd: '%d أيام',
    M: 'شهر',
    MM: '%d أشهر',
    y: 'سنة',
    yy: '%d سنوات'
  },
  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 4 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Arabic (Kuwait) [ar-kw]
//! author : Nusret Parlak: https://github.com/nusretparlak
/* jshint -W100 */

var arkw = {
  months: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
  monthsShort: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
  weekdays: 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
  weekdaysShort: 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
  weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[اليوم على الساعة] LT',
    nextDay: '[غدا على الساعة] LT',
    nextWeek: 'dddd [على الساعة] LT',
    lastDay: '[أمس على الساعة] LT',
    lastWeek: 'dddd [على الساعة] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'في %s',
    past: 'منذ %s',
    s: 'ثوان',
    m: 'دقيقة',
    mm: '%d دقائق',
    h: 'ساعة',
    hh: '%d ساعات',
    d: 'يوم',
    dd: '%d أيام',
    M: 'شهر',
    MM: '%d أشهر',
    y: 'سنة',
    yy: '%d سنوات'
  },
  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 12 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Arabic (Lybia) [ar-ly]
//! author : Ali Hmer: https://github.com/kikoanis
/* jshint -W100 */

var symbolMap = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  0: '0'
};

var pluralForm = function pluralForm(n) {
  return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
};

var plurals = {
  s: ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
  m: ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
  h: ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
  d: ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
  M: ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
  y: ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
};

var pluralize = function pluralize(u) {
  return function (number, withoutSuffix, string, isFuture) {
    var f = pluralForm(number);
    var str = plurals[u][pluralForm(number)];
    if (f === 2) {
      str = str[withoutSuffix ? 0 : 1];
    }
    return str.replace(/%d/i, number);
  };
};

var months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

var arly = {
  months: months,
  monthsShort: months,
  weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
  weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
  weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'D/\u200FM/\u200FYYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  meridiemParse: /ص|م/,
  isPM: function isPM(input) {
    return input === 'م';
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 12) {
      return 'ص';
    }
    return 'م';
  },

  calendar: {
    sameDay: '[اليوم عند الساعة] LT',
    nextDay: '[غدًا عند الساعة] LT',
    nextWeek: 'dddd [عند الساعة] LT',
    lastDay: '[أمس عند الساعة] LT',
    lastWeek: 'dddd [عند الساعة] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'بعد %s',
    past: 'منذ %s',
    s: pluralize('s'),
    m: pluralize('m'),
    mm: pluralize('m'),
    h: pluralize('h'),
    hh: pluralize('h'),
    d: pluralize('d'),
    dd: pluralize('d'),
    M: pluralize('M'),
    MM: pluralize('M'),
    y: pluralize('y'),
    yy: pluralize('y')
  },
  preparse: function preparse(string) {
    return string.replace(/،/g, ',');
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap[match];
    }).replace(/,/g, '،');
  },

  week: {
    dow: 6, // Saturday is the first day of the week.
    doy: 12 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Arabic (Morocco) [ar-ma]
//! author : ElFadili Yassine : https://github.com/ElFadiliY
//! author : Abdel Said : https://github.com/abdelsaid
/* jshint -W100 */

var arma = {
  months: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
  monthsShort: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
  weekdays: 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
  weekdaysShort: 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
  weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[اليوم على الساعة] LT',
    nextDay: '[غدا على الساعة] LT',
    nextWeek: 'dddd [على الساعة] LT',
    lastDay: '[أمس على الساعة] LT',
    lastWeek: 'dddd [على الساعة] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'في %s',
    past: 'منذ %s',
    s: 'ثوان',
    m: 'دقيقة',
    mm: '%d دقائق',
    h: 'ساعة',
    hh: '%d ساعات',
    d: 'يوم',
    dd: '%d أيام',
    M: 'شهر',
    MM: '%d أشهر',
    y: 'سنة',
    yy: '%d سنوات'
  },
  week: {
    dow: 6, // Saturday is the first day of the week.
    doy: 12 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Arabic (Saudi Arabia) [ar-sa]
//! author : Suhail Alkowaileet : https://github.com/xsoh
/* jshint -W100 */

var symbolMap$1 = {
  1: '١',
  2: '٢',
  3: '٣',
  4: '٤',
  5: '٥',
  6: '٦',
  7: '٧',
  8: '٨',
  9: '٩',
  0: '٠'
};

var numberMap = {
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '٠': '0'
};

var arsa = {
  months: 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
  monthsShort: 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
  weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
  weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
  weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  meridiemParse: /ص|م/,
  isPM: function isPM(input) {
    return input === 'م';
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 12) {
      return 'ص';
    }
    return 'م';
  },

  calendar: {
    sameDay: '[اليوم على الساعة] LT',
    nextDay: '[غدا على الساعة] LT',
    nextWeek: 'dddd [على الساعة] LT',
    lastDay: '[أمس على الساعة] LT',
    lastWeek: 'dddd [على الساعة] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'في %s',
    past: 'منذ %s',
    s: 'ثوان',
    m: 'دقيقة',
    mm: '%d دقائق',
    h: 'ساعة',
    hh: '%d ساعات',
    d: 'يوم',
    dd: '%d أيام',
    M: 'شهر',
    MM: '%d أشهر',
    y: 'سنة',
    yy: '%d سنوات'
  },
  preparse: function preparse(string) {
    return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
      return numberMap[match];
    }).replace(/،/g, ',');
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$1[match];
    }).replace(/,/g, '،');
  },

  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale  :  Arabic (Tunisia) [ar-tn]
//! author : Nader Toukabri : https://github.com/naderio
/* jshint -W100 */

var artn = {
  months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
  monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
  weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
  weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
  weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[اليوم على الساعة] LT',
    nextDay: '[غدا على الساعة] LT',
    nextWeek: 'dddd [على الساعة] LT',
    lastDay: '[أمس على الساعة] LT',
    lastWeek: 'dddd [على الساعة] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'في %s',
    past: 'منذ %s',
    s: 'ثوان',
    m: 'دقيقة',
    mm: '%d دقائق',
    h: 'ساعة',
    hh: '%d ساعات',
    d: 'يوم',
    dd: '%d أيام',
    M: 'شهر',
    MM: '%d أشهر',
    y: 'سنة',
    yy: '%d سنوات'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Arabic [ar]
//! author : Abdel Said: https://github.com/abdelsaid
//! author : Ahmed Elkhatib
//! author : forabi https://github.com/forabi
/* jshint -W100 */

var symbolMap$2 = {
  1: '١',
  2: '٢',
  3: '٣',
  4: '٤',
  5: '٥',
  6: '٦',
  7: '٧',
  8: '٨',
  9: '٩',
  0: '٠'
};

var numberMap$1 = {
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '٠': '0'
};

var pluralForm$1 = function pluralForm(n) {
  return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
};

var plurals$1 = {
  s: ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
  m: ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
  h: ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
  d: ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
  M: ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
  y: ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
};

var pluralize$1 = function pluralize(u) {
  return function (number, withoutSuffix, string, isFuture) {
    var f = pluralForm$1(number);
    var str = plurals$1[u][pluralForm$1(number)];
    if (f === 2) {
      str = str[withoutSuffix ? 0 : 1];
    }
    return str.replace(/%d/i, number);
  };
};

var months$1 = ['كانون الثاني يناير', 'شباط فبراير', 'آذار مارس', 'نيسان أبريل', 'أيار مايو', 'حزيران يونيو', 'تموز يوليو', 'آب أغسطس', 'أيلول سبتمبر', 'تشرين الأول أكتوبر', 'تشرين الثاني نوفمبر', 'كانون الأول ديسمبر'];

var ar = {
  months: months$1,
  monthsShort: months$1,
  weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
  weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
  weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'D/\u200FM/\u200FYYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  meridiemParse: /ص|م/,
  isPM: function isPM(input) {
    return input === 'م';
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 12) {
      return 'ص';
    }
    return 'م';
  },

  calendar: {
    sameDay: '[اليوم عند الساعة] LT',
    nextDay: '[غدًا عند الساعة] LT',
    nextWeek: 'dddd [عند الساعة] LT',
    lastDay: '[أمس عند الساعة] LT',
    lastWeek: 'dddd [عند الساعة] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'بعد %s',
    past: 'منذ %s',
    s: pluralize$1('s'),
    m: pluralize$1('m'),
    mm: pluralize$1('m'),
    h: pluralize$1('h'),
    hh: pluralize$1('h'),
    d: pluralize$1('d'),
    dd: pluralize$1('d'),
    M: pluralize$1('M'),
    MM: pluralize$1('M'),
    y: pluralize$1('y'),
    yy: pluralize$1('y')
  },
  preparse: function preparse(string) {
    return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
      return numberMap$1[match];
    }).replace(/،/g, ',');
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$2[match];
    }).replace(/,/g, '،');
  },

  week: {
    dow: 6, // Saturday is the first day of the week.
    doy: 12 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Azerbaijani [az]
//! author : topchiyev : https://github.com/topchiyev
/* jshint -W100 */

var suffixes = {
  1: '-inci',
  5: '-inci',
  8: '-inci',
  70: '-inci',
  80: '-inci',
  2: '-nci',
  7: '-nci',
  20: '-nci',
  50: '-nci',
  3: '-üncü',
  4: '-üncü',
  100: '-üncü',
  6: '-ncı',
  9: '-uncu',
  10: '-uncu',
  30: '-uncu',
  60: '-ıncı',
  90: '-ıncı'
};

var az = {
  months: 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split('_'),
  monthsShort: 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
  weekdays: 'Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə'.split('_'),
  weekdaysShort: 'Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən'.split('_'),
  weekdaysMin: 'Bz_BE_ÇA_Çə_CA_Cü_Şə'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[bugün saat] LT',
    nextDay: '[sabah saat] LT',
    nextWeek: '[gələn həftə] dddd [saat] LT',
    lastDay: '[dünən] LT',
    lastWeek: '[keçən həftə] dddd [saat] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s sonra',
    past: '%s əvvəl',
    s: 'birneçə saniyyə',
    m: 'bir dəqiqə',
    mm: '%d dəqiqə',
    h: 'bir saat',
    hh: '%d saat',
    d: 'bir gün',
    dd: '%d gün',
    M: 'bir ay',
    MM: '%d ay',
    y: 'bir il',
    yy: '%d il'
  },
  meridiemParse: /gecə|səhər|gündüz|axşam/,
  isPM: function isPM(input) {
    return (/^(gündüz|axşam)$/.test(input)
    );
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'gecə';
    } else if (hour < 12) {
      return 'səhər';
    } else if (hour < 17) {
      return 'gündüz';
    }
    return 'axşam';
  },

  dayOfMonthOrdinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
  ordinal: function ordinal(number) {
    if (number === 0) {
      // special case for zero
      return number + '-\u0131nc\u0131';
    }
    var a = number % 10;
    var b = number % 100 - a;
    var c = number >= 100 ? 100 : null;
    return number + (suffixes[a] || suffixes[b] || suffixes[c]);
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Belarusian [be]
//! author : Dmitry Demidov : https://github.com/demidov91
//! author: Praleska: http://praleska.pro/
//! Author : Menelion Elensúle : https://github.com/Oire
/* jshint -W100 */

function plural(word, num) {
  var forms = word.split('_');
  return num % 10 === 1 && num % 100 !== 11 ? forms[0] : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2];
}

function relativeTimeWithPlural(number, withoutSuffix, key) {
  var format = {
    mm: withoutSuffix ? 'хвіліна_хвіліны_хвілін' : 'хвіліну_хвіліны_хвілін',
    hh: withoutSuffix ? 'гадзіна_гадзіны_гадзін' : 'гадзіну_гадзіны_гадзін',
    dd: 'дзень_дні_дзён',
    MM: 'месяц_месяцы_месяцаў',
    yy: 'год_гады_гадоў'
  };
  if (key === 'm') {
    return withoutSuffix ? 'хвіліна' : 'хвіліну';
  } else if (key === 'h') {
    return withoutSuffix ? 'гадзіна' : 'гадзіну';
  }
  return number + ' ' + plural(format[key], +number);
}

var be = {
  months: {
    format: 'студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня'.split('_'),
    standalone: 'студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань'.split('_')
  },
  monthsShort: 'студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж'.split('_'),
  weekdays: {
    format: 'нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу'.split('_'),
    standalone: 'нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота'.split('_'),
    isFormat: /\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/
  },
  weekdaysShort: 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
  weekdaysMin: 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY г.',
    LLL: 'D MMMM YYYY г., HH:mm',
    LLLL: 'dddd, D MMMM YYYY г., HH:mm'
  },
  calendar: {
    sameDay: '[Сёння ў] LT',
    nextDay: '[Заўтра ў] LT',
    lastDay: '[Учора ў] LT',
    nextWeek: function nextWeek() {
      return '[У] dddd [ў] LT';
    },
    lastWeek: function lastWeek() {
      switch (this.day()) {
        case 0:
        case 3:
        case 5:
        case 6:
          return '[У мінулую] dddd [ў] LT';
        case 1:
        case 2:
        case 4:
          return '[У мінулы] dddd [ў] LT';
      }
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'праз %s',
    past: '%s таму',
    s: 'некалькі секунд',
    m: relativeTimeWithPlural,
    mm: relativeTimeWithPlural,
    h: relativeTimeWithPlural,
    hh: relativeTimeWithPlural,
    d: 'дзень',
    dd: relativeTimeWithPlural,
    M: 'месяц',
    MM: relativeTimeWithPlural,
    y: 'год',
    yy: relativeTimeWithPlural
  },
  meridiemParse: /ночы|раніцы|дня|вечара/,
  isPM: function isPM(input) {
    return (/^(дня|вечара)$/.test(input)
    );
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'ночы';
    } else if (hour < 12) {
      return 'раніцы';
    } else if (hour < 17) {
      return 'дня';
    }
    return 'вечара';
  },

  dayOfMonthOrdinalParse: /\d{1,2}-(і|ы|га)/,
  ordinal: function ordinal(number, period) {
    switch (period) {
      case 'M':
      case 'd':
      case 'DDD':
      case 'w':
      case 'W':
        return (number % 10 === 2 || number % 10 === 3) && number % 100 !== 12 && number % 100 !== 13 ? number + '-\u0456' : number + '-\u044B';
      case 'D':
        return number + '-\u0433\u0430';
      default:
        return number;
    }
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Bulgarian [bg]
//! author : Krasen Borisov : https://github.com/kraz
/* jshint -W100 */

var bg = {
  months: 'януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември'.split('_'),
  monthsShort: 'янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек'.split('_'),
  weekdays: 'неделя_понеделник_вторник_сряда_четвъртък_петък_събота'.split('_'),
  weekdaysShort: 'нед_пон_вто_сря_чет_пет_съб'.split('_'),
  weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'D.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY H:mm',
    LLLL: 'dddd, D MMMM YYYY H:mm'
  },
  calendar: {
    sameDay: '[Днес в] LT',
    nextDay: '[Утре в] LT',
    nextWeek: 'dddd [в] LT',
    lastDay: '[Вчера в] LT',
    lastWeek: function lastWeek() {
      switch (this.day()) {
        case 0:
        case 3:
        case 6:
          return '[В изминалата] dddd [в] LT';
        case 1:
        case 2:
        case 4:
        case 5:
          return '[В изминалия] dddd [в] LT';
      }
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'след %s',
    past: 'преди %s',
    s: 'няколко секунди',
    m: 'минута',
    mm: '%d минути',
    h: 'час',
    hh: '%d часа',
    d: 'ден',
    dd: '%d дни',
    M: 'месец',
    MM: '%d месеца',
    y: 'година',
    yy: '%d години'
  },
  dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
  ordinal: function ordinal(number) {
    var lastDigit = number % 10;
    var last2Digits = number % 100;
    if (number === 0) {
      return number + '-\u0435\u0432';
    } else if (last2Digits === 0) {
      return number + '-\u0435\u043D';
    } else if (last2Digits > 10 && last2Digits < 20) {
      return number + '-\u0442\u0438';
    } else if (lastDigit === 1) {
      return number + '-\u0432\u0438';
    } else if (lastDigit === 2) {
      return number + '-\u0440\u0438';
    } else if (lastDigit === 7 || lastDigit === 8) {
      return number + '-\u043C\u0438';
    }
    return number + '-\u0442\u0438';
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Bambara [bm]
//! author : Estelle Comment : https://github.com/estellecomment
// Language contact person : Abdoufata Kane : https://github.com/abdoufata
/* jshint -W100 */

var bm = {
  months: 'Zanwuyekalo_Fewuruyekalo_Marisikalo_Awirilikalo_Mɛkalo_Zuwɛnkalo_Zuluyekalo_Utikalo_Sɛtanburukalo_ɔkutɔburukalo_Nowanburukalo_Desanburukalo'.split('_'),
  monthsShort: 'Zan_Few_Mar_Awi_Mɛ_Zuw_Zul_Uti_Sɛt_ɔku_Now_Des'.split('_'),
  weekdays: 'Kari_Ntɛnɛn_Tarata_Araba_Alamisa_Juma_Sibiri'.split('_'),
  weekdaysShort: 'Kar_Ntɛ_Tar_Ara_Ala_Jum_Sib'.split('_'),
  weekdaysMin: 'Ka_Nt_Ta_Ar_Al_Ju_Si'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'MMMM [tile] D [san] YYYY',
    LLL: 'MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm',
    LLLL: 'dddd MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm'
  },
  calendar: {
    sameDay: '[Bi lɛrɛ] LT',
    nextDay: '[Sini lɛrɛ] LT',
    nextWeek: 'dddd [don lɛrɛ] LT',
    lastDay: '[Kunu lɛrɛ] LT',
    lastWeek: 'dddd [tɛmɛnen lɛrɛ] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s kɔnɔ',
    past: 'a bɛ %s bɔ',
    s: 'sanga dama dama',
    m: 'miniti kelen',
    mm: 'miniti %d',
    h: 'lɛrɛ kelen',
    hh: 'lɛrɛ %d',
    d: 'tile kelen',
    dd: 'tile %d',
    M: 'kalo kelen',
    MM: 'kalo %d',
    y: 'san kelen',
    yy: 'san %d'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Bengali [bn]
//! author : Kaushik Gandhi : https://github.com/kaushikgandhi
/* jshint -W100 */

var symbolMap$3 = {
  1: '১',
  2: '২',
  3: '৩',
  4: '৪',
  5: '৫',
  6: '৬',
  7: '৭',
  8: '৮',
  9: '৯',
  0: '০'
};

var numberMap$2 = {
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
  '০': '0'
};

var bn = {
  months: 'জানুয়ারী_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
  monthsShort: 'জানু_ফেব_মার্চ_এপ্র_মে_জুন_জুল_আগ_সেপ্ট_অক্টো_নভে_ডিসে'.split('_'),
  weekdays: 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার'.split('_'),
  weekdaysShort: 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি'.split('_'),
  weekdaysMin: 'রবি_সোম_মঙ্গ_বুধ_বৃহঃ_শুক্র_শনি'.split('_'),
  longDateFormat: {
    LT: 'A h:mm সময়',
    LTS: 'A h:mm:ss সময়',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY, A h:mm সময়',
    LLLL: 'dddd, D MMMM YYYY, A h:mm সময়'
  },
  calendar: {
    sameDay: '[আজ] LT',
    nextDay: '[আগামীকাল] LT',
    nextWeek: 'dddd, LT',
    lastDay: '[গতকাল] LT',
    lastWeek: '[গত] dddd, LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s পরে',
    past: '%s আগে',
    s: 'কয়েক সেকেন্ড',
    m: 'এক মিনিট',
    mm: '%d মিনিট',
    h: 'এক ঘন্টা',
    hh: '%d ঘন্টা',
    d: 'এক দিন',
    dd: '%d দিন',
    M: 'এক মাস',
    MM: '%d মাস',
    y: 'এক বছর',
    yy: '%d বছর'
  },
  preparse: function preparse(string) {
    return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function (match) {
      return numberMap$2[match];
    });
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$3[match];
    });
  },

  meridiemParse: /রাত|সকাল|দুপুর|বিকাল|রাত/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'রাত' && hour >= 4 || meridiem === 'দুপুর' && hour < 5 || meridiem === 'বিকাল') {
      return hour + 12;
    }
    return hour;
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'রাত';
    } else if (hour < 10) {
      return 'সকাল';
    } else if (hour < 17) {
      return 'দুপুর';
    } else if (hour < 20) {
      return 'বিকাল';
    }
    return 'রাত';
  },

  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Tibetan [bo]
//! author : Thupten N. Chakrishar : https://github.com/vajradog
/* jshint -W100 */

var symbolMap$4 = {
  1: '༡',
  2: '༢',
  3: '༣',
  4: '༤',
  5: '༥',
  6: '༦',
  7: '༧',
  8: '༨',
  9: '༩',
  0: '༠'
};

var numberMap$3 = {
  '༡': '1',
  '༢': '2',
  '༣': '3',
  '༤': '4',
  '༥': '5',
  '༦': '6',
  '༧': '7',
  '༨': '8',
  '༩': '9',
  '༠': '0'
};

var bo = {
  months: 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
  monthsShort: 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
  weekdays: 'གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་'.split('_'),
  weekdaysShort: 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
  weekdaysMin: 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
  longDateFormat: {
    LT: 'A h:mm',
    LTS: 'A h:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY, A h:mm',
    LLLL: 'dddd, D MMMM YYYY, A h:mm'
  },
  calendar: {
    sameDay: '[དི་རིང] LT',
    nextDay: '[སང་ཉིན] LT',
    nextWeek: '[བདུན་ཕྲག་རྗེས་མ], LT',
    lastDay: '[ཁ་སང] LT',
    lastWeek: '[བདུན་ཕྲག་མཐའ་མ] dddd, LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s ལ་',
    past: '%s སྔན་ལ',
    s: 'ལམ་སང',
    m: 'སྐར་མ་གཅིག',
    mm: '%d སྐར་མ',
    h: 'ཆུ་ཚོད་གཅིག',
    hh: '%d ཆུ་ཚོད',
    d: 'ཉིན་གཅིག',
    dd: '%d ཉིན་',
    M: 'ཟླ་བ་གཅིག',
    MM: '%d ཟླ་བ',
    y: 'ལོ་གཅིག',
    yy: '%d ལོ'
  },
  preparse: function preparse(string) {
    return string.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function (match) {
      return numberMap$3[match];
    });
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$4[match];
    });
  },

  meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'མཚན་མོ' && hour >= 4 || meridiem === 'ཉིན་གུང' && hour < 5 || meridiem === 'དགོང་དག') {
      return hour + 12;
    }
    return hour;
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'མཚན་མོ';
    } else if (hour < 10) {
      return 'ཞོགས་ཀས';
    } else if (hour < 17) {
      return 'ཉིན་གུང';
    } else if (hour < 20) {
      return 'དགོང་དག';
    }
    return 'མཚན་མོ';
  },

  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Breton [br]
//! author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou
/* jshint -W100 */

function relativeTimeWithMutation(number, withoutSuffix, key) {
  var format = {
    mm: 'munutenn',
    MM: 'miz',
    dd: 'devezh'
  };
  return number + ' ' + mutation(format[key], number);
}

function specialMutationForYears(number) {
  switch (lastNumber(number)) {
    case 1:
    case 3:
    case 4:
    case 5:
    case 9:
      return number + ' bloaz';
    default:
      return number + ' vloaz';
  }
}

function lastNumber(number) {
  if (number > 9) {
    return lastNumber(number % 10);
  }
  return number;
}

function mutation(text, number) {
  if (number === 2) {
    return softMutation(text);
  }
  return text;
}

function softMutation(text) {
  var mutationTable = {
    m: 'v',
    b: 'v',
    d: 'z'
  };
  if (mutationTable[text.charAt(0)] === undefined) {
    return text;
  }
  return mutationTable[text.charAt(0)] + text.substring(1);
}

var br = {
  months: 'Genver_C\'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu'.split('_'),
  monthsShort: 'Gen_C\'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker'.split('_'),
  weekdays: 'Sul_Lun_Meurzh_Merc\'her_Yaou_Gwener_Sadorn'.split('_'),
  weekdaysShort: 'Sul_Lun_Meu_Mer_Yao_Gwe_Sad'.split('_'),
  weekdaysMin: 'Su_Lu_Me_Mer_Ya_Gw_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'h[e]mm A',
    LTS: 'h[e]mm:ss A',
    L: 'DD/MM/YYYY',
    LL: 'D [a viz] MMMM YYYY',
    LLL: 'D [a viz] MMMM YYYY h[e]mm A',
    LLLL: 'dddd, D [a viz] MMMM YYYY h[e]mm A'
  },
  calendar: {
    sameDay: '[Hiziv da] LT',
    nextDay: '[Warc\'hoazh da] LT',
    nextWeek: 'dddd [da] LT',
    lastDay: '[Dec\'h da] LT',
    lastWeek: 'dddd [paset da] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'a-benn %s',
    past: '%s \'zo',
    s: 'un nebeud segondennoù',
    m: 'ur vunutenn',
    mm: relativeTimeWithMutation,
    h: 'un eur',
    hh: '%d eur',
    d: 'un devezh',
    dd: relativeTimeWithMutation,
    M: 'ur miz',
    MM: relativeTimeWithMutation,
    y: 'ur bloaz',
    yy: specialMutationForYears
  },
  dayOfMonthOrdinalParse: /\d{1,2}(añ|vet)/,
  ordinal: function ordinal(number) {
    var output = number === 1 ? 'añ' : 'vet';
    return number + output;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Bosnian [bs]
//! author : Nedim Cholich : https://github.com/frontyard
//! based on (hr) translation by Bojan Marković
/* jshint -W100 */

function translate(number, withoutSuffix, key) {
  var result = number + ' ';
  switch (key) {
    case 'm':
      return withoutSuffix ? 'jedna minuta' : 'jedne minute';
    case 'mm':
      if (number === 1) {
        result += 'minuta';
      } else if (number === 2 || number === 3 || number === 4) {
        result += 'minute';
      } else {
        result += 'minuta';
      }
      return result;
    case 'h':
      return withoutSuffix ? 'jedan sat' : 'jednog sata';
    case 'hh':
      if (number === 1) {
        result += 'sat';
      } else if (number === 2 || number === 3 || number === 4) {
        result += 'sata';
      } else {
        result += 'sati';
      }
      return result;
    case 'dd':
      if (number === 1) {
        result += 'dan';
      } else {
        result += 'dana';
      }
      return result;
    case 'MM':
      if (number === 1) {
        result += 'mjesec';
      } else if (number === 2 || number === 3 || number === 4) {
        result += 'mjeseca';
      } else {
        result += 'mjeseci';
      }
      return result;
    case 'yy':
      if (number === 1) {
        result += 'godina';
      } else if (number === 2 || number === 3 || number === 4) {
        result += 'godine';
      } else {
        result += 'godina';
      }
      return result;
  }
}

var bs = {
  months: 'januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar'.split('_'),
  monthsShort: 'jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.'.split('_'),
  monthsParseExact: true,
  weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
  weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
  weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY H:mm',
    LLLL: 'dddd, D. MMMM YYYY H:mm'
  },
  calendar: {
    sameDay: '[danas u] LT',
    nextDay: '[sutra u] LT',
    nextWeek: function nextWeek() {
      switch (this.day()) {
        case 0:
          return '[u] [nedjelju] [u] LT';
        case 3:
          return '[u] [srijedu] [u] LT';
        case 6:
          return '[u] [subotu] [u] LT';
        case 1:
        case 2:
        case 4:
        case 5:
          return '[u] dddd [u] LT';
      }
    },

    lastDay: '[jučer u] LT',
    lastWeek: function lastWeek() {
      switch (this.day()) {
        case 0:
        case 3:
          return '[prošlu] dddd [u] LT';
        case 6:
          return '[prošle] [subote] [u] LT';
        case 1:
        case 2:
        case 4:
        case 5:
          return '[prošli] dddd [u] LT';
      }
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'za %s',
    past: 'prije %s',
    s: 'par sekundi',
    m: translate,
    mm: translate,
    h: translate,
    hh: translate,
    d: 'dan',
    dd: translate,
    M: 'mjesec',
    MM: translate,
    y: 'godinu',
    yy: translate
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Catalan [ca]
//! author : Juan G. Hurtado : https://github.com/juanghurtado
/* jshint -W100 */

var ca = {
  months: {
    standalone: 'gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split('_'),
    format: 'de gener_de febrer_de març_d\'abril_de maig_de juny_de juliol_d\'agost_de setembre_d\'octubre_de novembre_de desembre'.split('_'),
    isFormat: /D[oD]?(\s)+MMMM/
  },
  monthsShort: 'gen._febr._març_abr._maig_juny_jul._ag._set._oct._nov._des.'.split('_'),
  monthsParseExact: true,
  weekdays: 'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split('_'),
  weekdaysShort: 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
  weekdaysMin: 'dg_dl_dt_dc_dj_dv_ds'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM [de] YYYY',
    ll: 'D MMM YYYY',
    LLL: 'D MMMM [de] YYYY [a les] H:mm',
    lll: 'D MMM YYYY, H:mm',
    LLLL: 'dddd D MMMM [de] YYYY [a les] H:mm',
    llll: 'ddd D MMM YYYY, H:mm'
  },
  calendar: {
    sameDay: function sameDay() {
      return '[avui a ' + (this.hours() !== 1 ? 'les' : 'la') + '] LT';
    },
    nextDay: function nextDay() {
      return '[dem\xE0 a ' + (this.hours() !== 1 ? 'les' : 'la') + '] LT';
    },
    nextWeek: function nextWeek() {
      return 'dddd [a ' + (this.hours() !== 1 ? 'les' : 'la') + '] LT';
    },
    lastDay: function lastDay() {
      return '[ahir a ' + (this.hours() !== 1 ? 'les' : 'la') + '] LT';
    },
    lastWeek: function lastWeek() {
      return '[el] dddd [passat a ' + (this.hours() !== 1 ? 'les' : 'la') + '] LT';
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'd\'aquí %s',
    past: 'fa %s',
    s: 'uns segons',
    m: 'un minut',
    mm: '%d minuts',
    h: 'una hora',
    hh: '%d hores',
    d: 'un dia',
    dd: '%d dies',
    M: 'un mes',
    MM: '%d mesos',
    y: 'un any',
    yy: '%d anys'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(r|n|t|è|a)/,
  ordinal: function ordinal(number, period) {
    var output = number === 1 ? 'r' : number === 2 ? 'n' : number === 3 ? 'r' : number === 4 ? 't' : 'è';
    if (period === 'w' || period === 'W') {
      output = 'a';
    }
    return number + output;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Czech [cs]
//! author : petrbela : https://github.com/petrbela
/* jshint -W100 */

var months$2 = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_');
var monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_');

function plural$1(n) {
  return n > 1 && n < 5 && ~~(n / 10) !== 1;
}

function translate$1(number, withoutSuffix, key, isFuture) {
  var result = number + ' ';
  switch (key) {
    case 's':
      // a few seconds / in a few seconds / a few seconds ago
      return withoutSuffix || isFuture ? 'pár sekund' : 'pár sekundami';
    case 'm':
      // a minute / in a minute / a minute ago
      return withoutSuffix ? 'minuta' : isFuture ? 'minutu' : 'minutou';
    case 'mm':
      // 9 minutes / in 9 minutes / 9 minutes ago
      if (withoutSuffix || isFuture) {
        return result + (plural$1(number) ? 'minuty' : 'minut');
      }
      return result + 'minutami';

      break;
    case 'h':
      // an hour / in an hour / an hour ago
      return withoutSuffix ? 'hodina' : isFuture ? 'hodinu' : 'hodinou';
    case 'hh':
      // 9 hours / in 9 hours / 9 hours ago
      if (withoutSuffix || isFuture) {
        return result + (plural$1(number) ? 'hodiny' : 'hodin');
      }
      return result + 'hodinami';

      break;
    case 'd':
      // a day / in a day / a day ago
      return withoutSuffix || isFuture ? 'den' : 'dnem';
    case 'dd':
      // 9 days / in 9 days / 9 days ago
      if (withoutSuffix || isFuture) {
        return result + (plural$1(number) ? 'dny' : 'dní');
      }
      return result + 'dny';

      break;
    case 'M':
      // a month / in a month / a month ago
      return withoutSuffix || isFuture ? 'měsíc' : 'měsícem';
    case 'MM':
      // 9 months / in 9 months / 9 months ago
      if (withoutSuffix || isFuture) {
        return result + (plural$1(number) ? 'měsíce' : 'měsíců');
      }
      return result + 'm\u011Bs\xEDci';

      break;
    case 'y':
      // a year / in a year / a year ago
      return withoutSuffix || isFuture ? 'rok' : 'rokem';
    case 'yy':
      // 9 years / in 9 years / 9 years ago
      if (withoutSuffix || isFuture) {
        return result + (plural$1(number) ? 'roky' : 'let');
      }
      return result + 'lety';

      break;
  }
}

var cs = {
  months: months$2,
  monthsShort: monthsShort,
  monthsParse: function (months, monthsShort) {
    var i = void 0;
    var _monthsParse = [];
    for (i = 0; i < 12; i++) {
      // use custom parser to solve problem with July (červenec)
      _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
    }
    return _monthsParse;
  }(months$2, monthsShort),
  shortMonthsParse: function (monthsShort) {
    var i = void 0;
    var _shortMonthsParse = [];
    for (i = 0; i < 12; i++) {
      _shortMonthsParse[i] = new RegExp('^' + monthsShort[i] + '$', 'i');
    }
    return _shortMonthsParse;
  }(monthsShort),
  longMonthsParse: function (months) {
    var i = void 0;
    var _longMonthsParse = [];
    for (i = 0; i < 12; i++) {
      _longMonthsParse[i] = new RegExp('^' + months[i] + '$', 'i');
    }
    return _longMonthsParse;
  }(months$2),
  weekdays: 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
  weekdaysShort: 'ne_po_út_st_čt_pá_so'.split('_'),
  weekdaysMin: 'ne_po_út_st_čt_pá_so'.split('_'),
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY H:mm',
    LLLL: 'dddd D. MMMM YYYY H:mm',
    l: 'D. M. YYYY'
  },
  calendar: {
    sameDay: '[dnes v] LT',
    nextDay: '[zítra v] LT',
    nextWeek: function nextWeek() {
      switch (this.day()) {
        case 0:
          return '[v neděli v] LT';
        case 1:
        case 2:
          return '[v] dddd [v] LT';
        case 3:
          return '[ve středu v] LT';
        case 4:
          return '[ve čtvrtek v] LT';
        case 5:
          return '[v pátek v] LT';
        case 6:
          return '[v sobotu v] LT';
      }
    },

    lastDay: '[včera v] LT',
    lastWeek: function lastWeek() {
      switch (this.day()) {
        case 0:
          return '[minulou neděli v] LT';
        case 1:
        case 2:
          return '[minulé] dddd [v] LT';
        case 3:
          return '[minulou středu v] LT';
        case 4:
        case 5:
          return '[minulý] dddd [v] LT';
        case 6:
          return '[minulou sobotu v] LT';
      }
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'za %s',
    past: 'před %s',
    s: translate$1,
    m: translate$1,
    mm: translate$1,
    h: translate$1,
    hh: translate$1,
    d: translate$1,
    dd: translate$1,
    M: translate$1,
    MM: translate$1,
    y: translate$1,
    yy: translate$1
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Chuvash [cv]
//! author : Anatoly Mironov : https://github.com/mirontoli
/* jshint -W100 */

var cv = {
  months: 'кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав'.split('_'),
  monthsShort: 'кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш'.split('_'),
  weekdays: 'вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун'.split('_'),
  weekdaysShort: 'выр_тун_ытл_юн_кӗҫ_эрн_шӑм'.split('_'),
  weekdaysMin: 'вр_тн_ыт_юн_кҫ_эр_шм'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD-MM-YYYY',
    LL: 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]',
    LLL: 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm',
    LLLL: 'dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm'
  },
  calendar: {
    sameDay: '[Паян] LT [сехетре]',
    nextDay: '[Ыран] LT [сехетре]',
    lastDay: '[Ӗнер] LT [сехетре]',
    nextWeek: '[Ҫитес] dddd LT [сехетре]',
    lastWeek: '[Иртнӗ] dddd LT [сехетре]',
    sameElse: 'L'
  },
  relativeTime: {
    future: function future(output) {
      var affix = /сехет$/i.exec(output) ? 'рен' : /ҫул$/i.exec(output) ? 'тан' : 'ран';
      return output + affix;
    },

    past: '%s каялла',
    s: 'пӗр-ик ҫеккунт',
    m: 'пӗр минут',
    mm: '%d минут',
    h: 'пӗр сехет',
    hh: '%d сехет',
    d: 'пӗр кун',
    dd: '%d кун',
    M: 'пӗр уйӑх',
    MM: '%d уйӑх',
    y: 'пӗр ҫул',
    yy: '%d ҫул'
  },
  dayOfMonthOrdinalParse: /\d{1,2}-мӗш/,
  ordinal: '%d-мӗш',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Welsh [cy]
//! author : Robert Allen : https://github.com/robgallen
//! author : https://github.com/ryangreaves
/* jshint -W100 */

var cy = {
  months: 'Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr'.split('_'),
  monthsShort: 'Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag'.split('_'),
  weekdays: 'Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn'.split('_'),
  weekdaysShort: 'Sul_Llun_Maw_Mer_Iau_Gwe_Sad'.split('_'),
  weekdaysMin: 'Su_Ll_Ma_Me_Ia_Gw_Sa'.split('_'),
  weekdaysParseExact: true,
  // time formats are the same as en-gb
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Heddiw am] LT',
    nextDay: '[Yfory am] LT',
    nextWeek: 'dddd [am] LT',
    lastDay: '[Ddoe am] LT',
    lastWeek: 'dddd [diwethaf am] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'mewn %s',
    past: '%s yn ôl',
    s: 'ychydig eiliadau',
    m: 'munud',
    mm: '%d munud',
    h: 'awr',
    hh: '%d awr',
    d: 'diwrnod',
    dd: '%d diwrnod',
    M: 'mis',
    MM: '%d mis',
    y: 'blwyddyn',
    yy: '%d flynedd'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
  // traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
  ordinal: function ordinal(number) {
    var b = number;
    var output = '';
    var lookup = ['', 'af', 'il', 'ydd', 'ydd', 'ed', 'ed', 'ed', 'fed', 'fed', 'fed', // 1af to 10fed
    'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'fed'];
    if (b > 20) {
      if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
        output = 'fed'; // not 30ain, 70ain or 90ain
      } else {
        output = 'ain';
      }
    } else if (b > 0) {
      output = lookup[b];
    }
    return number + output;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Danish [da]
//! author : Ulrik Nielsen : https://github.com/mrbase
/* jshint -W100 */

var da = {
  months: 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
  monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
  weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
  weekdaysShort: 'søn_man_tir_ons_tor_fre_lør'.split('_'),
  weekdaysMin: 'sø_ma_ti_on_to_fr_lø'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY HH:mm',
    LLLL: 'dddd [d.] D. MMMM YYYY [kl.] HH:mm'
  },
  calendar: {
    sameDay: '[i dag kl.] LT',
    nextDay: '[i morgen kl.] LT',
    nextWeek: 'på dddd [kl.] LT',
    lastDay: '[i går kl.] LT',
    lastWeek: '[i] dddd[s kl.] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'om %s',
    past: '%s siden',
    s: 'få sekunder',
    m: 'et minut',
    mm: '%d minutter',
    h: 'en time',
    hh: '%d timer',
    d: 'en dag',
    dd: '%d dage',
    M: 'en måned',
    MM: '%d måneder',
    y: 'et år',
    yy: '%d år'
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : German (Austria) [de-at]
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Martin Groller : https://github.com/MadMG
//! author : Mikolaj Dadela : https://github.com/mik01aj
/* jshint -W100 */

function processRelativeTime(number, withoutSuffix, key, isFuture) {
  var format = {
    m: ['eine Minute', 'einer Minute'],
    h: ['eine Stunde', 'einer Stunde'],
    d: ['ein Tag', 'einem Tag'],
    dd: [number + ' Tage', number + ' Tagen'],
    M: ['ein Monat', 'einem Monat'],
    MM: [number + ' Monate', number + ' Monaten'],
    y: ['ein Jahr', 'einem Jahr'],
    yy: [number + ' Jahre', number + ' Jahren']
  };
  return withoutSuffix ? format[key][0] : format[key][1];
}

var deat = {
  months: 'Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
  monthsShort: 'Jän._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
  monthsParseExact: true,
  weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
  weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
  weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY HH:mm',
    LLLL: 'dddd, D. MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[heute um] LT [Uhr]',
    sameElse: 'L',
    nextDay: '[morgen um] LT [Uhr]',
    nextWeek: 'dddd [um] LT [Uhr]',
    lastDay: '[gestern um] LT [Uhr]',
    lastWeek: '[letzten] dddd [um] LT [Uhr]'
  },
  relativeTime: {
    future: 'in %s',
    past: 'vor %s',
    s: 'ein paar Sekunden',
    m: processRelativeTime,
    mm: '%d Minuten',
    h: processRelativeTime,
    hh: '%d Stunden',
    d: processRelativeTime,
    dd: processRelativeTime,
    M: processRelativeTime,
    MM: processRelativeTime,
    y: processRelativeTime,
    yy: processRelativeTime
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : German (Switzerland) [de-ch]
//! author : sschueller : https://github.com/sschueller

// based on: https://www.bk.admin.ch/dokumentation/sprachen/04915/05016/index.html?lang=de#
/* jshint -W100 */

function processRelativeTime$1(number, withoutSuffix, key, isFuture) {
  var format = {
    m: ['eine Minute', 'einer Minute'],
    h: ['eine Stunde', 'einer Stunde'],
    d: ['ein Tag', 'einem Tag'],
    dd: [number + ' Tage', number + ' Tagen'],
    M: ['ein Monat', 'einem Monat'],
    MM: [number + ' Monate', number + ' Monaten'],
    y: ['ein Jahr', 'einem Jahr'],
    yy: [number + ' Jahre', number + ' Jahren']
  };
  return withoutSuffix ? format[key][0] : format[key][1];
}

var dech = {
  months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
  monthsShort: 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
  monthsParseExact: true,
  weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
  weekdaysShort: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
  weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH.mm',
    LTS: 'HH.mm.ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY HH.mm',
    LLLL: 'dddd, D. MMMM YYYY HH.mm'
  },
  calendar: {
    sameDay: '[heute um] LT [Uhr]',
    sameElse: 'L',
    nextDay: '[morgen um] LT [Uhr]',
    nextWeek: 'dddd [um] LT [Uhr]',
    lastDay: '[gestern um] LT [Uhr]',
    lastWeek: '[letzten] dddd [um] LT [Uhr]'
  },
  relativeTime: {
    future: 'in %s',
    past: 'vor %s',
    s: 'ein paar Sekunden',
    m: processRelativeTime$1,
    mm: '%d Minuten',
    h: processRelativeTime$1,
    hh: '%d Stunden',
    d: processRelativeTime$1,
    dd: processRelativeTime$1,
    M: processRelativeTime$1,
    MM: processRelativeTime$1,
    y: processRelativeTime$1,
    yy: processRelativeTime$1
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : German [de]
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Mikolaj Dadela : https://github.com/mik01aj
/* jshint -W100 */

function processRelativeTime$2(number, withoutSuffix, key, isFuture) {
  var format = {
    m: ['eine Minute', 'einer Minute'],
    h: ['eine Stunde', 'einer Stunde'],
    d: ['ein Tag', 'einem Tag'],
    dd: [number + ' Tage', number + ' Tagen'],
    M: ['ein Monat', 'einem Monat'],
    MM: [number + ' Monate', number + ' Monaten'],
    y: ['ein Jahr', 'einem Jahr'],
    yy: [number + ' Jahre', number + ' Jahren']
  };
  return withoutSuffix ? format[key][0] : format[key][1];
}

var de = {
  months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
  monthsShort: 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
  monthsParseExact: true,
  weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
  weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
  weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY HH:mm',
    LLLL: 'dddd, D. MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[heute um] LT [Uhr]',
    sameElse: 'L',
    nextDay: '[morgen um] LT [Uhr]',
    nextWeek: 'dddd [um] LT [Uhr]',
    lastDay: '[gestern um] LT [Uhr]',
    lastWeek: '[letzten] dddd [um] LT [Uhr]'
  },
  relativeTime: {
    future: 'in %s',
    past: 'vor %s',
    s: 'ein paar Sekunden',
    m: processRelativeTime$2,
    mm: '%d Minuten',
    h: processRelativeTime$2,
    hh: '%d Stunden',
    d: processRelativeTime$2,
    dd: processRelativeTime$2,
    M: processRelativeTime$2,
    MM: processRelativeTime$2,
    y: processRelativeTime$2,
    yy: processRelativeTime$2
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Maldivian [dv]
//! author : Jawish Hameed : https://github.com/jawish
/* jshint -W100 */

var months$3 = ['ޖެނުއަރީ', 'ފެބްރުއަރީ', 'މާރިޗު', 'އޭޕްރީލު', 'މޭ', 'ޖޫން', 'ޖުލައި', 'އޯގަސްޓު', 'ސެޕްޓެމްބަރު', 'އޮކްޓޯބަރު', 'ނޮވެމްބަރު', 'ޑިސެމްބަރު'];

var weekdays = ['އާދިއްތަ', 'ހޯމަ', 'އަންގާރަ', 'ބުދަ', 'ބުރާސްފަތި', 'ހުކުރު', 'ހޮނިހިރު'];

var dv = {
  months: months$3,
  monthsShort: months$3,
  weekdays: weekdays,
  weekdaysShort: weekdays,
  weekdaysMin: 'އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި'.split('_'),
  longDateFormat: {

    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'D/M/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  meridiemParse: /މކ|މފ/,
  isPM: function isPM(input) {
    return input === 'މފ';
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 12) {
      return 'މކ';
    }
    return 'މފ';
  },

  calendar: {
    sameDay: '[މިއަދު] LT',
    nextDay: '[މާދަމާ] LT',
    nextWeek: 'dddd LT',
    lastDay: '[އިއްޔެ] LT',
    lastWeek: '[ފާއިތުވި] dddd LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'ތެރޭގައި %s',
    past: 'ކުރިން %s',
    s: 'ސިކުންތުކޮޅެއް',
    m: 'މިނިޓެއް',
    mm: 'މިނިޓު %d',
    h: 'ގަޑިއިރެއް',
    hh: 'ގަޑިއިރު %d',
    d: 'ދުވަހެއް',
    dd: 'ދުވަސް %d',
    M: 'މަހެއް',
    MM: 'މަސް %d',
    y: 'އަހަރެއް',
    yy: 'އަހަރު %d'
  },
  preparse: function preparse(string) {
    return string.replace(/،/g, ',');
  },
  postformat: function postformat(string) {
    return string.replace(/,/g, '،');
  },

  week: {
    dow: 7, // Sunday is the first day of the week.
    doy: 12 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Greek [el]
//! author : Aggelos Karalias : https://github.com/mehiel
/* jshint -W100 */

var el = {
  monthsNominativeEl: 'Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος'.split('_'),
  monthsGenitiveEl: 'Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου'.split('_'),
  months: function months(momentToFormat, format) {
    if (!momentToFormat) {
      return this._monthsNominativeEl;
    } else if (typeof format === 'string' && /D/.test(format.substring(0, format.indexOf('MMMM')))) {
      // if there is a day number before 'MMMM'
      return this._monthsGenitiveEl[momentToFormat.month()];
    }
    return this._monthsNominativeEl[momentToFormat.month()];
  },

  monthsShort: 'Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ'.split('_'),
  weekdays: 'Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο'.split('_'),
  weekdaysShort: 'Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ'.split('_'),
  weekdaysMin: 'Κυ_Δε_Τρ_Τε_Πε_Πα_Σα'.split('_'),
  meridiem: function meridiem(hours, minutes, isLower) {
    if (hours > 11) {
      return isLower ? 'μμ' : 'ΜΜ';
    }
    return isLower ? 'πμ' : 'ΠΜ';
  },
  isPM: function isPM(input) {
    return ('' + input).toLowerCase()[0] === 'μ';
  },

  meridiemParse: /[ΠΜ]\.?Μ?\.?/i,
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY h:mm A',
    LLLL: 'dddd, D MMMM YYYY h:mm A'
  },
  calendarEl: {
    sameDay: '[Σήμερα {}] LT',
    nextDay: '[Αύριο {}] LT',
    nextWeek: 'dddd [{}] LT',
    lastDay: '[Χθες {}] LT',
    lastWeek: function lastWeek() {
      switch (this.day()) {
        case 6:
          return '[το προηγούμενο] dddd [{}] LT';
        default:
          return '[την προηγούμενη] dddd [{}] LT';
      }
    },

    sameElse: 'L'
  },
  calendar: function calendar(key, mom) {
    var output = this._calendarEl[key],
        hours = mom && mom.hours();
    if (isFunction(output)) {
      output = output.apply(mom);
    }
    return output.replace('{}', hours % 12 === 1 ? 'στη' : 'στις');
  },

  relativeTime: {
    future: 'σε %s',
    past: '%s πριν',
    s: 'λίγα δευτερόλεπτα',
    m: 'ένα λεπτό',
    mm: '%d λεπτά',
    h: 'μία ώρα',
    hh: '%d ώρες',
    d: 'μία μέρα',
    dd: '%d μέρες',
    M: 'ένας μήνας',
    MM: '%d μήνες',
    y: 'ένας χρόνος',
    yy: '%d χρόνια'
  },
  dayOfMonthOrdinalParse: /\d{1,2}η/,
  ordinal: '%dη',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : English (Australia) [en-au]
//! author : Jared Morse : https://github.com/jarcoal
/* jshint -W100 */

var enau = {
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY h:mm A',
    LLLL: 'dddd, D MMMM YYYY h:mm A'
  },
  calendar: {
    sameDay: '[Today at] LT',
    nextDay: '[Tomorrow at] LT',
    nextWeek: 'dddd [at] LT',
    lastDay: '[Yesterday at] LT',
    lastWeek: '[Last] dddd [at] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
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
  },
  dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
  ordinal: function ordinal(number) {
    var b = number % 10;
    var output = ~~(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
    return number + output;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : English (Canada) [en-ca]
//! author : Jonathan Abourbih : https://github.com/jonbca
/* jshint -W100 */

var enca = {
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'YYYY-MM-DD',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm A',
    LLLL: 'dddd, MMMM D, YYYY h:mm A'
  },
  calendar: {
    sameDay: '[Today at] LT',
    nextDay: '[Tomorrow at] LT',
    nextWeek: 'dddd [at] LT',
    lastDay: '[Yesterday at] LT',
    lastWeek: '[Last] dddd [at] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
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
  },
  dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
  ordinal: function ordinal(number) {
    var b = number % 10;
    var output = ~~(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
    return number + output;
  }
};

//! now.js locale configuration
//! locale : English (United Kingdom) [en-gb]
//! author : Chris Gedrim : https://github.com/chrisgedrim
/* jshint -W100 */

var engb = {
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Today at] LT',
    nextDay: '[Tomorrow at] LT',
    nextWeek: 'dddd [at] LT',
    lastDay: '[Yesterday at] LT',
    lastWeek: '[Last] dddd [at] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
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
  },
  dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
  ordinal: function ordinal(number) {
    var b = number % 10;
    var output = ~~(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
    return number + output;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : English (Ireland) [en-ie]
//! author : Chris Cartlidge : https://github.com/chriscartlidge
/* jshint -W100 */

var enie = {
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD-MM-YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Today at] LT',
    nextDay: '[Tomorrow at] LT',
    nextWeek: 'dddd [at] LT',
    lastDay: '[Yesterday at] LT',
    lastWeek: '[Last] dddd [at] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
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
  },
  dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
  ordinal: function ordinal(number) {
    var b = number % 10;
    var output = ~~(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
    return number + output;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : English (New Zealand) [en-nz]
//! author : Luke McGregor : https://github.com/lukemcgregor
/* jshint -W100 */

var ennz = {
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY h:mm A',
    LLLL: 'dddd, D MMMM YYYY h:mm A'
  },
  calendar: {
    sameDay: '[Today at] LT',
    nextDay: '[Tomorrow at] LT',
    nextWeek: 'dddd [at] LT',
    lastDay: '[Yesterday at] LT',
    lastWeek: '[Last] dddd [at] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
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
  },
  dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
  ordinal: function ordinal(number) {
    var b = number % 10;
    var output = ~~(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
    return number + output;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Esperanto [eo]
//! author : Colin Dean : https://github.com/colindean
//! author : Mia Nordentoft Imperatori : https://github.com/miestasmia
//! comment : miestasmia corrected the translation by colindean
/* jshint -W100 */

var eo = {
  months: 'januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro'.split('_'),
  monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec'.split('_'),
  weekdays: 'dimanĉo_lundo_mardo_merkredo_ĵaŭdo_vendredo_sabato'.split('_'),
  weekdaysShort: 'dim_lun_mard_merk_ĵaŭ_ven_sab'.split('_'),
  weekdaysMin: 'di_lu_ma_me_ĵa_ve_sa'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'D[-a de] MMMM, YYYY',
    LLL: 'D[-a de] MMMM, YYYY HH:mm',
    LLLL: 'dddd, [la] D[-a de] MMMM, YYYY HH:mm'
  },
  meridiemParse: /[ap]\.t\.m/i,
  isPM: function isPM(input) {
    return input.charAt(0).toLowerCase() === 'p';
  },
  meridiem: function meridiem(hours, minutes, isLower) {
    if (hours > 11) {
      return isLower ? 'p.t.m.' : 'P.T.M.';
    }
    return isLower ? 'a.t.m.' : 'A.T.M.';
  },

  calendar: {
    sameDay: '[Hodiaŭ je] LT',
    nextDay: '[Morgaŭ je] LT',
    nextWeek: 'dddd [je] LT',
    lastDay: '[Hieraŭ je] LT',
    lastWeek: '[pasinta] dddd [je] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'post %s',
    past: 'antaŭ %s',
    s: 'sekundoj',
    m: 'minuto',
    mm: '%d minutoj',
    h: 'horo',
    hh: '%d horoj',
    d: 'tago', // ne 'diurno', ĉar estas uzita por proksimumo
    dd: '%d tagoj',
    M: 'monato',
    MM: '%d monatoj',
    y: 'jaro',
    yy: '%d jaroj'
  },
  dayOfMonthOrdinalParse: /\d{1,2}a/,
  ordinal: '%da',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Spanish (Dominican Republic) [es-do]
/* jshint -W100 */

var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var _monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

var monthsParse = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i];
var monthsRegex = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

var esdo = {
  months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
  monthsShort: function monthsShort(m, format) {
    if (!m) {
      return monthsShortDot;
    } else if (/-MMM-/.test(format)) {
      return _monthsShort[m.month()];
    }
    return monthsShortDot[m.month()];
  },

  monthsRegex: monthsRegex,
  monthsShortRegex: monthsRegex,
  monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
  monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
  monthsParse: monthsParse,
  longMonthsParse: monthsParse,
  shortMonthsParse: monthsParse,
  weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
  weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
  weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'DD/MM/YYYY',
    LL: 'D [de] MMMM [de] YYYY',
    LLL: 'D [de] MMMM [de] YYYY h:mm A',
    LLLL: 'dddd, D [de] MMMM [de] YYYY h:mm A'
  },
  calendar: {
    sameDay: function sameDay() {
      return '[hoy a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },
    nextDay: function nextDay() {
      return '[ma\xF1ana a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },
    nextWeek: function nextWeek() {
      return 'dddd [a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },
    lastDay: function lastDay() {
      return '[ayer a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },
    lastWeek: function lastWeek() {
      return '[el] dddd [pasado a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'en %s',
    past: 'hace %s',
    s: 'unos segundos',
    m: 'un minuto',
    mm: '%d minutos',
    h: 'una hora',
    hh: '%d horas',
    d: 'un día',
    dd: '%d días',
    M: 'un mes',
    MM: '%d meses',
    y: 'un año',
    yy: '%d años'
  },
  dayOfMonthOrdinalParse: /\d{1,2}º/,
  ordinal: '%dº',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Spanish(United State) [es-us]
//! author : bustta : https://github.com/bustta
/* jshint -W100 */

var monthsShortDot$1 = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var _monthsShort$1 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

var esus = {
  months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
  monthsShort: function monthsShort(m, format) {
    if (!m) {
      return monthsShortDot$1;
    } else if (/-MMM-/.test(format)) {
      return _monthsShort$1[m.month()];
    }
    return monthsShortDot$1[m.month()];
  },

  monthsParseExact: true,
  weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
  weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
  weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'MM/DD/YYYY',
    LL: 'MMMM [de] D [de] YYYY',
    LLL: 'MMMM [de] D [de] YYYY H:mm',
    LLLL: 'dddd, MMMM [de] D [de] YYYY H:mm'
  },
  calendar: {
    sameDay: function sameDay() {
      return '[hoy a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },
    nextDay: function nextDay() {
      return '[ma\xF1ana a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },
    nextWeek: function nextWeek() {
      return 'dddd [a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },
    lastDay: function lastDay() {
      return '[ayer a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },
    lastWeek: function lastWeek() {
      return '[el] dddd [pasado a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'en %s',
    past: 'hace %s',
    s: 'unos segundos',
    m: 'un minuto',
    mm: '%d minutos',
    h: 'una hora',
    hh: '%d horas',
    d: 'un día',
    dd: '%d días',
    M: 'un mes',
    MM: '%d meses',
    y: 'un año',
    yy: '%d años'
  },
  dayOfMonthOrdinalParse: /\d{1,2}º/,
  ordinal: '%dº',
  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Spanish [es]
//! author : Julio Napurí : https://github.com/julionc
/* jshint -W100 */

var monthsShortDot$2 = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var _monthsShort$2 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

var monthsParse$1 = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i];
var monthsRegex$1 = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

var es = {
  months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
  monthsShort: function monthsShort(m, format) {
    if (!m) {
      return monthsShortDot$2;
    } else if (/-MMM-/.test(format)) {
      return _monthsShort$2[m.month()];
    }
    return monthsShortDot$2[m.month()];
  },

  monthsRegex: monthsRegex$1,
  monthsShortRegex: monthsRegex$1,
  monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
  monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
  monthsParse: monthsParse$1,
  longMonthsParse: monthsParse$1,
  shortMonthsParse: monthsParse$1,
  weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
  weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
  weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D [de] MMMM [de] YYYY',
    LLL: 'D [de] MMMM [de] YYYY H:mm',
    LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
  },
  calendar: {
    sameDay: function sameDay() {
      return '[hoy a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },
    nextDay: function nextDay() {
      return '[ma\xF1ana a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },
    nextWeek: function nextWeek() {
      return 'dddd [a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },
    lastDay: function lastDay() {
      return '[ayer a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },
    lastWeek: function lastWeek() {
      return '[el] dddd [pasado a la' + (this.hours() !== 1 ? 's' : '') + '] LT';
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'en %s',
    past: 'hace %s',
    s: 'unos segundos',
    m: 'un minuto',
    mm: '%d minutos',
    h: 'una hora',
    hh: '%d horas',
    d: 'un día',
    dd: '%d días',
    M: 'un mes',
    MM: '%d meses',
    y: 'un año',
    yy: '%d años'
  },
  dayOfMonthOrdinalParse: /\d{1,2}º/,
  ordinal: '%dº',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Estonian [et]
//! author : Henry Kehlmann : https://github.com/madhenry
//! improvements : Illimar Tambek : https://github.com/ragulka
/* jshint -W100 */

function processRelativeTime$3(number, withoutSuffix, key, isFuture) {
  var format = {
    s: ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
    m: ['ühe minuti', 'üks minut'],
    mm: [number + ' minuti', number + ' minutit'],
    h: ['ühe tunni', 'tund aega', 'üks tund'],
    hh: [number + ' tunni', number + ' tundi'],
    d: ['ühe päeva', 'üks päev'],
    M: ['kuu aja', 'kuu aega', 'üks kuu'],
    MM: [number + ' kuu', number + ' kuud'],
    y: ['ühe aasta', 'aasta', 'üks aasta'],
    yy: [number + ' aasta', number + ' aastat']
  };
  if (withoutSuffix) {
    return format[key][2] ? format[key][2] : format[key][1];
  }
  return isFuture ? format[key][0] : format[key][1];
}

var et = {
  months: 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split('_'),
  monthsShort: 'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
  weekdays: 'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split('_'),
  weekdaysShort: 'P_E_T_K_N_R_L'.split('_'),
  weekdaysMin: 'P_E_T_K_N_R_L'.split('_'),
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY H:mm',
    LLLL: 'dddd, D. MMMM YYYY H:mm'
  },
  calendar: {
    sameDay: '[Täna,] LT',
    nextDay: '[Homme,] LT',
    nextWeek: '[Järgmine] dddd LT',
    lastDay: '[Eile,] LT',
    lastWeek: '[Eelmine] dddd LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s pärast',
    past: '%s tagasi',
    s: processRelativeTime$3,
    m: processRelativeTime$3,
    mm: processRelativeTime$3,
    h: processRelativeTime$3,
    hh: processRelativeTime$3,
    d: processRelativeTime$3,
    dd: '%d päeva',
    M: processRelativeTime$3,
    MM: processRelativeTime$3,
    y: processRelativeTime$3,
    yy: processRelativeTime$3
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Basque [eu]
//! author : Eneko Illarramendi : https://github.com/eillarra
/* jshint -W100 */

var eu = {
  months: 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split('_'),
  monthsShort: 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_'),
  monthsParseExact: true,
  weekdays: 'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'.split('_'),
  weekdaysShort: 'ig._al._ar._az._og._ol._lr.'.split('_'),
  weekdaysMin: 'ig_al_ar_az_og_ol_lr'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'YYYY[ko] MMMM[ren] D[a]',
    LLL: 'YYYY[ko] MMMM[ren] D[a] HH:mm',
    LLLL: 'dddd, YYYY[ko] MMMM[ren] D[a] HH:mm',
    l: 'YYYY-M-D',
    ll: 'YYYY[ko] MMM D[a]',
    lll: 'YYYY[ko] MMM D[a] HH:mm',
    llll: 'ddd, YYYY[ko] MMM D[a] HH:mm'
  },
  calendar: {
    sameDay: '[gaur] LT[etan]',
    nextDay: '[bihar] LT[etan]',
    nextWeek: 'dddd LT[etan]',
    lastDay: '[atzo] LT[etan]',
    lastWeek: '[aurreko] dddd LT[etan]',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s barru',
    past: 'duela %s',
    s: 'segundo batzuk',
    m: 'minutu bat',
    mm: '%d minutu',
    h: 'ordu bat',
    hh: '%d ordu',
    d: 'egun bat',
    dd: '%d egun',
    M: 'hilabete bat',
    MM: '%d hilabete',
    y: 'urte bat',
    yy: '%d urte'
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Persian [fa]
//! author : Ebrahim Byagowi : https://github.com/ebraminio
/* jshint -W100 */

var symbolMap$5 = {
  1: '۱',
  2: '۲',
  3: '۳',
  4: '۴',
  5: '۵',
  6: '۶',
  7: '۷',
  8: '۸',
  9: '۹',
  0: '۰'
};

var numberMap$4 = {
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
  '۰': '0'
};

var fa = {
  months: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
  monthsShort: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
  weekdays: '\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u062C\u0645\u0639\u0647_\u0634\u0646\u0628\u0647'.split('_'),
  weekdaysShort: '\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u062C\u0645\u0639\u0647_\u0634\u0646\u0628\u0647'.split('_'),
  weekdaysMin: 'ی_د_س_چ_پ_ج_ش'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  meridiemParse: /قبل از ظهر|بعد از ظهر/,
  isPM: function isPM(input) {
    return (/بعد از ظهر/.test(input)
    );
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 12) {
      return 'قبل از ظهر';
    }
    return 'بعد از ظهر';
  },

  calendar: {
    sameDay: '[امروز ساعت] LT',
    nextDay: '[فردا ساعت] LT',
    nextWeek: 'dddd [ساعت] LT',
    lastDay: '[دیروز ساعت] LT',
    lastWeek: 'dddd [پیش] [ساعت] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'در %s',
    past: '%s پیش',
    s: 'چند ثانیه',
    m: 'یک دقیقه',
    mm: '%d دقیقه',
    h: 'یک ساعت',
    hh: '%d ساعت',
    d: 'یک روز',
    dd: '%d روز',
    M: 'یک ماه',
    MM: '%d ماه',
    y: 'یک سال',
    yy: '%d سال'
  },
  preparse: function preparse(string) {
    return string.replace(/[۰-۹]/g, function (match) {
      return numberMap$4[match];
    }).replace(/،/g, ',');
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$5[match];
    }).replace(/,/g, '،');
  },

  dayOfMonthOrdinalParse: /\d{1,2}م/,
  ordinal: '%dم',
  week: {
    dow: 6, // Saturday is the first day of the week.
    doy: 12 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Finnish [fi]
//! author : Tarmo Aidantausta : https://github.com/bleadof
/* jshint -W100 */

var numbersPast = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' ');
var numbersFuture = ['nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden', numbersPast[7], numbersPast[8], numbersPast[9]];

function translate$2(number, withoutSuffix, key, isFuture) {
  var result = '';
  switch (key) {
    case 's':
      return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
    case 'm':
      return isFuture ? 'minuutin' : 'minuutti';
    case 'mm':
      result = isFuture ? 'minuutin' : 'minuuttia';
      break;
    case 'h':
      return isFuture ? 'tunnin' : 'tunti';
    case 'hh':
      result = isFuture ? 'tunnin' : 'tuntia';
      break;
    case 'd':
      return isFuture ? 'päivän' : 'päivä';
    case 'dd':
      result = isFuture ? 'päivän' : 'päivää';
      break;
    case 'M':
      return isFuture ? 'kuukauden' : 'kuukausi';
    case 'MM':
      result = isFuture ? 'kuukauden' : 'kuukautta';
      break;
    case 'y':
      return isFuture ? 'vuoden' : 'vuosi';
    case 'yy':
      result = isFuture ? 'vuoden' : 'vuotta';
      break;
  }
  result = verbalNumber(number, isFuture) + ' ' + result;
  return result;
}

function verbalNumber(number, isFuture) {
  return number < 10 ? isFuture ? numbersFuture[number] : numbersPast[number] : number;
}

var fi = {
  months: 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
  monthsShort: 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
  weekdays: 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
  weekdaysShort: 'su_ma_ti_ke_to_pe_la'.split('_'),
  weekdaysMin: 'su_ma_ti_ke_to_pe_la'.split('_'),
  longDateFormat: {
    LT: 'HH.mm',
    LTS: 'HH.mm.ss',
    L: 'DD.MM.YYYY',
    LL: 'Do MMMM[ta] YYYY',
    LLL: 'Do MMMM[ta] YYYY, [klo] HH.mm',
    LLLL: 'dddd, Do MMMM[ta] YYYY, [klo] HH.mm',
    l: 'D.M.YYYY',
    ll: 'Do MMM YYYY',
    lll: 'Do MMM YYYY, [klo] HH.mm',
    llll: 'ddd, Do MMM YYYY, [klo] HH.mm'
  },
  calendar: {
    sameDay: '[tänään] [klo] LT',
    nextDay: '[huomenna] [klo] LT',
    nextWeek: 'dddd [klo] LT',
    lastDay: '[eilen] [klo] LT',
    lastWeek: '[viime] dddd[na] [klo] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s päästä',
    past: '%s sitten',
    s: translate$2,
    m: translate$2,
    mm: translate$2,
    h: translate$2,
    hh: translate$2,
    d: translate$2,
    dd: translate$2,
    M: translate$2,
    MM: translate$2,
    y: translate$2,
    yy: translate$2
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Faroese [fo]
//! author : Ragnar Johannesen : https://github.com/ragnar123
/* jshint -W100 */

var fo = {
  months: 'januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
  monthsShort: 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
  weekdays: 'sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur'.split('_'),
  weekdaysShort: 'sun_mán_týs_mik_hós_frí_ley'.split('_'),
  weekdaysMin: 'su_má_tý_mi_hó_fr_le'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D. MMMM, YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Í dag kl.] LT',
    nextDay: '[Í morgin kl.] LT',
    nextWeek: 'dddd [kl.] LT',
    lastDay: '[Í gjár kl.] LT',
    lastWeek: '[síðstu] dddd [kl] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'um %s',
    past: '%s síðani',
    s: 'fá sekund',
    m: 'ein minutt',
    mm: '%d minuttir',
    h: 'ein tími',
    hh: '%d tímar',
    d: 'ein dagur',
    dd: '%d dagar',
    M: 'ein mánaði',
    MM: '%d mánaðir',
    y: 'eitt ár',
    yy: '%d ár'
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : French (Canada) [fr-ca]
//! author : Jonathan Abourbih : https://github.com/jonbca
/* jshint -W100 */

var frca = {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  monthsParseExact: true,
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Aujourd’hui à] LT',
    nextDay: '[Demain à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[Hier à] LT',
    lastWeek: 'dddd [dernier à] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'dans %s',
    past: 'il y a %s',
    s: 'quelques secondes',
    m: 'une minute',
    mm: '%d minutes',
    h: 'une heure',
    hh: '%d heures',
    d: 'un jour',
    dd: '%d jours',
    M: 'un mois',
    MM: '%d mois',
    y: 'un an',
    yy: '%d ans'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
  ordinal: function ordinal(number, period) {
    switch (period) {
      // Words with masculine grammatical gender: mois, trimestre, jour
      default:
      case 'M':
      case 'Q':
      case 'D':
      case 'DDD':
      case 'd':
        return number + (number === 1 ? 'er' : 'e');

      // Words with feminine grammatical gender: semaine
      case 'w':
      case 'W':
        return number + (number === 1 ? 're' : 'e');
    }
  }
};

//! now.js locale configuration
//! locale : French (Switzerland) [fr-ch]
//! author : Gaspard Bucher : https://github.com/gaspard
/* jshint -W100 */

var frch = {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  monthsParseExact: true,
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Aujourd’hui à] LT',
    nextDay: '[Demain à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[Hier à] LT',
    lastWeek: 'dddd [dernier à] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'dans %s',
    past: 'il y a %s',
    s: 'quelques secondes',
    m: 'une minute',
    mm: '%d minutes',
    h: 'une heure',
    hh: '%d heures',
    d: 'un jour',
    dd: '%d jours',
    M: 'un mois',
    MM: '%d mois',
    y: 'un an',
    yy: '%d ans'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
  ordinal: function ordinal(number, period) {
    switch (period) {
      // Words with masculine grammatical gender: mois, trimestre, jour
      default:
      case 'M':
      case 'Q':
      case 'D':
      case 'DDD':
      case 'd':
        return number + (number === 1 ? 'er' : 'e');

      // Words with feminine grammatical gender: semaine
      case 'w':
      case 'W':
        return number + (number === 1 ? 're' : 'e');
    }
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : French [fr]
//! author : John Fischer : https://github.com/jfroffice
/* jshint -W100 */

var fr = {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  monthsParseExact: true,
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Aujourd’hui à] LT',
    nextDay: '[Demain à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[Hier à] LT',
    lastWeek: 'dddd [dernier à] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'dans %s',
    past: 'il y a %s',
    s: 'quelques secondes',
    m: 'une minute',
    mm: '%d minutes',
    h: 'une heure',
    hh: '%d heures',
    d: 'un jour',
    dd: '%d jours',
    M: 'un mois',
    MM: '%d mois',
    y: 'un an',
    yy: '%d ans'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
  ordinal: function ordinal(number, period) {
    switch (period) {
      // TODO: Return 'e' when day of month > 1. Move this case inside
      // block for masculine words below.
      // See https://github.com/moment/moment/issues/3375
      case 'D':
        return number + (number === 1 ? 'er' : '');

      // Words with masculine grammatical gender: mois, trimestre, jour
      default:
      case 'M':
      case 'Q':
      case 'DDD':
      case 'd':
        return number + (number === 1 ? 'er' : 'e');

      // Words with feminine grammatical gender: semaine
      case 'w':
      case 'W':
        return number + (number === 1 ? 're' : 'e');
    }
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Frisian [fy]
//! author : Robin van der Vliet : https://github.com/robin0van0der0v
/* jshint -W100 */

var monthsShortWithDots = 'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_');
var monthsShortWithoutDots = 'jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_');

var fy = {
  months: 'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split('_'),
  monthsShort: function monthsShort(m, format) {
    if (!m) {
      return monthsShortWithDots;
    } else if (/-MMM-/.test(format)) {
      return monthsShortWithoutDots[m.month()];
    }
    return monthsShortWithDots[m.month()];
  },

  monthsParseExact: true,
  weekdays: 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split('_'),
  weekdaysShort: 'si._mo._ti._wo._to._fr._so.'.split('_'),
  weekdaysMin: 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD-MM-YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[hjoed om] LT',
    nextDay: '[moarn om] LT',
    nextWeek: 'dddd [om] LT',
    lastDay: '[juster om] LT',
    lastWeek: '[ôfrûne] dddd [om] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'oer %s',
    past: '%s lyn',
    s: 'in pear sekonden',
    m: 'ien minút',
    mm: '%d minuten',
    h: 'ien oere',
    hh: '%d oeren',
    d: 'ien dei',
    dd: '%d dagen',
    M: 'ien moanne',
    MM: '%d moannen',
    y: 'ien jier',
    yy: '%d jierren'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
  ordinal: function ordinal(number) {
    return number + (number === 1 || number === 8 || number >= 20 ? 'ste' : 'de');
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Scottish Gaelic [gd]
//! author : Jon Ashdown : https://github.com/jonashdown
/* jshint -W100 */

var months$4 = ['Am Faoilleach', 'An Gearran', 'Am Màrt', 'An Giblean', 'An Cèitean', 'An t-Ògmhios', 'An t-Iuchar', 'An Lùnastal', 'An t-Sultain', 'An Dàmhair', 'An t-Samhain', 'An Dùbhlachd'];

var monthsShort$1 = ['Faoi', 'Gear', 'Màrt', 'Gibl', 'Cèit', 'Ògmh', 'Iuch', 'Lùn', 'Sult', 'Dàmh', 'Samh', 'Dùbh'];

var weekdays$1 = ['Didòmhnaich', 'Diluain', 'Dimàirt', 'Diciadain', 'Diardaoin', 'Dihaoine', 'Disathairne'];

var weekdaysShort = ['Did', 'Dil', 'Dim', 'Dic', 'Dia', 'Dih', 'Dis'];

var weekdaysMin = ['Dò', 'Lu', 'Mà', 'Ci', 'Ar', 'Ha', 'Sa'];

var gd = {
  months: months$4,
  monthsShort: monthsShort$1,
  monthsParseExact: true,
  weekdays: weekdays$1,
  weekdaysShort: weekdaysShort,
  weekdaysMin: weekdaysMin,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[An-diugh aig] LT',
    nextDay: '[A-màireach aig] LT',
    nextWeek: 'dddd [aig] LT',
    lastDay: '[An-dè aig] LT',
    lastWeek: 'dddd [seo chaidh] [aig] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'ann an %s',
    past: 'bho chionn %s',
    s: 'beagan diogan',
    m: 'mionaid',
    mm: '%d mionaidean',
    h: 'uair',
    hh: '%d uairean',
    d: 'latha',
    dd: '%d latha',
    M: 'mìos',
    MM: '%d mìosan',
    y: 'bliadhna',
    yy: '%d bliadhna'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(d|na|mh)/,
  ordinal: function ordinal(number) {
    var output = number === 1 ? 'd' : number % 10 === 2 ? 'na' : 'mh';
    return number + output;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Galician [gl]
//! author : Juan G. Hurtado : https://github.com/juanghurtado
/* jshint -W100 */

var gl = {
  months: 'xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro'.split('_'),
  monthsShort: 'xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.'.split('_'),
  monthsParseExact: true,
  weekdays: 'domingo_luns_martes_mércores_xoves_venres_sábado'.split('_'),
  weekdaysShort: 'dom._lun._mar._mér._xov._ven._sáb.'.split('_'),
  weekdaysMin: 'do_lu_ma_mé_xo_ve_sá'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D [de] MMMM [de] YYYY',
    LLL: 'D [de] MMMM [de] YYYY H:mm',
    LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
  },
  calendar: {
    sameDay: function sameDay() {
      return '[hoxe ' + (this.hours() !== 1 ? 'ás' : 'á') + '] LT';
    },
    nextDay: function nextDay() {
      return '[ma\xF1\xE1 ' + (this.hours() !== 1 ? 'ás' : 'á') + '] LT';
    },
    nextWeek: function nextWeek() {
      return 'dddd [' + (this.hours() !== 1 ? 'ás' : 'a') + '] LT';
    },
    lastDay: function lastDay() {
      return '[onte ' + (this.hours() !== 1 ? 'á' : 'a') + '] LT';
    },
    lastWeek: function lastWeek() {
      return '[o] dddd [pasado ' + (this.hours() !== 1 ? 'ás' : 'a') + '] LT';
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: function future(str) {
      if (str.indexOf('un') === 0) {
        return 'n' + str;
      }
      return 'en ' + str;
    },

    past: 'hai %s',
    s: 'uns segundos',
    m: 'un minuto',
    mm: '%d minutos',
    h: 'unha hora',
    hh: '%d horas',
    d: 'un día',
    dd: '%d días',
    M: 'un mes',
    MM: '%d meses',
    y: 'un ano',
    yy: '%d anos'
  },
  dayOfMonthOrdinalParse: /\d{1,2}º/,
  ordinal: '%dº',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Konkani Latin script [gom-latn]
//! author : The Discoverer : https://github.com/WikiDiscoverer
/* jshint -W100 */

function processRelativeTime$4(number, withoutSuffix, key, isFuture) {
  var format = {
    s: ['thodde secondanim', 'thodde second'],
    m: ['eka mintan', 'ek minute'],
    mm: [number + ' mintanim', number + ' mintam'],
    h: ['eka horan', 'ek hor'],
    hh: [number + ' horanim', number + ' hor'],
    d: ['eka disan', 'ek dis'],
    dd: [number + ' disanim', number + ' dis'],
    M: ['eka mhoinean', 'ek mhoino'],
    MM: [number + ' mhoineanim', number + ' mhoine'],
    y: ['eka vorsan', 'ek voros'],
    yy: [number + ' vorsanim', number + ' vorsam']
  };
  return withoutSuffix ? format[key][0] : format[key][1];
}

var gomlatn = {
  months: 'Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr'.split('_'),
  monthsShort: 'Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.'.split('_'),
  monthsParseExact: true,
  weekdays: 'Aitar_Somar_Mongllar_Budvar_Brestar_Sukrar_Son\'var'.split('_'),
  weekdaysShort: 'Ait._Som._Mon._Bud._Bre._Suk._Son.'.split('_'),
  weekdaysMin: 'Ai_Sm_Mo_Bu_Br_Su_Sn'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'A h:mm [vazta]',
    LTS: 'A h:mm:ss [vazta]',
    L: 'DD-MM-YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY A h:mm [vazta]',
    LLLL: 'dddd, MMMM[achea] Do, YYYY, A h:mm [vazta]',
    llll: 'ddd, D MMM YYYY, A h:mm [vazta]'
  },
  calendar: {
    sameDay: '[Aiz] LT',
    nextDay: '[Faleam] LT',
    nextWeek: '[Ieta to] dddd[,] LT',
    lastDay: '[Kal] LT',
    lastWeek: '[Fatlo] dddd[,] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s',
    past: '%s adim',
    s: processRelativeTime$4,
    m: processRelativeTime$4,
    mm: processRelativeTime$4,
    h: processRelativeTime$4,
    hh: processRelativeTime$4,
    d: processRelativeTime$4,
    dd: processRelativeTime$4,
    M: processRelativeTime$4,
    MM: processRelativeTime$4,
    y: processRelativeTime$4,
    yy: processRelativeTime$4
  },
  dayOfMonthOrdinalParse: /\d{1,2}(er)/,
  ordinal: function ordinal(number, period) {
    switch (period) {
      // the ordinal 'er' only applies to day of the month
      case 'D':
        return number + 'er';
      default:
      case 'M':
      case 'Q':
      case 'DDD':
      case 'd':
      case 'w':
      case 'W':
        return number;
    }
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  },
  meridiemParse: /rati|sokalli|donparam|sanje/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'rati') {
      return hour < 4 ? hour : hour + 12;
    } else if (meridiem === 'sokalli') {
      return hour;
    } else if (meridiem === 'donparam') {
      return hour > 12 ? hour : hour + 12;
    } else if (meridiem === 'sanje') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'rati';
    } else if (hour < 12) {
      return 'sokalli';
    } else if (hour < 16) {
      return 'donparam';
    } else if (hour < 20) {
      return 'sanje';
    }
    return 'rati';
  }
};

//! now.js locale configuration
//! locale : Gujarati [gu]
//! author : Kaushik Thanki : https://github.com/Kaushik1987
/* jshint -W100 */

var symbolMap$6 = {
  1: '૧',
  2: '૨',
  3: '૩',
  4: '૪',
  5: '૫',
  6: '૬',
  7: '૭',
  8: '૮',
  9: '૯',
  0: '૦'
};

var numberMap$5 = {
  '૧': '1',
  '૨': '2',
  '૩': '3',
  '૪': '4',
  '૫': '5',
  '૬': '6',
  '૭': '7',
  '૮': '8',
  '૯': '9',
  '૦': '0'
};

var gu = {
  months: 'જાન્યુઆરી_ફેબ્રુઆરી_માર્ચ_એપ્રિલ_મે_જૂન_જુલાઈ_ઑગસ્ટ_સપ્ટેમ્બર_ઑક્ટ્બર_નવેમ્બર_ડિસેમ્બર'.split('_'),
  monthsShort: 'જાન્યુ._ફેબ્રુ._માર્ચ_એપ્રિ._મે_જૂન_જુલા._ઑગ._સપ્ટે._ઑક્ટ્._નવે._ડિસે.'.split('_'),
  monthsParseExact: true,
  weekdays: 'રવિવાર_સોમવાર_મંગળવાર_બુધ્વાર_ગુરુવાર_શુક્રવાર_શનિવાર'.split('_'),
  weekdaysShort: 'રવિ_સોમ_મંગળ_બુધ્_ગુરુ_શુક્ર_શનિ'.split('_'),
  weekdaysMin: 'ર_સો_મં_બુ_ગુ_શુ_શ'.split('_'),
  longDateFormat: {
    LT: 'A h:mm વાગ્યે',
    LTS: 'A h:mm:ss વાગ્યે',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY, A h:mm વાગ્યે',
    LLLL: 'dddd, D MMMM YYYY, A h:mm વાગ્યે'
  },
  calendar: {
    sameDay: '[આજ] LT',
    nextDay: '[કાલે] LT',
    nextWeek: 'dddd, LT',
    lastDay: '[ગઇકાલે] LT',
    lastWeek: '[પાછલા] dddd, LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s મા',
    past: '%s પેહલા',
    s: 'અમુક પળો',
    m: 'એક મિનિટ',
    mm: '%d મિનિટ',
    h: 'એક કલાક',
    hh: '%d કલાક',
    d: 'એક દિવસ',
    dd: '%d દિવસ',
    M: 'એક મહિનો',
    MM: '%d મહિનો',
    y: 'એક વર્ષ',
    yy: '%d વર્ષ'
  },
  preparse: function preparse(string) {
    return string.replace(/[૧૨૩૪૫૬૭૮૯૦]/g, function (match) {
      return numberMap$5[match];
    });
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$6[match];
    });
  },

  // Gujarati notation for meridiems are quite fuzzy in practice. While there exists
  // a rigid notion of a 'Pahar' it is not used as rigidly in modern Gujarati.
  meridiemParse: /રાત|બપોર|સવાર|સાંજ/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'રાત') {
      return hour < 4 ? hour : hour + 12;
    } else if (meridiem === 'સવાર') {
      return hour;
    } else if (meridiem === 'બપોર') {
      return hour >= 10 ? hour : hour + 12;
    } else if (meridiem === 'સાંજ') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'રાત';
    } else if (hour < 10) {
      return 'સવાર';
    } else if (hour < 17) {
      return 'બપોર';
    } else if (hour < 20) {
      return 'સાંજ';
    }
    return 'રાત';
  },

  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Hebrew [he]
//! author : Tomer Cohen : https://github.com/tomer
//! author : Moshe Simantov : https://github.com/DevelopmentIL
//! author : Tal Ater : https://github.com/TalAter
/* jshint -W100 */

var he = {
  months: 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
  monthsShort: 'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
  weekdays: 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
  weekdaysShort: 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
  weekdaysMin: 'א_ב_ג_ד_ה_ו_ש'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D [ב]MMMM YYYY',
    LLL: 'D [ב]MMMM YYYY HH:mm',
    LLLL: 'dddd, D [ב]MMMM YYYY HH:mm',
    l: 'D/M/YYYY',
    ll: 'D MMM YYYY',
    lll: 'D MMM YYYY HH:mm',
    llll: 'ddd, D MMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[היום ב־]LT',
    nextDay: '[מחר ב־]LT',
    nextWeek: 'dddd [בשעה] LT',
    lastDay: '[אתמול ב־]LT',
    lastWeek: '[ביום] dddd [האחרון בשעה] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'בעוד %s',
    past: 'לפני %s',
    s: 'מספר שניות',
    m: 'דקה',
    mm: '%d דקות',
    h: 'שעה',
    hh: function hh(number) {
      if (number === 2) {
        return 'שעתיים';
      }
      return number + ' \u05E9\u05E2\u05D5\u05EA';
    },

    d: 'יום',
    dd: function dd(number) {
      if (number === 2) {
        return 'יומיים';
      }
      return number + ' \u05D9\u05DE\u05D9\u05DD';
    },

    M: 'חודש',
    MM: function MM(number) {
      if (number === 2) {
        return 'חודשיים';
      }
      return number + ' \u05D7\u05D5\u05D3\u05E9\u05D9\u05DD';
    },

    y: 'שנה',
    yy: function yy(number) {
      if (number === 2) {
        return 'שנתיים';
      } else if (number % 10 === 0 && number !== 10) {
        return number + ' \u05E9\u05E0\u05D4';
      }
      return number + ' \u05E9\u05E0\u05D9\u05DD';
    }
  },
  meridiemParse: /אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,
  isPM: function isPM(input) {
    return (/^(אחה"צ|אחרי הצהריים|בערב)$/.test(input)
    );
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 5) {
      return 'לפנות בוקר';
    } else if (hour < 10) {
      return 'בבוקר';
    } else if (hour < 12) {
      return isLower ? 'לפנה"צ' : 'לפני הצהריים';
    } else if (hour < 18) {
      return isLower ? 'אחה"צ' : 'אחרי הצהריים';
    }
    return 'בערב';
  }
};

//! now.js locale configuration
//! locale : Hindi [hi]
//! author : Mayank Singhal : https://github.com/mayanksinghal
/* jshint -W100 */

var symbolMap$7 = {
  1: '१',
  2: '२',
  3: '३',
  4: '४',
  5: '५',
  6: '६',
  7: '७',
  8: '८',
  9: '९',
  0: '०'
};

var numberMap$6 = {
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
  '०': '0'
};

var hi = {
  months: 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split('_'),
  monthsShort: 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split('_'),
  monthsParseExact: true,
  weekdays: 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
  weekdaysShort: 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split('_'),
  weekdaysMin: 'र_सो_मं_बु_गु_शु_श'.split('_'),
  longDateFormat: {
    LT: 'A h:mm बजे',
    LTS: 'A h:mm:ss बजे',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY, A h:mm बजे',
    LLLL: 'dddd, D MMMM YYYY, A h:mm बजे'
  },
  calendar: {
    sameDay: '[आज] LT',
    nextDay: '[कल] LT',
    nextWeek: 'dddd, LT',
    lastDay: '[कल] LT',
    lastWeek: '[पिछले] dddd, LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s में',
    past: '%s पहले',
    s: 'कुछ ही क्षण',
    m: 'एक मिनट',
    mm: '%d मिनट',
    h: 'एक घंटा',
    hh: '%d घंटे',
    d: 'एक दिन',
    dd: '%d दिन',
    M: 'एक महीने',
    MM: '%d महीने',
    y: 'एक वर्ष',
    yy: '%d वर्ष'
  },
  preparse: function preparse(string) {
    return string.replace(/[१२३४५६७८९०]/g, function (match) {
      return numberMap$6[match];
    });
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$7[match];
    });
  },

  // Hindi notation for meridiems are quite fuzzy in practice. While there exists
  // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
  meridiemParse: /रात|सुबह|दोपहर|शाम/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'रात') {
      return hour < 4 ? hour : hour + 12;
    } else if (meridiem === 'सुबह') {
      return hour;
    } else if (meridiem === 'दोपहर') {
      return hour >= 10 ? hour : hour + 12;
    } else if (meridiem === 'शाम') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'रात';
    } else if (hour < 10) {
      return 'सुबह';
    } else if (hour < 17) {
      return 'दोपहर';
    } else if (hour < 20) {
      return 'शाम';
    }
    return 'रात';
  },

  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Croatian [hr]
//! author : Bojan Marković : https://github.com/bmarkovic
/* jshint -W100 */

function translate$3(number, withoutSuffix, key) {
  var result = number + ' ';
  switch (key) {
    case 'm':
      return withoutSuffix ? 'jedna minuta' : 'jedne minute';
    case 'mm':
      if (number === 1) {
        result += 'minuta';
      } else if (number === 2 || number === 3 || number === 4) {
        result += 'minute';
      } else {
        result += 'minuta';
      }
      return result;
    case 'h':
      return withoutSuffix ? 'jedan sat' : 'jednog sata';
    case 'hh':
      if (number === 1) {
        result += 'sat';
      } else if (number === 2 || number === 3 || number === 4) {
        result += 'sata';
      } else {
        result += 'sati';
      }
      return result;
    case 'dd':
      if (number === 1) {
        result += 'dan';
      } else {
        result += 'dana';
      }
      return result;
    case 'MM':
      if (number === 1) {
        result += 'mjesec';
      } else if (number === 2 || number === 3 || number === 4) {
        result += 'mjeseca';
      } else {
        result += 'mjeseci';
      }
      return result;
    case 'yy':
      if (number === 1) {
        result += 'godina';
      } else if (number === 2 || number === 3 || number === 4) {
        result += 'godine';
      } else {
        result += 'godina';
      }
      return result;
  }
}

var hr = {
  months: {
    format: 'siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca'.split('_'),
    standalone: 'siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split('_')
  },
  monthsShort: 'sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
  monthsParseExact: true,
  weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
  weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
  weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY H:mm',
    LLLL: 'dddd, D. MMMM YYYY H:mm'
  },
  calendar: {
    sameDay: '[danas u] LT',
    nextDay: '[sutra u] LT',
    nextWeek: function nextWeek() {
      switch (this.day()) {
        case 0:
          return '[u] [nedjelju] [u] LT';
        case 3:
          return '[u] [srijedu] [u] LT';
        case 6:
          return '[u] [subotu] [u] LT';
        case 1:
        case 2:
        case 4:
        case 5:
          return '[u] dddd [u] LT';
      }
    },

    lastDay: '[jučer u] LT',
    lastWeek: function lastWeek() {
      switch (this.day()) {
        case 0:
        case 3:
          return '[prošlu] dddd [u] LT';
        case 6:
          return '[prošle] [subote] [u] LT';
        case 1:
        case 2:
        case 4:
        case 5:
          return '[prošli] dddd [u] LT';
      }
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'za %s',
    past: 'prije %s',
    s: 'par sekundi',
    m: translate$3,
    mm: translate$3,
    h: translate$3,
    hh: translate$3,
    d: 'dan',
    dd: translate$3,
    M: 'mjesec',
    MM: translate$3,
    y: 'godinu',
    yy: translate$3
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Hungarian [hu]
//! author : Adam Brunner : https://github.com/adambrunner
/* jshint -W100 */

var weekEndings = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');

function translate$4(number, withoutSuffix, key, isFuture) {
  var num = number;
  switch (key) {
    case 's':
      return isFuture || withoutSuffix ? 'néhány másodperc' : 'néhány másodperce';
    case 'm':
      return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
    case 'mm':
      return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
    case 'h':
      return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
    case 'hh':
      return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
    case 'd':
      return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
    case 'dd':
      return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
    case 'M':
      return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
    case 'MM':
      return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
    case 'y':
      return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
    case 'yy':
      return num + (isFuture || withoutSuffix ? ' év' : ' éve');
  }
  return '';
}

function week(isFuture) {
  return (isFuture ? '' : '[múlt] ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
}

var hu = {
  months: 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split('_'),
  monthsShort: 'jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec'.split('_'),
  weekdays: 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
  weekdaysShort: 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
  weekdaysMin: 'v_h_k_sze_cs_p_szo'.split('_'),
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'YYYY.MM.DD.',
    LL: 'YYYY. MMMM D.',
    LLL: 'YYYY. MMMM D. H:mm',
    LLLL: 'YYYY. MMMM D., dddd H:mm'
  },
  meridiemParse: /de|du/i,
  isPM: function isPM(input) {
    return input.charAt(1).toLowerCase() === 'u';
  },
  meridiem: function meridiem(hours, minutes, isLower) {
    if (hours < 12) {
      return isLower === true ? 'de' : 'DE';
    }
    return isLower === true ? 'du' : 'DU';
  },

  calendar: {
    sameDay: '[ma] LT[-kor]',
    nextDay: '[holnap] LT[-kor]',
    nextWeek: function nextWeek() {
      return week.call(this, true);
    },

    lastDay: '[tegnap] LT[-kor]',
    lastWeek: function lastWeek() {
      return week.call(this, false);
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: '%s múlva',
    past: '%s',
    s: translate$4,
    m: translate$4,
    mm: translate$4,
    h: translate$4,
    hh: translate$4,
    d: translate$4,
    dd: translate$4,
    M: translate$4,
    MM: translate$4,
    y: translate$4,
    yy: translate$4
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Armenian [hy-am]
//! author : Armendarabyan : https://github.com/armendarabyan
/* jshint -W100 */

var hyam = {
  months: {
    format: 'հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի'.split('_'),
    standalone: 'հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր'.split('_')
  },
  monthsShort: 'հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ'.split('_'),
  weekdays: 'կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ'.split('_'),
  weekdaysShort: 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
  weekdaysMin: 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY թ.',
    LLL: 'D MMMM YYYY թ., HH:mm',
    LLLL: 'dddd, D MMMM YYYY թ., HH:mm'
  },
  calendar: {
    sameDay: '[այսօր] LT',
    nextDay: '[վաղը] LT',
    lastDay: '[երեկ] LT',
    nextWeek: function nextWeek() {
      return 'dddd [օրը ժամը] LT';
    },
    lastWeek: function lastWeek() {
      return '[անցած] dddd [օրը ժամը] LT';
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: '%s հետո',
    past: '%s առաջ',
    s: 'մի քանի վայրկյան',
    m: 'րոպե',
    mm: '%d րոպե',
    h: 'ժամ',
    hh: '%d ժամ',
    d: 'օր',
    dd: '%d օր',
    M: 'ամիս',
    MM: '%d ամիս',
    y: 'տարի',
    yy: '%d տարի'
  },
  meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
  isPM: function isPM(input) {
    return (/^(ցերեկվա|երեկոյան)$/.test(input)
    );
  },
  meridiem: function meridiem(hour) {
    if (hour < 4) {
      return 'գիշերվա';
    } else if (hour < 12) {
      return 'առավոտվա';
    } else if (hour < 17) {
      return 'ցերեկվա';
    }
    return 'երեկոյան';
  },

  dayOfMonthOrdinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
  ordinal: function ordinal(number, period) {
    switch (period) {
      case 'DDD':
      case 'w':
      case 'W':
      case 'DDDo':
        if (number === 1) {
          return number + '-\u056B\u0576';
        }
        return number + '-\u0580\u0564';
      default:
        return number;
    }
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Indonesian [id]
//! author : Mohammad Satrio Utomo : https://github.com/tyok
//! reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan
/* jshint -W100 */

var id = {
  months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_'),
  monthsShort: 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des'.split('_'),
  weekdays: 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
  weekdaysShort: 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
  weekdaysMin: 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
  longDateFormat: {
    LT: 'HH.mm',
    LTS: 'HH.mm.ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY [pukul] HH.mm',
    LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm'
  },
  meridiemParse: /pagi|siang|sore|malam/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'pagi') {
      return hour;
    } else if (meridiem === 'siang') {
      return hour >= 11 ? hour : hour + 12;
    } else if (meridiem === 'sore' || meridiem === 'malam') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hours, minutes, isLower) {
    if (hours < 11) {
      return 'pagi';
    } else if (hours < 15) {
      return 'siang';
    } else if (hours < 19) {
      return 'sore';
    }
    return 'malam';
  },

  calendar: {
    sameDay: '[Hari ini pukul] LT',
    nextDay: '[Besok pukul] LT',
    nextWeek: 'dddd [pukul] LT',
    lastDay: '[Kemarin pukul] LT',
    lastWeek: 'dddd [lalu pukul] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'dalam %s',
    past: '%s yang lalu',
    s: 'beberapa detik',
    m: 'semenit',
    mm: '%d menit',
    h: 'sejam',
    hh: '%d jam',
    d: 'sehari',
    dd: '%d hari',
    M: 'sebulan',
    MM: '%d bulan',
    y: 'setahun',
    yy: '%d tahun'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Icelandic [is]
//! author : Hinrik Örn Sigurðsson : https://github.com/hinrik
/* jshint -W100 */

function plural$2(n) {
  if (n % 100 === 11) {
    return true;
  } else if (n % 10 === 1) {
    return false;
  }
  return true;
}

function translate$5(number, withoutSuffix, key, isFuture) {
  var result = number + ' ';
  switch (key) {
    case 's':
      return withoutSuffix || isFuture ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
    case 'm':
      return withoutSuffix ? 'mínúta' : 'mínútu';
    case 'mm':
      if (plural$2(number)) {
        return result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum');
      } else if (withoutSuffix) {
        return result + 'm\xEDn\xFAta';
      }
      return result + 'm\xEDn\xFAtu';
    case 'hh':
      if (plural$2(number)) {
        return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
      }
      return result + 'klukkustund';
    case 'd':
      if (withoutSuffix) {
        return 'dagur';
      }
      return isFuture ? 'dag' : 'degi';
    case 'dd':
      if (plural$2(number)) {
        if (withoutSuffix) {
          return result + 'dagar';
        }
        return result + (isFuture ? 'daga' : 'dögum');
      } else if (withoutSuffix) {
        return result + 'dagur';
      }
      return result + (isFuture ? 'dag' : 'degi');
    case 'M':
      if (withoutSuffix) {
        return 'mánuður';
      }
      return isFuture ? 'mánuð' : 'mánuði';
    case 'MM':
      if (plural$2(number)) {
        if (withoutSuffix) {
          return result + 'm\xE1nu\xF0ir';
        }
        return result + (isFuture ? 'mánuði' : 'mánuðum');
      } else if (withoutSuffix) {
        return result + 'm\xE1nu\xF0ur';
      }
      return result + (isFuture ? 'mánuð' : 'mánuði');
    case 'y':
      return withoutSuffix || isFuture ? 'ár' : 'ári';
    case 'yy':
      if (plural$2(number)) {
        return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
      }
      return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
  }
}

var is = {
  months: 'janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember'.split('_'),
  monthsShort: 'jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des'.split('_'),
  weekdays: 'sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur'.split('_'),
  weekdaysShort: 'sun_mán_þri_mið_fim_fös_lau'.split('_'),
  weekdaysMin: 'Su_Má_Þr_Mi_Fi_Fö_La'.split('_'),
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY [kl.] H:mm',
    LLLL: 'dddd, D. MMMM YYYY [kl.] H:mm'
  },
  calendar: {
    sameDay: '[í dag kl.] LT',
    nextDay: '[á morgun kl.] LT',
    nextWeek: 'dddd [kl.] LT',
    lastDay: '[í gær kl.] LT',
    lastWeek: '[síðasta] dddd [kl.] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'eftir %s',
    past: 'fyrir %s síðan',
    s: translate$5,
    m: translate$5,
    mm: translate$5,
    h: 'klukkustund',
    hh: translate$5,
    d: translate$5,
    dd: translate$5,
    M: translate$5,
    MM: translate$5,
    y: translate$5,
    yy: translate$5
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Italian [it]
//! author : Lorenzo : https://github.com/aliem
//! author: Mattia Larentis: https://github.com/nostalgiaz
/* jshint -W100 */

var it = {
  months: 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
  monthsShort: 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
  weekdays: 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split('_'),
  weekdaysShort: 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
  weekdaysMin: 'do_lu_ma_me_gi_ve_sa'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Oggi alle] LT',
    nextDay: '[Domani alle] LT',
    nextWeek: 'dddd [alle] LT',
    lastDay: '[Ieri alle] LT',
    lastWeek: function lastWeek() {
      switch (this.day()) {
        case 0:
          return '[la scorsa] dddd [alle] LT';
        default:
          return '[lo scorso] dddd [alle] LT';
      }
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: function future(s) {
      return (/^[0-9].+$/.test(s) ? 'tra' : 'in') + ' ' + s;
    },

    past: '%s fa',
    s: 'alcuni secondi',
    m: 'un minuto',
    mm: '%d minuti',
    h: 'un\'ora',
    hh: '%d ore',
    d: 'un giorno',
    dd: '%d giorni',
    M: 'un mese',
    MM: '%d mesi',
    y: 'un anno',
    yy: '%d anni'
  },
  dayOfMonthOrdinalParse: /\d{1,2}º/,
  ordinal: '%dº',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Japanese [ja]
//! author : LI Long : https://github.com/baryon
/* jshint -W100 */

var ja = {
  months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
  weekdaysShort: '日_月_火_水_木_金_土'.split('_'),
  weekdaysMin: '日_月_火_水_木_金_土'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY/MM/DD',
    LL: 'YYYY年M月D日',
    LLL: 'YYYY年M月D日 HH:mm',
    LLLL: 'YYYY年M月D日 HH:mm dddd',
    l: 'YYYY/MM/DD',
    ll: 'YYYY年M月D日',
    lll: 'YYYY年M月D日 HH:mm',
    llll: 'YYYY年M月D日 HH:mm dddd'
  },
  meridiemParse: /午前|午後/i,
  isPM: function isPM(input) {
    return input === '午後';
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 12) {
      return '午前';
    }
    return '午後';
  },

  calendar: {
    sameDay: '[今日] LT',
    nextDay: '[明日] LT',
    nextWeek: '[来週]dddd LT',
    lastDay: '[昨日] LT',
    lastWeek: '[前週]dddd LT',
    sameElse: 'L'
  },
  dayOfMonthOrdinalParse: /\d{1,2}日/,
  ordinal: function ordinal(number, period) {
    switch (period) {
      case 'd':
      case 'D':
      case 'DDD':
        return number + '\u65E5';
      default:
        return number;
    }
  },

  relativeTime: {
    future: '%s後',
    past: '%s前',
    s: '数秒',
    m: '1分',
    mm: '%d分',
    h: '1時間',
    hh: '%d時間',
    d: '1日',
    dd: '%d日',
    M: '1ヶ月',
    MM: '%dヶ月',
    y: '1年',
    yy: '%d年'
  }
};

//! now.js locale configuration
//! locale : Javanese [jv]
//! author : Rony Lantip : https://github.com/lantip
//! reference: http://jv.wikipedia.org/wiki/Basa_Jawa
/* jshint -W100 */

var jv = {
  months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember'.split('_'),
  monthsShort: 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des'.split('_'),
  weekdays: 'Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu'.split('_'),
  weekdaysShort: 'Min_Sen_Sel_Reb_Kem_Jem_Sep'.split('_'),
  weekdaysMin: 'Mg_Sn_Sl_Rb_Km_Jm_Sp'.split('_'),
  longDateFormat: {
    LT: 'HH.mm',
    LTS: 'HH.mm.ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY [pukul] HH.mm',
    LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm'
  },
  meridiemParse: /enjing|siyang|sonten|ndalu/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'enjing') {
      return hour;
    } else if (meridiem === 'siyang') {
      return hour >= 11 ? hour : hour + 12;
    } else if (meridiem === 'sonten' || meridiem === 'ndalu') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hours, minutes, isLower) {
    if (hours < 11) {
      return 'enjing';
    } else if (hours < 15) {
      return 'siyang';
    } else if (hours < 19) {
      return 'sonten';
    }
    return 'ndalu';
  },

  calendar: {
    sameDay: '[Dinten puniko pukul] LT',
    nextDay: '[Mbenjang pukul] LT',
    nextWeek: 'dddd [pukul] LT',
    lastDay: '[Kala wingi pukul] LT',
    lastWeek: 'dddd [kepengker pukul] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'wonten ing %s',
    past: '%s ingkang kepengker',
    s: 'sawetawis detik',
    m: 'setunggal menit',
    mm: '%d menit',
    h: 'setunggal jam',
    hh: '%d jam',
    d: 'sedinten',
    dd: '%d dinten',
    M: 'sewulan',
    MM: '%d wulan',
    y: 'setaun',
    yy: '%d taun'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Georgian [ka]
//! author : Irakli Janiashvili : https://github.com/irakli-janiashvili
/* jshint -W100 */

var ka = {
  months: {
    standalone: 'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split('_'),
    format: 'იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს'.split('_')
  },
  monthsShort: 'იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ'.split('_'),
  weekdays: {
    standalone: 'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split('_'),
    format: 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split('_'),
    isFormat: /(წინა|შემდეგ)/
  },
  weekdaysShort: 'კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ'.split('_'),
  weekdaysMin: 'კვ_ორ_სა_ოთ_ხუ_პა_შა'.split('_'),
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY h:mm A',
    LLLL: 'dddd, D MMMM YYYY h:mm A'
  },
  calendar: {
    sameDay: '[დღეს] LT[-ზე]',
    nextDay: '[ხვალ] LT[-ზე]',
    lastDay: '[გუშინ] LT[-ზე]',
    nextWeek: '[შემდეგ] dddd LT[-ზე]',
    lastWeek: '[წინა] dddd LT-ზე',
    sameElse: 'L'
  },
  relativeTime: {
    future: function future(s) {
      return (/(წამი|წუთი|საათი|წელი)/.test(s) ? s.replace(/ი$/, 'ში') : s + '\u10E8\u10D8'
      );
    },
    past: function past(s) {
      if (/(წამი|წუთი|საათი|დღე|თვე)/.test(s)) {
        return s.replace(/(ი|ე)$/, 'ის უკან');
      }
      if (/წელი/.test(s)) {
        return s.replace(/წელი$/, 'წლის უკან');
      }
    },

    s: 'რამდენიმე წამი',
    m: 'წუთი',
    mm: '%d წუთი',
    h: 'საათი',
    hh: '%d საათი',
    d: 'დღე',
    dd: '%d დღე',
    M: 'თვე',
    MM: '%d თვე',
    y: 'წელი',
    yy: '%d წელი'
  },
  dayOfMonthOrdinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
  ordinal: function ordinal(number) {
    if (number === 0) {
      return number;
    }
    if (number === 1) {
      return number + '-\u10DA\u10D8';
    }
    if (number < 20 || number <= 100 && number % 20 === 0 || number % 100 === 0) {
      return '\u10DB\u10D4-' + number;
    }
    return number + '-\u10D4';
  },

  week: {
    dow: 1,
    doy: 7
  }
};

//! now.js locale configuration
//! locale : Kazakh [kk]
//! authors : Nurlan Rakhimzhanov : https://github.com/nurlan
/* jshint -W100 */

var suffixes$1 = {
  0: '-ші',
  1: '-ші',
  2: '-ші',
  3: '-ші',
  4: '-ші',
  5: '-ші',
  6: '-шы',
  7: '-ші',
  8: '-ші',
  9: '-шы',
  10: '-шы',
  20: '-шы',
  30: '-шы',
  40: '-шы',
  50: '-ші',
  60: '-шы',
  70: '-ші',
  80: '-ші',
  90: '-шы',
  100: '-ші'
};

var kk = {
  months: 'қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан'.split('_'),
  monthsShort: 'қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел'.split('_'),
  weekdays: 'жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі'.split('_'),
  weekdaysShort: 'жек_дүй_сей_сәр_бей_жұм_сен'.split('_'),
  weekdaysMin: 'жк_дй_сй_ср_бй_жм_сн'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Бүгін сағат] LT',
    nextDay: '[Ертең сағат] LT',
    nextWeek: 'dddd [сағат] LT',
    lastDay: '[Кеше сағат] LT',
    lastWeek: '[Өткен аптаның] dddd [сағат] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s ішінде',
    past: '%s бұрын',
    s: 'бірнеше секунд',
    m: 'бір минут',
    mm: '%d минут',
    h: 'бір сағат',
    hh: '%d сағат',
    d: 'бір күн',
    dd: '%d күн',
    M: 'бір ай',
    MM: '%d ай',
    y: 'бір жыл',
    yy: '%d жыл'
  },
  dayOfMonthOrdinalParse: /\d{1,2}-(ші|шы)/,
  ordinal: function ordinal(number) {
    var a = number % 10;
    var b = number >= 100 ? 100 : null;
    return number + (suffixes$1[number] || suffixes$1[a] || suffixes$1[b]);
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Cambodian [km]
//! author : Kruy Vanna : https://github.com/kruyvanna
/* jshint -W100 */

var km = {
  months: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
  monthsShort: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
  weekdays: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
  weekdaysShort: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
  weekdaysMin: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[ថ្ងៃនេះ ម៉ោង] LT',
    nextDay: '[ស្អែក ម៉ោង] LT',
    nextWeek: 'dddd [ម៉ោង] LT',
    lastDay: '[ម្សិលមិញ ម៉ោង] LT',
    lastWeek: 'dddd [សប្តាហ៍មុន] [ម៉ោង] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%sទៀត',
    past: '%sមុន',
    s: 'ប៉ុន្មានវិនាទី',
    m: 'មួយនាទី',
    mm: '%d នាទី',
    h: 'មួយម៉ោង',
    hh: '%d ម៉ោង',
    d: 'មួយថ្ងៃ',
    dd: '%d ថ្ងៃ',
    M: 'មួយខែ',
    MM: '%d ខែ',
    y: 'មួយឆ្នាំ',
    yy: '%d ឆ្នាំ'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Kannada [kn]
//! author : Rajeev Naik : https://github.com/rajeevnaikte
/* jshint -W100 */

var symbolMap$8 = {
  1: '೧',
  2: '೨',
  3: '೩',
  4: '೪',
  5: '೫',
  6: '೬',
  7: '೭',
  8: '೮',
  9: '೯',
  0: '೦'
};

var numberMap$7 = {
  '೧': '1',
  '೨': '2',
  '೩': '3',
  '೪': '4',
  '೫': '5',
  '೬': '6',
  '೭': '7',
  '೮': '8',
  '೯': '9',
  '೦': '0'
};

var kn = {
  months: 'ಜನವರಿ_ಫೆಬ್ರವರಿ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬರ್_ಅಕ್ಟೋಬರ್_ನವೆಂಬರ್_ಡಿಸೆಂಬರ್'.split('_'),
  monthsShort: 'ಜನ_ಫೆಬ್ರ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬ_ಅಕ್ಟೋಬ_ನವೆಂಬ_ಡಿಸೆಂಬ'.split('_'),
  monthsParseExact: true,
  weekdays: 'ಭಾನುವಾರ_ಸೋಮವಾರ_ಮಂಗಳವಾರ_ಬುಧವಾರ_ಗುರುವಾರ_ಶುಕ್ರವಾರ_ಶನಿವಾರ'.split('_'),
  weekdaysShort: 'ಭಾನು_ಸೋಮ_ಮಂಗಳ_ಬುಧ_ಗುರು_ಶುಕ್ರ_ಶನಿ'.split('_'),
  weekdaysMin: 'ಭಾ_ಸೋ_ಮಂ_ಬು_ಗು_ಶು_ಶ'.split('_'),
  longDateFormat: {
    LT: 'A h:mm',
    LTS: 'A h:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY, A h:mm',
    LLLL: 'dddd, D MMMM YYYY, A h:mm'
  },
  calendar: {
    sameDay: '[ಇಂದು] LT',
    nextDay: '[ನಾಳೆ] LT',
    nextWeek: 'dddd, LT',
    lastDay: '[ನಿನ್ನೆ] LT',
    lastWeek: '[ಕೊನೆಯ] dddd, LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s ನಂತರ',
    past: '%s ಹಿಂದೆ',
    s: 'ಕೆಲವು ಕ್ಷಣಗಳು',
    m: 'ಒಂದು ನಿಮಿಷ',
    mm: '%d ನಿಮಿಷ',
    h: 'ಒಂದು ಗಂಟೆ',
    hh: '%d ಗಂಟೆ',
    d: 'ಒಂದು ದಿನ',
    dd: '%d ದಿನ',
    M: 'ಒಂದು ತಿಂಗಳು',
    MM: '%d ತಿಂಗಳು',
    y: 'ಒಂದು ವರ್ಷ',
    yy: '%d ವರ್ಷ'
  },
  preparse: function preparse(string) {
    return string.replace(/[೧೨೩೪೫೬೭೮೯೦]/g, function (match) {
      return numberMap$7[match];
    });
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$8[match];
    });
  },

  meridiemParse: /ರಾತ್ರಿ|ಬೆಳಿಗ್ಗೆ|ಮಧ್ಯಾಹ್ನ|ಸಂಜೆ/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'ರಾತ್ರಿ') {
      return hour < 4 ? hour : hour + 12;
    } else if (meridiem === 'ಬೆಳಿಗ್ಗೆ') {
      return hour;
    } else if (meridiem === 'ಮಧ್ಯಾಹ್ನ') {
      return hour >= 10 ? hour : hour + 12;
    } else if (meridiem === 'ಸಂಜೆ') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'ರಾತ್ರಿ';
    } else if (hour < 10) {
      return 'ಬೆಳಿಗ್ಗೆ';
    } else if (hour < 17) {
      return 'ಮಧ್ಯಾಹ್ನ';
    } else if (hour < 20) {
      return 'ಸಂಜೆ';
    }
    return 'ರಾತ್ರಿ';
  },

  dayOfMonthOrdinalParse: /\d{1,2}(ನೇ)/,
  ordinal: function ordinal(number) {
    return number + '\u0CA8\u0CC6\u0CD5';
  },

  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Korean [ko]
//! author : Kyungwook, Park : https://github.com/kyungw00k
//! author : Jeeeyul Lee <jeeeyul@gmail.com>
/* jshint -W100 */

var ko = {
  months: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
  monthsShort: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
  weekdays: '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
  weekdaysShort: '일_월_화_수_목_금_토'.split('_'),
  weekdaysMin: '일_월_화_수_목_금_토'.split('_'),
  longDateFormat: {
    LT: 'A h:mm',
    LTS: 'A h:mm:ss',
    L: 'YYYY.MM.DD',
    LL: 'YYYY년 MMMM D일',
    LLL: 'YYYY년 MMMM D일 A h:mm',
    LLLL: 'YYYY년 MMMM D일 dddd A h:mm',
    l: 'YYYY.MM.DD',
    ll: 'YYYY년 MMMM D일',
    lll: 'YYYY년 MMMM D일 A h:mm',
    llll: 'YYYY년 MMMM D일 dddd A h:mm'
  },
  calendar: {
    sameDay: '오늘 LT',
    nextDay: '내일 LT',
    nextWeek: 'dddd LT',
    lastDay: '어제 LT',
    lastWeek: '지난주 dddd LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s 후',
    past: '%s 전',
    s: '몇 초',
    ss: '%d초',
    m: '1분',
    mm: '%d분',
    h: '한 시간',
    hh: '%d시간',
    d: '하루',
    dd: '%d일',
    M: '한 달',
    MM: '%d달',
    y: '일 년',
    yy: '%d년'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(일|월|주)/,
  ordinal: function ordinal(number, period) {
    switch (period) {
      case 'd':
      case 'D':
      case 'DDD':
        return number + '\uC77C';
      case 'M':
        return number + '\uC6D4';
      case 'w':
      case 'W':
        return number + '\uC8FC';
      default:
        return number;
    }
  },

  meridiemParse: /오전|오후/,
  isPM: function isPM(token) {
    return token === '오후';
  },
  meridiem: function meridiem(hour, minute, isUpper) {
    return hour < 12 ? '오전' : '오후';
  }
};

//! now.js locale configuration
//! locale : Kyrgyz [ky]
//! author : Chyngyz Arystan uulu : https://github.com/chyngyz
/* jshint -W100 */

var suffixes$2 = {
  0: '-чү',
  1: '-чи',
  2: '-чи',
  3: '-чү',
  4: '-чү',
  5: '-чи',
  6: '-чы',
  7: '-чи',
  8: '-чи',
  9: '-чу',
  10: '-чу',
  20: '-чы',
  30: '-чу',
  40: '-чы',
  50: '-чү',
  60: '-чы',
  70: '-чи',
  80: '-чи',
  90: '-чу',
  100: '-чү'
};

var ky = {
  months: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
  monthsShort: 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
  weekdays: 'Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби'.split('_'),
  weekdaysShort: 'Жек_Дүй_Шей_Шар_Бей_Жум_Ише'.split('_'),
  weekdaysMin: 'Жк_Дй_Шй_Шр_Бй_Жм_Иш'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Бүгүн саат] LT',
    nextDay: '[Эртең саат] LT',
    nextWeek: 'dddd [саат] LT',
    lastDay: '[Кече саат] LT',
    lastWeek: '[Өткен аптанын] dddd [күнү] [саат] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s ичинде',
    past: '%s мурун',
    s: 'бирнече секунд',
    m: 'бир мүнөт',
    mm: '%d мүнөт',
    h: 'бир саат',
    hh: '%d саат',
    d: 'бир күн',
    dd: '%d күн',
    M: 'бир ай',
    MM: '%d ай',
    y: 'бир жыл',
    yy: '%d жыл'
  },
  dayOfMonthOrdinalParse: /\d{1,2}-(чи|чы|чү|чу)/,
  ordinal: function ordinal(number) {
    var a = number % 10;
    var b = number >= 100 ? 100 : null;
    return number + (suffixes$2[number] || suffixes$2[a] || suffixes$2[b]);
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Luxembourgish [lb]
//! author : mweimerskirch : https://github.com/mweimerskirch
//! author : David Raison : https://github.com/kwisatz
/* jshint -W100 */

function processRelativeTime$5(number, withoutSuffix, key, isFuture) {
  var format = {
    m: ['eng Minutt', 'enger Minutt'],
    h: ['eng Stonn', 'enger Stonn'],
    d: ['een Dag', 'engem Dag'],
    M: ['ee Mount', 'engem Mount'],
    y: ['ee Joer', 'engem Joer']
  };
  return withoutSuffix ? format[key][0] : format[key][1];
}

function processFutureTime(string) {
  var number = string.substr(0, string.indexOf(' '));
  if (eifelerRegelAppliesToNumber(number)) {
    return 'a ' + string;
  }
  return 'an ' + string;
}

function processPastTime(string) {
  var number = string.substr(0, string.indexOf(' '));
  if (eifelerRegelAppliesToNumber(number)) {
    return 'viru ' + string;
  }
  return 'virun ' + string;
}
/**
 * Returns true if the word before the given number loses the '-n' ending.
 * e.g. 'an 10 Deeg' but 'a 5 Deeg'
 *
 * @param number {integer}
 * @returns {boolean}
 */
function eifelerRegelAppliesToNumber(number) {
  number = parseInt(number, 10);
  if (isNaN(number)) {
    return false;
  }
  if (number < 0) {
    // Negative Number --> always true
    return true;
  } else if (number < 10) {
    // Only 1 digit
    if (number >= 4 && number <= 7) {
      return true;
    }
    return false;
  } else if (number < 100) {
    // 2 digits
    var lastDigit = number % 10;
    var firstDigit = number / 10;
    if (lastDigit === 0) {
      return eifelerRegelAppliesToNumber(firstDigit);
    }
    return eifelerRegelAppliesToNumber(lastDigit);
  } else if (number < 10000) {
    // 3 or 4 digits --> recursively check first digit
    while (number >= 10) {
      number /= 10;
    }
    return eifelerRegelAppliesToNumber(number);
  }
  // Anything larger than 4 digits: recursively check first n-3 digits
  number /= 1000;
  return eifelerRegelAppliesToNumber(number);
}

var lb = {
  months: 'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
  monthsShort: 'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
  monthsParseExact: true,
  weekdays: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
  weekdaysShort: 'So._Mé._Dë._Më._Do._Fr._Sa.'.split('_'),
  weekdaysMin: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm [Auer]',
    LTS: 'H:mm:ss [Auer]',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY H:mm [Auer]',
    LLLL: 'dddd, D. MMMM YYYY H:mm [Auer]'
  },
  calendar: {
    sameDay: '[Haut um] LT',
    sameElse: 'L',
    nextDay: '[Muer um] LT',
    nextWeek: 'dddd [um] LT',
    lastDay: '[Gëschter um] LT',
    lastWeek: function lastWeek() {
      // Different date string for 'Dënschdeg' (Tuesday) and 'Donneschdeg' (Thursday) due to phonological rule
      switch (this.day()) {
        case 2:
        case 4:
          return '[Leschten] dddd [um] LT';
        default:
          return '[Leschte] dddd [um] LT';
      }
    }
  },
  relativeTime: {
    future: processFutureTime,
    past: processPastTime,
    s: 'e puer Sekonnen',
    m: processRelativeTime$5,
    mm: '%d Minutten',
    h: processRelativeTime$5,
    hh: '%d Stonnen',
    d: processRelativeTime$5,
    dd: '%d Deeg',
    M: processRelativeTime$5,
    MM: '%d Méint',
    y: processRelativeTime$5,
    yy: '%d Joer'
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Lao [lo]
//! author : Ryan Hart : https://github.com/ryanhart2
/* jshint -W100 */

var lo = {
  months: 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
  monthsShort: 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
  weekdays: 'ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
  weekdaysShort: 'ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
  weekdaysMin: 'ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'ວັນdddd D MMMM YYYY HH:mm'
  },
  meridiemParse: /ຕອນເຊົ້າ|ຕອນແລງ/,
  isPM: function isPM(input) {
    return input === 'ຕອນແລງ';
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 12) {
      return 'ຕອນເຊົ້າ';
    }
    return 'ຕອນແລງ';
  },

  calendar: {
    sameDay: '[ມື້ນີ້ເວລາ] LT',
    nextDay: '[ມື້ອື່ນເວລາ] LT',
    nextWeek: '[ວັນ]dddd[ໜ້າເວລາ] LT',
    lastDay: '[ມື້ວານນີ້ເວລາ] LT',
    lastWeek: '[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'ອີກ %s',
    past: '%sຜ່ານມາ',
    s: 'ບໍ່ເທົ່າໃດວິນາທີ',
    m: '1 ນາທີ',
    mm: '%d ນາທີ',
    h: '1 ຊົ່ວໂມງ',
    hh: '%d ຊົ່ວໂມງ',
    d: '1 ມື້',
    dd: '%d ມື້',
    M: '1 ເດືອນ',
    MM: '%d ເດືອນ',
    y: '1 ປີ',
    yy: '%d ປີ'
  },
  dayOfMonthOrdinalParse: /(ທີ່)\d{1,2}/,
  ordinal: function ordinal(number) {
    return '\u0E97\u0EB5\u0EC8' + number;
  }
};

//! now.js locale configuration
//! locale : Lithuanian [lt]
//! author : Mindaugas Mozūras : https://github.com/mmozuras
/* jshint -W100 */

var units = {
  m: 'minutė_minutės_minutę',
  mm: 'minutės_minučių_minutes',
  h: 'valanda_valandos_valandą',
  hh: 'valandos_valandų_valandas',
  d: 'diena_dienos_dieną',
  dd: 'dienos_dienų_dienas',
  M: 'mėnuo_mėnesio_mėnesį',
  MM: 'mėnesiai_mėnesių_mėnesius',
  y: 'metai_metų_metus',
  yy: 'metai_metų_metus'
};

function translateSeconds(number, withoutSuffix, key, isFuture) {
  if (withoutSuffix) {
    return 'kelios sekundės';
  }
  return isFuture ? 'kelių sekundžių' : 'kelias sekundes';
}

function translateSingular(number, withoutSuffix, key, isFuture) {
  return withoutSuffix ? forms(key)[0] : isFuture ? forms(key)[1] : forms(key)[2];
}

function special(number) {
  return number % 10 === 0 || number > 10 && number < 20;
}

function forms(key) {
  return units[key].split('_');
}

function translate$6(number, withoutSuffix, key, isFuture) {
  var result = number + ' ';
  if (number === 1) {
    return result + translateSingular(number, withoutSuffix, key[0], isFuture);
  } else if (withoutSuffix) {
    return result + (special(number) ? forms(key)[1] : forms(key)[0]);
  }
  if (isFuture) {
    return result + forms(key)[1];
  }
  return result + (special(number) ? forms(key)[1] : forms(key)[2]);
}

var lt = {
  months: {
    format: 'sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio'.split('_'),
    standalone: 'sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis'.split('_'),
    isFormat: /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/
  },
  monthsShort: 'sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd'.split('_'),
  weekdays: {
    format: 'sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį'.split('_'),
    standalone: 'sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis'.split('_'),
    isFormat: /dddd HH:mm/
  },
  weekdaysShort: 'Sek_Pir_Ant_Tre_Ket_Pen_Šeš'.split('_'),
  weekdaysMin: 'S_P_A_T_K_Pn_Š'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'YYYY [m.] MMMM D [d.]',
    LLL: 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
    LLLL: 'YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]',
    l: 'YYYY-MM-DD',
    ll: 'YYYY [m.] MMMM D [d.]',
    lll: 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
    llll: 'YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]'
  },
  calendar: {
    sameDay: '[Šiandien] LT',
    nextDay: '[Rytoj] LT',
    nextWeek: 'dddd LT',
    lastDay: '[Vakar] LT',
    lastWeek: '[Praėjusį] dddd LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'po %s',
    past: 'prieš %s',
    s: translateSeconds,
    m: translateSingular,
    mm: translate$6,
    h: translateSingular,
    hh: translate$6,
    d: translateSingular,
    dd: translate$6,
    M: translateSingular,
    MM: translate$6,
    y: translateSingular,
    yy: translate$6
  },
  dayOfMonthOrdinalParse: /\d{1,2}-oji/,
  ordinal: function ordinal(number) {
    return number + '-oji';
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Latvian [lv]
//! author : Kristaps Karlsons : https://github.com/skakri
//! author : Jānis Elmeris : https://github.com/JanisE
/* jshint -W100 */

var units$1 = {
  m: 'minūtes_minūtēm_minūte_minūtes'.split('_'),
  mm: 'minūtes_minūtēm_minūte_minūtes'.split('_'),
  h: 'stundas_stundām_stunda_stundas'.split('_'),
  hh: 'stundas_stundām_stunda_stundas'.split('_'),
  d: 'dienas_dienām_diena_dienas'.split('_'),
  dd: 'dienas_dienām_diena_dienas'.split('_'),
  M: 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
  MM: 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
  y: 'gada_gadiem_gads_gadi'.split('_'),
  yy: 'gada_gadiem_gads_gadi'.split('_')
};
/**
 * @param withoutSuffix boolean true = a length of time; false = before/after a period of time.
 */
function format(forms, number, withoutSuffix) {
  if (withoutSuffix) {
    // E.g. "21 minūte", "3 minūtes".
    return number % 10 === 1 && number % 100 !== 11 ? forms[2] : forms[3];
  }
  // E.g. "21 minūtes" as in "pēc 21 minūtes".
  // E.g. "3 minūtēm" as in "pēc 3 minūtēm".
  return number % 10 === 1 && number % 100 !== 11 ? forms[0] : forms[1];
}

function relativeTimeWithPlural$1(number, withoutSuffix, key) {
  return number + ' ' + format(units$1[key], number, withoutSuffix);
}

function relativeTimeWithSingular(number, withoutSuffix, key) {
  return format(units$1[key], number, withoutSuffix);
}

function relativeSeconds(number, withoutSuffix) {
  return withoutSuffix ? 'dažas sekundes' : 'dažām sekundēm';
}

var lv = {
  months: 'janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris'.split('_'),
  monthsShort: 'jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec'.split('_'),
  weekdays: 'svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena'.split('_'),
  weekdaysShort: 'Sv_P_O_T_C_Pk_S'.split('_'),
  weekdaysMin: 'Sv_P_O_T_C_Pk_S'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY.',
    LL: 'YYYY. [gada] D. MMMM',
    LLL: 'YYYY. [gada] D. MMMM, HH:mm',
    LLLL: 'YYYY. [gada] D. MMMM, dddd, HH:mm'
  },
  calendar: {
    sameDay: '[Šodien pulksten] LT',
    nextDay: '[Rīt pulksten] LT',
    nextWeek: 'dddd [pulksten] LT',
    lastDay: '[Vakar pulksten] LT',
    lastWeek: '[Pagājušā] dddd [pulksten] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'pēc %s',
    past: 'pirms %s',
    s: relativeSeconds,
    m: relativeTimeWithSingular,
    mm: relativeTimeWithPlural$1,
    h: relativeTimeWithSingular,
    hh: relativeTimeWithPlural$1,
    d: relativeTimeWithSingular,
    dd: relativeTimeWithPlural$1,
    M: relativeTimeWithSingular,
    MM: relativeTimeWithPlural$1,
    y: relativeTimeWithSingular,
    yy: relativeTimeWithPlural$1
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Montenegrin [me]
//! author : Miodrag Nikač <miodrag@restartit.me> : https://github.com/miodragnikac
/* jshint -W100 */

var translator = {
  words: { // Different grammatical cases
    m: ['jedan minut', 'jednog minuta'],
    mm: ['minut', 'minuta', 'minuta'],
    h: ['jedan sat', 'jednog sata'],
    hh: ['sat', 'sata', 'sati'],
    dd: ['dan', 'dana', 'dana'],
    MM: ['mjesec', 'mjeseca', 'mjeseci'],
    yy: ['godina', 'godine', 'godina']
  },
  correctGrammaticalCase: function correctGrammaticalCase(number, wordKey) {
    return number === 1 ? wordKey[0] : number >= 2 && number <= 4 ? wordKey[1] : wordKey[2];
  },
  translate: function translate(number, withoutSuffix, key) {
    var wordKey = translator.words[key];
    if (key.length === 1) {
      return withoutSuffix ? wordKey[0] : wordKey[1];
    }
    return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
  }
};

var me = {
  months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
  monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
  monthsParseExact: true,
  weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
  weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
  weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY H:mm',
    LLLL: 'dddd, D. MMMM YYYY H:mm'
  },
  calendar: {
    sameDay: '[danas u] LT',
    nextDay: '[sjutra u] LT',

    nextWeek: function nextWeek() {
      switch (this.day()) {
        case 0:
          return '[u] [nedjelju] [u] LT';
        case 3:
          return '[u] [srijedu] [u] LT';
        case 6:
          return '[u] [subotu] [u] LT';
        case 1:
        case 2:
        case 4:
        case 5:
          return '[u] dddd [u] LT';
      }
    },

    lastDay: '[juče u] LT',
    lastWeek: function lastWeek() {
      var lastWeekDays = ['[prošle] [nedjelje] [u] LT', '[prošlog] [ponedjeljka] [u] LT', '[prošlog] [utorka] [u] LT', '[prošle] [srijede] [u] LT', '[prošlog] [četvrtka] [u] LT', '[prošlog] [petka] [u] LT', '[prošle] [subote] [u] LT'];
      return lastWeekDays[this.day()];
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'za %s',
    past: 'prije %s',
    s: 'nekoliko sekundi',
    m: translator.translate,
    mm: translator.translate,
    h: translator.translate,
    hh: translator.translate,
    d: 'dan',
    dd: translator.translate,
    M: 'mjesec',
    MM: translator.translate,
    y: 'godinu',
    yy: translator.translate
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Maori [mi]
//! author : John Corrigan <robbiecloset@gmail.com> : https://github.com/johnideal
/* jshint -W100 */

var mi = {
  months: 'Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea'.split('_'),
  monthsShort: 'Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki'.split('_'),
  monthsRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
  monthsStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
  monthsShortRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
  monthsShortStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,
  weekdays: 'Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei'.split('_'),
  weekdaysShort: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
  weekdaysMin: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY [i] HH:mm',
    LLLL: 'dddd, D MMMM YYYY [i] HH:mm'
  },
  calendar: {
    sameDay: '[i teie mahana, i] LT',
    nextDay: '[apopo i] LT',
    nextWeek: 'dddd [i] LT',
    lastDay: '[inanahi i] LT',
    lastWeek: 'dddd [whakamutunga i] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'i roto i %s',
    past: '%s i mua',
    s: 'te hēkona ruarua',
    m: 'he meneti',
    mm: '%d meneti',
    h: 'te haora',
    hh: '%d haora',
    d: 'he ra',
    dd: '%d ra',
    M: 'he marama',
    MM: '%d marama',
    y: 'he tau',
    yy: '%d tau'
  },
  dayOfMonthOrdinalParse: /\d{1,2}º/,
  ordinal: '%dº',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Macedonian [mk]
//! author : Borislav Mickov : https://github.com/B0k0
/* jshint -W100 */

var mk = {
  months: 'јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември'.split('_'),
  monthsShort: 'јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек'.split('_'),
  weekdays: 'недела_понеделник_вторник_среда_четврток_петок_сабота'.split('_'),
  weekdaysShort: 'нед_пон_вто_сре_чет_пет_саб'.split('_'),
  weekdaysMin: 'нe_пo_вт_ср_че_пе_сa'.split('_'),
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'D.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY H:mm',
    LLLL: 'dddd, D MMMM YYYY H:mm'
  },
  calendar: {
    sameDay: '[Денес во] LT',
    nextDay: '[Утре во] LT',
    nextWeek: '[Во] dddd [во] LT',
    lastDay: '[Вчера во] LT',
    lastWeek: function lastWeek() {
      switch (this.day()) {
        case 0:
        case 3:
        case 6:
          return '[Изминатата] dddd [во] LT';
        case 1:
        case 2:
        case 4:
        case 5:
          return '[Изминатиот] dddd [во] LT';
      }
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'после %s',
    past: 'пред %s',
    s: 'неколку секунди',
    m: 'минута',
    mm: '%d минути',
    h: 'час',
    hh: '%d часа',
    d: 'ден',
    dd: '%d дена',
    M: 'месец',
    MM: '%d месеци',
    y: 'година',
    yy: '%d години'
  },
  dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
  ordinal: function ordinal(number) {
    var lastDigit = number % 10;
    var last2Digits = number % 100;
    if (number === 0) {
      return number + '-\u0435\u0432';
    } else if (last2Digits === 0) {
      return number + '-\u0435\u043D';
    } else if (last2Digits > 10 && last2Digits < 20) {
      return number + '-\u0442\u0438';
    } else if (lastDigit === 1) {
      return number + '-\u0432\u0438';
    } else if (lastDigit === 2) {
      return number + '-\u0440\u0438';
    } else if (lastDigit === 7 || lastDigit === 8) {
      return number + '-\u043C\u0438';
    }
    return number + '-\u0442\u0438';
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Malayalam [ml]
//! author : Floyd Pink : https://github.com/floydpink
/* jshint -W100 */

var ml = {
  months: 'ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ'.split('_'),
  monthsShort: 'ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.'.split('_'),
  monthsParseExact: true,
  weekdays: 'ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച'.split('_'),
  weekdaysShort: 'ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി'.split('_'),
  weekdaysMin: 'ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ'.split('_'),
  longDateFormat: {
    LT: 'A h:mm -നു',
    LTS: 'A h:mm:ss -നു',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY, A h:mm -നു',
    LLLL: 'dddd, D MMMM YYYY, A h:mm -നു'
  },
  calendar: {
    sameDay: '[ഇന്ന്] LT',
    nextDay: '[നാളെ] LT',
    nextWeek: 'dddd, LT',
    lastDay: '[ഇന്നലെ] LT',
    lastWeek: '[കഴിഞ്ഞ] dddd, LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s കഴിഞ്ഞ്',
    past: '%s മുൻപ്',
    s: 'അൽപ നിമിഷങ്ങൾ',
    m: 'ഒരു മിനിറ്റ്',
    mm: '%d മിനിറ്റ്',
    h: 'ഒരു മണിക്കൂർ',
    hh: '%d മണിക്കൂർ',
    d: 'ഒരു ദിവസം',
    dd: '%d ദിവസം',
    M: 'ഒരു മാസം',
    MM: '%d മാസം',
    y: 'ഒരു വർഷം',
    yy: '%d വർഷം'
  },
  meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'രാത്രി' && hour >= 4 || meridiem === 'ഉച്ച കഴിഞ്ഞ്' || meridiem === 'വൈകുന്നേരം') {
      return hour + 12;
    }
    return hour;
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'രാത്രി';
    } else if (hour < 12) {
      return 'രാവിലെ';
    } else if (hour < 17) {
      return 'ഉച്ച കഴിഞ്ഞ്';
    } else if (hour < 20) {
      return 'വൈകുന്നേരം';
    }
    return 'രാത്രി';
  }
};

//! now.js locale configuration
//! locale : Marathi [mr]
//! author : Harshad Kale : https://github.com/kalehv
//! author : Vivek Athalye : https://github.com/vnathalye
/* jshint -W100 */

var symbolMap$9 = {
  1: '१',
  2: '२',
  3: '३',
  4: '४',
  5: '५',
  6: '६',
  7: '७',
  8: '८',
  9: '९',
  0: '०'
};

var numberMap$8 = {
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
  '०': '0'
};

function relativeTimeMr(number, withoutSuffix, string, isFuture) {
  var output = '';
  if (withoutSuffix) {
    switch (string) {
      case 's':
        output = 'काही सेकंद';
        break;
      case 'm':
        output = 'एक मिनिट';
        break;
      case 'mm':
        output = '%d मिनिटे';
        break;
      case 'h':
        output = 'एक तास';
        break;
      case 'hh':
        output = '%d तास';
        break;
      case 'd':
        output = 'एक दिवस';
        break;
      case 'dd':
        output = '%d दिवस';
        break;
      case 'M':
        output = 'एक महिना';
        break;
      case 'MM':
        output = '%d महिने';
        break;
      case 'y':
        output = 'एक वर्ष';
        break;
      case 'yy':
        output = '%d वर्षे';
        break;
    }
  } else {
    switch (string) {
      case 's':
        output = 'काही सेकंदां';
        break;
      case 'm':
        output = 'एका मिनिटा';
        break;
      case 'mm':
        output = '%d मिनिटां';
        break;
      case 'h':
        output = 'एका तासा';
        break;
      case 'hh':
        output = '%d तासां';
        break;
      case 'd':
        output = 'एका दिवसा';
        break;
      case 'dd':
        output = '%d दिवसां';
        break;
      case 'M':
        output = 'एका महिन्या';
        break;
      case 'MM':
        output = '%d महिन्यां';
        break;
      case 'y':
        output = 'एका वर्षा';
        break;
      case 'yy':
        output = '%d वर्षां';
        break;
    }
  }
  return output.replace(/%d/i, number);
}

var mr = {
  months: 'जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split('_'),
  monthsShort: 'जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split('_'),
  monthsParseExact: true,
  weekdays: 'रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
  weekdaysShort: 'रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि'.split('_'),
  weekdaysMin: 'र_सो_मं_बु_गु_शु_श'.split('_'),
  longDateFormat: {
    LT: 'A h:mm वाजता',
    LTS: 'A h:mm:ss वाजता',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY, A h:mm वाजता',
    LLLL: 'dddd, D MMMM YYYY, A h:mm वाजता'
  },
  calendar: {
    sameDay: '[आज] LT',
    nextDay: '[उद्या] LT',
    nextWeek: 'dddd, LT',
    lastDay: '[काल] LT',
    lastWeek: '[मागील] dddd, LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%sमध्ये',
    past: '%sपूर्वी',
    s: relativeTimeMr,
    m: relativeTimeMr,
    mm: relativeTimeMr,
    h: relativeTimeMr,
    hh: relativeTimeMr,
    d: relativeTimeMr,
    dd: relativeTimeMr,
    M: relativeTimeMr,
    MM: relativeTimeMr,
    y: relativeTimeMr,
    yy: relativeTimeMr
  },
  preparse: function preparse(string) {
    return string.replace(/[१२३४५६७८९०]/g, function (match) {
      return numberMap$8[match];
    });
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$9[match];
    });
  },

  meridiemParse: /रात्री|सकाळी|दुपारी|सायंकाळी/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'रात्री') {
      return hour < 4 ? hour : hour + 12;
    } else if (meridiem === 'सकाळी') {
      return hour;
    } else if (meridiem === 'दुपारी') {
      return hour >= 10 ? hour : hour + 12;
    } else if (meridiem === 'सायंकाळी') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'रात्री';
    } else if (hour < 10) {
      return 'सकाळी';
    } else if (hour < 17) {
      return 'दुपारी';
    } else if (hour < 20) {
      return 'सायंकाळी';
    }
    return 'रात्री';
  },

  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Malay [ms-my]
//! note : DEPRECATED, the correct one is [ms]
//! author : Weldan Jamili : https://github.com/weldan
/* jshint -W100 */

var msmy = {
  months: 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
  monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
  weekdays: 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
  weekdaysShort: 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
  weekdaysMin: 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
  longDateFormat: {
    LT: 'HH.mm',
    LTS: 'HH.mm.ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY [pukul] HH.mm',
    LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm'
  },
  meridiemParse: /pagi|tengahari|petang|malam/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'pagi') {
      return hour;
    } else if (meridiem === 'tengahari') {
      return hour >= 11 ? hour : hour + 12;
    } else if (meridiem === 'petang' || meridiem === 'malam') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hours, minutes, isLower) {
    if (hours < 11) {
      return 'pagi';
    } else if (hours < 15) {
      return 'tengahari';
    } else if (hours < 19) {
      return 'petang';
    }
    return 'malam';
  },

  calendar: {
    sameDay: '[Hari ini pukul] LT',
    nextDay: '[Esok pukul] LT',
    nextWeek: 'dddd [pukul] LT',
    lastDay: '[Kelmarin pukul] LT',
    lastWeek: 'dddd [lepas pukul] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'dalam %s',
    past: '%s yang lepas',
    s: 'beberapa saat',
    m: 'seminit',
    mm: '%d minit',
    h: 'sejam',
    hh: '%d jam',
    d: 'sehari',
    dd: '%d hari',
    M: 'sebulan',
    MM: '%d bulan',
    y: 'setahun',
    yy: '%d tahun'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Malay [ms]
//! author : Weldan Jamili : https://github.com/weldan
/* jshint -W100 */

var ms = {
  months: 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
  monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
  weekdays: 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
  weekdaysShort: 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
  weekdaysMin: 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
  longDateFormat: {
    LT: 'HH.mm',
    LTS: 'HH.mm.ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY [pukul] HH.mm',
    LLLL: 'dddd, D MMMM YYYY [pukul] HH.mm'
  },
  meridiemParse: /pagi|tengahari|petang|malam/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'pagi') {
      return hour;
    } else if (meridiem === 'tengahari') {
      return hour >= 11 ? hour : hour + 12;
    } else if (meridiem === 'petang' || meridiem === 'malam') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hours, minutes, isLower) {
    if (hours < 11) {
      return 'pagi';
    } else if (hours < 15) {
      return 'tengahari';
    } else if (hours < 19) {
      return 'petang';
    }
    return 'malam';
  },

  calendar: {
    sameDay: '[Hari ini pukul] LT',
    nextDay: '[Esok pukul] LT',
    nextWeek: 'dddd [pukul] LT',
    lastDay: '[Kelmarin pukul] LT',
    lastWeek: 'dddd [lepas pukul] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'dalam %s',
    past: '%s yang lepas',
    s: 'beberapa saat',
    m: 'seminit',
    mm: '%d minit',
    h: 'sejam',
    hh: '%d jam',
    d: 'sehari',
    dd: '%d hari',
    M: 'sebulan',
    MM: '%d bulan',
    y: 'setahun',
    yy: '%d tahun'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Burmese [my]
//! author : Squar team, mysquar.com
//! author : David Rossellat : https://github.com/gholadr
//! author : Tin Aung Lin : https://github.com/thanyawzinmin
/* jshint -W100 */

var symbolMap$10 = {
  1: '၁',
  2: '၂',
  3: '၃',
  4: '၄',
  5: '၅',
  6: '၆',
  7: '၇',
  8: '၈',
  9: '၉',
  0: '၀'
};

var numberMap$9 = {
  '၁': '1',
  '၂': '2',
  '၃': '3',
  '၄': '4',
  '၅': '5',
  '၆': '6',
  '၇': '7',
  '၈': '8',
  '၉': '9',
  '၀': '0'
};

var my = {
  months: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split('_'),
  monthsShort: 'ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ'.split('_'),
  weekdays: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split('_'),
  weekdaysShort: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
  weekdaysMin: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),

  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[ယနေ.] LT [မှာ]',
    nextDay: '[မနက်ဖြန်] LT [မှာ]',
    nextWeek: 'dddd LT [မှာ]',
    lastDay: '[မနေ.က] LT [မှာ]',
    lastWeek: '[ပြီးခဲ့သော] dddd LT [မှာ]',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'လာမည့် %s မှာ',
    past: 'လွန်ခဲ့သော %s က',
    s: 'စက္ကန်.အနည်းငယ်',
    m: 'တစ်မိနစ်',
    mm: '%d မိနစ်',
    h: 'တစ်နာရီ',
    hh: '%d နာရီ',
    d: 'တစ်ရက်',
    dd: '%d ရက်',
    M: 'တစ်လ',
    MM: '%d လ',
    y: 'တစ်နှစ်',
    yy: '%d နှစ်'
  },
  preparse: function preparse(string) {
    return string.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function (match) {
      return numberMap$9[match];
    });
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$10[match];
    });
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Norwegian Bokmål [nb]
//! authors : Espen Hovlandsdal : https://github.com/rexxars
//!           Sigurd Gartmann : https://github.com/sigurdga
/* jshint -W100 */

var nb = {
  months: 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
  monthsShort: 'jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
  monthsParseExact: true,
  weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
  weekdaysShort: 'sø._ma._ti._on._to._fr._lø.'.split('_'),
  weekdaysMin: 'sø_ma_ti_on_to_fr_lø'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY [kl.] HH:mm',
    LLLL: 'dddd D. MMMM YYYY [kl.] HH:mm'
  },
  calendar: {
    sameDay: '[i dag kl.] LT',
    nextDay: '[i morgen kl.] LT',
    nextWeek: 'dddd [kl.] LT',
    lastDay: '[i går kl.] LT',
    lastWeek: '[forrige] dddd [kl.] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'om %s',
    past: '%s siden',
    s: 'noen sekunder',
    m: 'ett minutt',
    mm: '%d minutter',
    h: 'en time',
    hh: '%d timer',
    d: 'en dag',
    dd: '%d dager',
    M: 'en måned',
    MM: '%d måneder',
    y: 'ett år',
    yy: '%d år'
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Nepalese [ne]
//! author : suvash : https://github.com/suvash
/* jshint -W100 */

var symbolMap$11 = {
  1: '१',
  2: '२',
  3: '३',
  4: '४',
  5: '५',
  6: '६',
  7: '७',
  8: '८',
  9: '९',
  0: '०'
};

var numberMap$10 = {
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
  '०': '0'
};

var ne = {
  months: 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split('_'),
  monthsShort: 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split('_'),
  monthsParseExact: true,
  weekdays: 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split('_'),
  weekdaysShort: 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split('_'),
  weekdaysMin: 'आ._सो._मं._बु._बि._शु._श.'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'Aको h:mm बजे',
    LTS: 'Aको h:mm:ss बजे',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY, Aको h:mm बजे',
    LLLL: 'dddd, D MMMM YYYY, Aको h:mm बजे'
  },
  preparse: function preparse(string) {
    return string.replace(/[१२३४५६७८९०]/g, function (match) {
      return numberMap$10[match];
    });
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$11[match];
    });
  },

  meridiemParse: /राति|बिहान|दिउँसो|साँझ/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'राति') {
      return hour < 4 ? hour : hour + 12;
    } else if (meridiem === 'बिहान') {
      return hour;
    } else if (meridiem === 'दिउँसो') {
      return hour >= 10 ? hour : hour + 12;
    } else if (meridiem === 'साँझ') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 3) {
      return 'राति';
    } else if (hour < 12) {
      return 'बिहान';
    } else if (hour < 16) {
      return 'दिउँसो';
    } else if (hour < 20) {
      return 'साँझ';
    }
    return 'राति';
  },

  calendar: {
    sameDay: '[आज] LT',
    nextDay: '[भोलि] LT',
    nextWeek: '[आउँदो] dddd[,] LT',
    lastDay: '[हिजो] LT',
    lastWeek: '[गएको] dddd[,] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%sमा',
    past: '%s अगाडि',
    s: 'केही क्षण',
    m: 'एक मिनेट',
    mm: '%d मिनेट',
    h: 'एक घण्टा',
    hh: '%d घण्टा',
    d: 'एक दिन',
    dd: '%d दिन',
    M: 'एक महिना',
    MM: '%d महिना',
    y: 'एक बर्ष',
    yy: '%d बर्ष'
  },
  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Dutch (Belgium) [nl-be]
//! author : Joris Röling : https://github.com/jorisroling
//! author : Jacob Middag : https://github.com/middagj
/* jshint -W100 */

var monthsShortWithDots$1 = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
var monthsShortWithoutDots$1 = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

var monthsParse$2 = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
var monthsRegex$2 = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

var nlbe = {
  months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
  monthsShort: function monthsShort(m, format) {
    if (!m) {
      return monthsShortWithDots$1;
    } else if (/-MMM-/.test(format)) {
      return monthsShortWithoutDots$1[m.month()];
    }
    return monthsShortWithDots$1[m.month()];
  },


  monthsRegex: monthsRegex$2,
  monthsShortRegex: monthsRegex$2,
  monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
  monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

  monthsParse: monthsParse$2,
  longMonthsParse: monthsParse$2,
  shortMonthsParse: monthsParse$2,

  weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
  weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
  weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[vandaag om] LT',
    nextDay: '[morgen om] LT',
    nextWeek: 'dddd [om] LT',
    lastDay: '[gisteren om] LT',
    lastWeek: '[afgelopen] dddd [om] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'over %s',
    past: '%s geleden',
    s: 'een paar seconden',
    m: 'één minuut',
    mm: '%d minuten',
    h: 'één uur',
    hh: '%d uur',
    d: 'één dag',
    dd: '%d dagen',
    M: 'één maand',
    MM: '%d maanden',
    y: 'één jaar',
    yy: '%d jaar'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
  ordinal: function ordinal(number) {
    return number + (number === 1 || number === 8 || number >= 20 ? 'ste' : 'de');
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Dutch [nl]
//! author : Joris Röling : https://github.com/jorisroling
//! author : Jacob Middag : https://github.com/middagj
/* jshint -W100 */

var monthsShortWithDots$2 = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
var monthsShortWithoutDots$2 = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

var monthsParse$3 = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
var monthsRegex$3 = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

var nl = {
  months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
  monthsShort: function monthsShort(m, format) {
    if (!m) {
      return monthsShortWithDots$2;
    } else if (/-MMM-/.test(format)) {
      return monthsShortWithoutDots$2[m.month()];
    }
    return monthsShortWithDots$2[m.month()];
  },


  monthsRegex: monthsRegex$3,
  monthsShortRegex: monthsRegex$3,
  monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
  monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

  monthsParse: monthsParse$3,
  longMonthsParse: monthsParse$3,
  shortMonthsParse: monthsParse$3,

  weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
  weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
  weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD-MM-YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[vandaag om] LT',
    nextDay: '[morgen om] LT',
    nextWeek: 'dddd [om] LT',
    lastDay: '[gisteren om] LT',
    lastWeek: '[afgelopen] dddd [om] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'over %s',
    past: '%s geleden',
    s: 'een paar seconden',
    m: 'één minuut',
    mm: '%d minuten',
    h: 'één uur',
    hh: '%d uur',
    d: 'één dag',
    dd: '%d dagen',
    M: 'één maand',
    MM: '%d maanden',
    y: 'één jaar',
    yy: '%d jaar'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
  ordinal: function ordinal(number) {
    return number + (number === 1 || number === 8 || number >= 20 ? 'ste' : 'de');
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Nynorsk [nn]
//! author : https://github.com/mechuwind
/* jshint -W100 */

var nn = {
  months: 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
  monthsShort: 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
  weekdays: 'sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag'.split('_'),
  weekdaysShort: 'sun_mån_tys_ons_tor_fre_lau'.split('_'),
  weekdaysMin: 'su_må_ty_on_to_fr_lø'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY [kl.] H:mm',
    LLLL: 'dddd D. MMMM YYYY [kl.] HH:mm'
  },
  calendar: {
    sameDay: '[I dag klokka] LT',
    nextDay: '[I morgon klokka] LT',
    nextWeek: 'dddd [klokka] LT',
    lastDay: '[I går klokka] LT',
    lastWeek: '[Føregåande] dddd [klokka] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'om %s',
    past: '%s sidan',
    s: 'nokre sekund',
    m: 'eit minutt',
    mm: '%d minutt',
    h: 'ein time',
    hh: '%d timar',
    d: 'ein dag',
    dd: '%d dagar',
    M: 'ein månad',
    MM: '%d månader',
    y: 'eit år',
    yy: '%d år'
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Punjabi (India) [pa-in]
//! author : Harpreet Singh : https://github.com/harpreetkhalsagtbit
/* jshint -W100 */

var symbolMap$12 = {
  1: '੧',
  2: '੨',
  3: '੩',
  4: '੪',
  5: '੫',
  6: '੬',
  7: '੭',
  8: '੮',
  9: '੯',
  0: '੦'
};

var numberMap$11 = {
  '੧': '1',
  '੨': '2',
  '੩': '3',
  '੪': '4',
  '੫': '5',
  '੬': '6',
  '੭': '7',
  '੮': '8',
  '੯': '9',
  '੦': '0'
};

var pain = {
  // There are months name as per Nanakshahi Calender but they are not used as rigidly in modern Punjabi.
  months: 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
  monthsShort: 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
  weekdays: 'ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ'.split('_'),
  weekdaysShort: 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
  weekdaysMin: 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
  longDateFormat: {
    LT: 'A h:mm ਵਜੇ',
    LTS: 'A h:mm:ss ਵਜੇ',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY, A h:mm ਵਜੇ',
    LLLL: 'dddd, D MMMM YYYY, A h:mm ਵਜੇ'
  },
  calendar: {
    sameDay: '[ਅਜ] LT',
    nextDay: '[ਕਲ] LT',
    nextWeek: 'dddd, LT',
    lastDay: '[ਕਲ] LT',
    lastWeek: '[ਪਿਛਲੇ] dddd, LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s ਵਿੱਚ',
    past: '%s ਪਿਛਲੇ',
    s: 'ਕੁਝ ਸਕਿੰਟ',
    m: 'ਇਕ ਮਿੰਟ',
    mm: '%d ਮਿੰਟ',
    h: 'ਇੱਕ ਘੰਟਾ',
    hh: '%d ਘੰਟੇ',
    d: 'ਇੱਕ ਦਿਨ',
    dd: '%d ਦਿਨ',
    M: 'ਇੱਕ ਮਹੀਨਾ',
    MM: '%d ਮਹੀਨੇ',
    y: 'ਇੱਕ ਸਾਲ',
    yy: '%d ਸਾਲ'
  },
  preparse: function preparse(string) {
    return string.replace(/[੧੨੩੪੫੬੭੮੯੦]/g, function (match) {
      return numberMap$11[match];
    });
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$12[match];
    });
  },

  // Punjabi notation for meridiems are quite fuzzy in practice. While there exists
  // a rigid notion of a 'Pahar' it is not used as rigidly in modern Punjabi.
  meridiemParse: /ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'ਰਾਤ') {
      return hour < 4 ? hour : hour + 12;
    } else if (meridiem === 'ਸਵੇਰ') {
      return hour;
    } else if (meridiem === 'ਦੁਪਹਿਰ') {
      return hour >= 10 ? hour : hour + 12;
    } else if (meridiem === 'ਸ਼ਾਮ') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'ਰਾਤ';
    } else if (hour < 10) {
      return 'ਸਵੇਰ';
    } else if (hour < 17) {
      return 'ਦੁਪਹਿਰ';
    } else if (hour < 20) {
      return 'ਸ਼ਾਮ';
    }
    return 'ਰਾਤ';
  },

  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Polish [pl]
//! author : Rafal Hirsz : https://github.com/evoL
/* jshint -W100 */

var monthsNominative = 'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split('_');
var monthsSubjective = 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split('_');

function plural$3(n) {
  return n % 10 < 5 && n % 10 > 1 && ~~(n / 10) % 10 !== 1;
}

function translate$7(number, withoutSuffix, key) {
  var result = number + ' ';
  switch (key) {
    case 'm':
      return withoutSuffix ? 'minuta' : 'minutę';
    case 'mm':
      return result + (plural$3(number) ? 'minuty' : 'minut');
    case 'h':
      return withoutSuffix ? 'godzina' : 'godzinę';
    case 'hh':
      return result + (plural$3(number) ? 'godziny' : 'godzin');
    case 'MM':
      return result + (plural$3(number) ? 'miesiące' : 'miesięcy');
    case 'yy':
      return result + (plural$3(number) ? 'lata' : 'lat');
  }
}

var pl = {
  months: function months(momentToFormat, format) {
    if (!momentToFormat) {
      return monthsNominative;
    } else if (format === '') {
      // Hack: if format empty we know this is used to generate
      // RegExp by moment. Give then back both valid forms of months
      // in RegExp ready format.
      return '(' + monthsSubjective[momentToFormat.month()] + '|' + monthsNominative[momentToFormat.month()] + ')';
    } else if (/D MMMM/.test(format)) {
      return monthsSubjective[momentToFormat.month()];
    }
    return monthsNominative[momentToFormat.month()];
  },

  monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
  weekdays: 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
  weekdaysShort: 'ndz_pon_wt_śr_czw_pt_sob'.split('_'),
  weekdaysMin: 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Dziś o] LT',
    nextDay: '[Jutro o] LT',
    nextWeek: function nextWeek() {
      switch (this.day()) {
        case 0:
          return '[W niedzielę o] LT';

        case 2:
          return '[We wtorek o] LT';

        case 3:
          return '[W środę o] LT';

        case 6:
          return '[W sobotę o] LT';

        default:
          return '[W] dddd [o] LT';
      }
    },

    lastDay: '[Wczoraj o] LT',
    lastWeek: function lastWeek() {
      switch (this.day()) {
        case 0:
          return '[W zeszłą niedzielę o] LT';
        case 3:
          return '[W zeszłą środę o] LT';
        case 6:
          return '[W zeszłą sobotę o] LT';
        default:
          return '[W zeszły] dddd [o] LT';
      }
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'za %s',
    past: '%s temu',
    s: 'kilka sekund',
    m: translate$7,
    mm: translate$7,
    h: translate$7,
    hh: translate$7,
    d: '1 dzień',
    dd: '%d dni',
    M: 'miesiąc',
    MM: translate$7,
    y: 'rok',
    yy: translate$7
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Portuguese (Brazil) [pt-br]
//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira
/* jshint -W100 */

var ptbr = {
  months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
  monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
  weekdays: 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
  weekdaysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
  weekdaysMin: 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D [de] MMMM [de] YYYY',
    LLL: 'D [de] MMMM [de] YYYY [às] HH:mm',
    LLLL: 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
  },
  calendar: {
    sameDay: '[Hoje às] LT',
    nextDay: '[Amanhã às] LT',
    nextWeek: 'dddd [às] LT',
    lastDay: '[Ontem às] LT',
    lastWeek: function lastWeek() {
      return this.day() === 0 || this.day() === 6 ? '[Último] dddd [às] LT' : // Saturday + Sunday
      '[Última] dddd [às] LT'; // Monday - Friday
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'em %s',
    past: '%s atrás',
    s: 'poucos segundos',
    ss: '%d segundos',
    m: 'um minuto',
    mm: '%d minutos',
    h: 'uma hora',
    hh: '%d horas',
    d: 'um dia',
    dd: '%d dias',
    M: 'um mês',
    MM: '%d meses',
    y: 'um ano',
    yy: '%d anos'
  },
  dayOfMonthOrdinalParse: /\d{1,2}º/,
  ordinal: '%dº'
};

//! now.js locale configuration
//! locale : Portuguese [pt]
//! author : Jefferson : https://github.com/jalex79
/* jshint -W100 */

var pt = {
  months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
  monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
  weekdays: 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
  weekdaysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
  weekdaysMin: 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D [de] MMMM [de] YYYY',
    LLL: 'D [de] MMMM [de] YYYY HH:mm',
    LLLL: 'dddd, D [de] MMMM [de] YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Hoje às] LT',
    nextDay: '[Amanhã às] LT',
    nextWeek: 'dddd [às] LT',
    lastDay: '[Ontem às] LT',
    lastWeek: function lastWeek() {
      return this.day() === 0 || this.day() === 6 ? '[Último] dddd [às] LT' : // Saturday + Sunday
      '[Última] dddd [às] LT'; // Monday - Friday
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'em %s',
    past: 'há %s',
    s: 'segundos',
    m: 'um minuto',
    mm: '%d minutos',
    h: 'uma hora',
    hh: '%d horas',
    d: 'um dia',
    dd: '%d dias',
    M: 'um mês',
    MM: '%d meses',
    y: 'um ano',
    yy: '%d anos'
  },
  dayOfMonthOrdinalParse: /\d{1,2}º/,
  ordinal: '%dº',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Romanian [ro]
//! author : Vlad Gurdiga : https://github.com/gurdiga
//! author : Valentin Agachi : https://github.com/avaly
/* jshint -W100 */

function relativeTimeWithPlural$2(number, withoutSuffix, key) {
  var format = {
    mm: 'minute',
    hh: 'ore',
    dd: 'zile',
    MM: 'luni',
    yy: 'ani'
  };
  var separator = ' ';

  if (number % 100 >= 20 || number >= 100 && number % 100 === 0) {
    separator = ' de ';
  }
  return number + separator + format[key];
}

var ro = {
  months: 'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split('_'),
  monthsShort: 'ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split('_'),
  monthsParseExact: true,
  weekdays: 'duminică_luni_marți_miercuri_joi_vineri_sâmbătă'.split('_'),
  weekdaysShort: 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
  weekdaysMin: 'Du_Lu_Ma_Mi_Jo_Vi_Sâ'.split('_'),
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY H:mm',
    LLLL: 'dddd, D MMMM YYYY H:mm'
  },
  calendar: {
    sameDay: '[azi la] LT',
    nextDay: '[mâine la] LT',
    nextWeek: 'dddd [la] LT',
    lastDay: '[ieri la] LT',
    lastWeek: '[fosta] dddd [la] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'peste %s',
    past: '%s în urmă',
    s: 'câteva secunde',
    m: 'un minut',
    mm: relativeTimeWithPlural$2,
    h: 'o oră',
    hh: relativeTimeWithPlural$2,
    d: 'o zi',
    dd: relativeTimeWithPlural$2,
    M: 'o lună',
    MM: relativeTimeWithPlural$2,
    y: 'un an',
    yy: relativeTimeWithPlural$2
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Russian [ru]
//! author : Viktorminator : https://github.com/Viktorminator
//! Author : Menelion Elensúle : https://github.com/Oire
//! author : Коренберг Марк : https://github.com/socketpair
/* jshint -W100 */

function plural$4(word, num) {
  var forms = word.split('_');
  return num % 10 === 1 && num % 100 !== 11 ? forms[0] : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2];
}

function relativeTimeWithPlural$3(number, withoutSuffix, key) {
  var format = {
    mm: withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
    hh: 'час_часа_часов',
    dd: 'день_дня_дней',
    MM: 'месяц_месяца_месяцев',
    yy: 'год_года_лет'
  };
  if (key === 'm') {
    return withoutSuffix ? 'минута' : 'минуту';
  }
  return number + ' ' + plural$4(format[key], +number);
}
var monthsParse$4 = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i];

// http://new.gramota.ru/spravka/rules/139-prop : § 103
// Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
// CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
var ru = {
  months: {
    format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
    standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
  },
  monthsShort: {
    // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
    format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
    standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
  },
  weekdays: {
    standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
    format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
    isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
  },
  weekdaysShort: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
  weekdaysMin: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
  monthsParse: monthsParse$4,
  longMonthsParse: monthsParse$4,
  shortMonthsParse: monthsParse$4,

  // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
  monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

  // копия предыдущего
  monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

  // полные названия с падежами
  monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,

  // Выражение, которое соотвествует только сокращённым формам
  monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY г.',
    LLL: 'D MMMM YYYY г., HH:mm',
    LLLL: 'dddd, D MMMM YYYY г., HH:mm'
  },
  calendar: {
    sameDay: '[Сегодня в] LT',
    nextDay: '[Завтра в] LT',
    lastDay: '[Вчера в] LT',
    nextWeek: function nextWeek(now) {
      if (now.week() !== this.week()) {
        switch (this.day()) {
          case 0:
            return '[В следующее] dddd [в] LT';
          case 1:
          case 2:
          case 4:
            return '[В следующий] dddd [в] LT';
          case 3:
          case 5:
          case 6:
            return '[В следующую] dddd [в] LT';
        }
      } else {
        if (this.day() === 2) {
          return '[Во] dddd [в] LT';
        }
        return '[В] dddd [в] LT';
      }
    },
    lastWeek: function lastWeek(now) {
      if (now.week() !== this.week()) {
        switch (this.day()) {
          case 0:
            return '[В прошлое] dddd [в] LT';
          case 1:
          case 2:
          case 4:
            return '[В прошлый] dddd [в] LT';
          case 3:
          case 5:
          case 6:
            return '[В прошлую] dddd [в] LT';
        }
      } else {
        if (this.day() === 2) {
          return '[Во] dddd [в] LT';
        }
        return '[В] dddd [в] LT';
      }
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'через %s',
    past: '%s назад',
    s: 'несколько секунд',
    m: relativeTimeWithPlural$3,
    mm: relativeTimeWithPlural$3,
    h: 'час',
    hh: relativeTimeWithPlural$3,
    d: 'день',
    dd: relativeTimeWithPlural$3,
    M: 'месяц',
    MM: relativeTimeWithPlural$3,
    y: 'год',
    yy: relativeTimeWithPlural$3
  },
  meridiemParse: /ночи|утра|дня|вечера/i,
  isPM: function isPM(input) {
    return (/^(дня|вечера)$/.test(input)
    );
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'ночи';
    } else if (hour < 12) {
      return 'утра';
    } else if (hour < 17) {
      return 'дня';
    }
    return 'вечера';
  },

  dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
  ordinal: function ordinal(number, period) {
    switch (period) {
      case 'M':
      case 'd':
      case 'DDD':
        return number + '-\u0439';
      case 'D':
        return number + '-\u0433\u043E';
      case 'w':
      case 'W':
        return number + '-\u044F';
      default:
        return number;
    }
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Sindhi [sd]
//! author : Narain Sagar : https://github.com/narainsagar
/* jshint -W100 */

var months$5 = ['جنوري', 'فيبروري', 'مارچ', 'اپريل', 'مئي', 'جون', 'جولاءِ', 'آگسٽ', 'سيپٽمبر', 'آڪٽوبر', 'نومبر', 'ڊسمبر'];
var days$1 = ['آچر', 'سومر', 'اڱارو', 'اربع', 'خميس', 'جمع', 'ڇنڇر'];

var sd = {
  months: months$5,
  monthsShort: months$5,
  weekdays: days$1,
  weekdaysShort: days$1,
  weekdaysMin: days$1,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd، D MMMM YYYY HH:mm'
  },
  meridiemParse: /صبح|شام/,
  isPM: function isPM(input) {
    return input === 'شام';
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 12) {
      return 'صبح';
    }
    return 'شام';
  },

  calendar: {
    sameDay: '[اڄ] LT',
    nextDay: '[سڀاڻي] LT',
    nextWeek: 'dddd [اڳين هفتي تي] LT',
    lastDay: '[ڪالهه] LT',
    lastWeek: '[گزريل هفتي] dddd [تي] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s پوء',
    past: '%s اڳ',
    s: 'چند سيڪنڊ',
    m: 'هڪ منٽ',
    mm: '%d منٽ',
    h: 'هڪ ڪلاڪ',
    hh: '%d ڪلاڪ',
    d: 'هڪ ڏينهن',
    dd: '%d ڏينهن',
    M: 'هڪ مهينو',
    MM: '%d مهينا',
    y: 'هڪ سال',
    yy: '%d سال'
  },
  preparse: function preparse(string) {
    return string.replace(/،/g, ',');
  },
  postformat: function postformat(string) {
    return string.replace(/,/g, '،');
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Northern Sami [se]
//! authors : Bård Rolstad Henriksen : https://github.com/karamell
/* jshint -W100 */

var se = {
  months: 'ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu'.split('_'),
  monthsShort: 'ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov'.split('_'),
  weekdays: 'sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat'.split('_'),
  weekdaysShort: 'sotn_vuos_maŋ_gask_duor_bear_láv'.split('_'),
  weekdaysMin: 's_v_m_g_d_b_L'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'MMMM D. [b.] YYYY',
    LLL: 'MMMM D. [b.] YYYY [ti.] HH:mm',
    LLLL: 'dddd, MMMM D. [b.] YYYY [ti.] HH:mm'
  },
  calendar: {
    sameDay: '[otne ti] LT',
    nextDay: '[ihttin ti] LT',
    nextWeek: 'dddd [ti] LT',
    lastDay: '[ikte ti] LT',
    lastWeek: '[ovddit] dddd [ti] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s geažes',
    past: 'maŋit %s',
    s: 'moadde sekunddat',
    m: 'okta minuhta',
    mm: '%d minuhtat',
    h: 'okta diimmu',
    hh: '%d diimmut',
    d: 'okta beaivi',
    dd: '%d beaivvit',
    M: 'okta mánnu',
    MM: '%d mánut',
    y: 'okta jahki',
    yy: '%d jagit'
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Sinhalese [si]
//! author : Sampath Sitinamaluwa : https://github.com/sampathsris
/* jshint -W100 */

var si = {
  months: 'ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්'.split('_'),
  monthsShort: 'ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ'.split('_'),
  weekdays: 'ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා'.split('_'),
  weekdaysShort: 'ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන'.split('_'),
  weekdaysMin: 'ඉ_ස_අ_බ_බ්‍ර_සි_සෙ'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'a h:mm',
    LTS: 'a h:mm:ss',
    L: 'YYYY/MM/DD',
    LL: 'YYYY MMMM D',
    LLL: 'YYYY MMMM D, a h:mm',
    LLLL: 'YYYY MMMM D [වැනි] dddd, a h:mm:ss'
  },
  calendar: {
    sameDay: '[අද] LT[ට]',
    nextDay: '[හෙට] LT[ට]',
    nextWeek: 'dddd LT[ට]',
    lastDay: '[ඊයේ] LT[ට]',
    lastWeek: '[පසුගිය] dddd LT[ට]',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%sකින්',
    past: '%sකට පෙර',
    s: 'තත්පර කිහිපය',
    m: 'මිනිත්තුව',
    mm: 'මිනිත්තු %d',
    h: 'පැය',
    hh: 'පැය %d',
    d: 'දිනය',
    dd: 'දින %d',
    M: 'මාසය',
    MM: 'මාස %d',
    y: 'වසර',
    yy: 'වසර %d'
  },
  dayOfMonthOrdinalParse: /\d{1,2} වැනි/,
  ordinal: function ordinal(number) {
    return number + ' \u0DC0\u0DD0\u0DB1\u0DD2';
  },

  meridiemParse: /පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,
  isPM: function isPM(input) {
    return input === 'ප.ව.' || input === 'පස් වරු';
  },
  meridiem: function meridiem(hours, minutes, isLower) {
    if (hours > 11) {
      return isLower ? 'ප.ව.' : 'පස් වරු';
    }
    return isLower ? 'පෙ.ව.' : 'පෙර වරු';
  }
};

//! now.js locale configuration
//! locale : Slovak [sk]
//! author : Martin Minka : https://github.com/k2s
//! based on work of petrbela : https://github.com/petrbela
/* jshint -W100 */

var months$6 = 'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split('_');
var monthsShort$2 = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');

function plural$5(n) {
  return n > 1 && n < 5;
}

function translate$8(number, withoutSuffix, key, isFuture) {
  var result = number + ' ';
  switch (key) {
    case 's':
      // a few seconds / in a few seconds / a few seconds ago
      return withoutSuffix || isFuture ? 'pár sekúnd' : 'pár sekundami';
    case 'm':
      // a minute / in a minute / a minute ago
      return withoutSuffix ? 'minúta' : isFuture ? 'minútu' : 'minútou';
    case 'mm':
      // 9 minutes / in 9 minutes / 9 minutes ago
      if (withoutSuffix || isFuture) {
        return result + (plural$5(number) ? 'minúty' : 'minút');
      }
      return result + 'min\xFAtami';

      break;
    case 'h':
      // an hour / in an hour / an hour ago
      return withoutSuffix ? 'hodina' : isFuture ? 'hodinu' : 'hodinou';
    case 'hh':
      // 9 hours / in 9 hours / 9 hours ago
      if (withoutSuffix || isFuture) {
        return result + (plural$5(number) ? 'hodiny' : 'hodín');
      }
      return result + 'hodinami';

      break;
    case 'd':
      // a day / in a day / a day ago
      return withoutSuffix || isFuture ? 'deň' : 'dňom';
    case 'dd':
      // 9 days / in 9 days / 9 days ago
      if (withoutSuffix || isFuture) {
        return result + (plural$5(number) ? 'dni' : 'dní');
      }
      return result + 'd\u0148ami';

      break;
    case 'M':
      // a month / in a month / a month ago
      return withoutSuffix || isFuture ? 'mesiac' : 'mesiacom';
    case 'MM':
      // 9 months / in 9 months / 9 months ago
      if (withoutSuffix || isFuture) {
        return result + (plural$5(number) ? 'mesiace' : 'mesiacov');
      }
      return result + 'mesiacmi';

      break;
    case 'y':
      // a year / in a year / a year ago
      return withoutSuffix || isFuture ? 'rok' : 'rokom';
    case 'yy':
      // 9 years / in 9 years / 9 years ago
      if (withoutSuffix || isFuture) {
        return result + (plural$5(number) ? 'roky' : 'rokov');
      }
      return result + 'rokmi';

      break;
  }
}

var sk = {
  months: months$6,
  monthsShort: monthsShort$2,
  weekdays: 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
  weekdaysShort: 'ne_po_ut_st_št_pi_so'.split('_'),
  weekdaysMin: 'ne_po_ut_st_št_pi_so'.split('_'),
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY H:mm',
    LLLL: 'dddd D. MMMM YYYY H:mm'
  },
  calendar: {
    sameDay: '[dnes o] LT',
    nextDay: '[zajtra o] LT',
    nextWeek: function nextWeek() {
      switch (this.day()) {
        case 0:
          return '[v nedeľu o] LT';
        case 1:
        case 2:
          return '[v] dddd [o] LT';
        case 3:
          return '[v stredu o] LT';
        case 4:
          return '[vo štvrtok o] LT';
        case 5:
          return '[v piatok o] LT';
        case 6:
          return '[v sobotu o] LT';
      }
    },

    lastDay: '[včera o] LT',
    lastWeek: function lastWeek() {
      switch (this.day()) {
        case 0:
          return '[minulú nedeľu o] LT';
        case 1:
        case 2:
          return '[minulý] dddd [o] LT';
        case 3:
          return '[minulú stredu o] LT';
        case 4:
        case 5:
          return '[minulý] dddd [o] LT';
        case 6:
          return '[minulú sobotu o] LT';
      }
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'za %s',
    past: 'pred %s',
    s: translate$8,
    m: translate$8,
    mm: translate$8,
    h: translate$8,
    hh: translate$8,
    d: translate$8,
    dd: translate$8,
    M: translate$8,
    MM: translate$8,
    y: translate$8,
    yy: translate$8
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Slovenian [sl]
//! author : Robert Sedovšek : https://github.com/sedovsek
/* jshint -W100 */

function processRelativeTime$6(number, withoutSuffix, key, isFuture) {
  var result = number + ' ';
  switch (key) {
    case 's':
      return withoutSuffix || isFuture ? 'nekaj sekund' : 'nekaj sekundami';
    case 'm':
      return withoutSuffix ? 'ena minuta' : 'eno minuto';
    case 'mm':
      if (number === 1) {
        result += withoutSuffix ? 'minuta' : 'minuto';
      } else if (number === 2) {
        result += withoutSuffix || isFuture ? 'minuti' : 'minutama';
      } else if (number < 5) {
        result += withoutSuffix || isFuture ? 'minute' : 'minutami';
      } else {
        result += withoutSuffix || isFuture ? 'minut' : 'minutami';
      }
      return result;
    case 'h':
      return withoutSuffix ? 'ena ura' : 'eno uro';
    case 'hh':
      if (number === 1) {
        result += withoutSuffix ? 'ura' : 'uro';
      } else if (number === 2) {
        result += withoutSuffix || isFuture ? 'uri' : 'urama';
      } else if (number < 5) {
        result += withoutSuffix || isFuture ? 'ure' : 'urami';
      } else {
        result += withoutSuffix || isFuture ? 'ur' : 'urami';
      }
      return result;
    case 'd':
      return withoutSuffix || isFuture ? 'en dan' : 'enim dnem';
    case 'dd':
      if (number === 1) {
        result += withoutSuffix || isFuture ? 'dan' : 'dnem';
      } else if (number === 2) {
        result += withoutSuffix || isFuture ? 'dni' : 'dnevoma';
      } else {
        result += withoutSuffix || isFuture ? 'dni' : 'dnevi';
      }
      return result;
    case 'M':
      return withoutSuffix || isFuture ? 'en mesec' : 'enim mesecem';
    case 'MM':
      if (number === 1) {
        result += withoutSuffix || isFuture ? 'mesec' : 'mesecem';
      } else if (number === 2) {
        result += withoutSuffix || isFuture ? 'meseca' : 'mesecema';
      } else if (number < 5) {
        result += withoutSuffix || isFuture ? 'mesece' : 'meseci';
      } else {
        result += withoutSuffix || isFuture ? 'mesecev' : 'meseci';
      }
      return result;
    case 'y':
      return withoutSuffix || isFuture ? 'eno leto' : 'enim letom';
    case 'yy':
      if (number === 1) {
        result += withoutSuffix || isFuture ? 'leto' : 'letom';
      } else if (number === 2) {
        result += withoutSuffix || isFuture ? 'leti' : 'letoma';
      } else if (number < 5) {
        result += withoutSuffix || isFuture ? 'leta' : 'leti';
      } else {
        result += withoutSuffix || isFuture ? 'let' : 'leti';
      }
      return result;
  }
}

var sl = {
  months: 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
  monthsShort: 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
  monthsParseExact: true,
  weekdays: 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
  weekdaysShort: 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
  weekdaysMin: 'ne_po_to_sr_če_pe_so'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY H:mm',
    LLLL: 'dddd, D. MMMM YYYY H:mm'
  },
  calendar: {
    sameDay: '[danes ob] LT',
    nextDay: '[jutri ob] LT',

    nextWeek: function nextWeek() {
      switch (this.day()) {
        case 0:
          return '[v] [nedeljo] [ob] LT';
        case 3:
          return '[v] [sredo] [ob] LT';
        case 6:
          return '[v] [soboto] [ob] LT';
        case 1:
        case 2:
        case 4:
        case 5:
          return '[v] dddd [ob] LT';
      }
    },

    lastDay: '[včeraj ob] LT',
    lastWeek: function lastWeek() {
      switch (this.day()) {
        case 0:
          return '[prejšnjo] [nedeljo] [ob] LT';
        case 3:
          return '[prejšnjo] [sredo] [ob] LT';
        case 6:
          return '[prejšnjo] [soboto] [ob] LT';
        case 1:
        case 2:
        case 4:
        case 5:
          return '[prejšnji] dddd [ob] LT';
      }
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'čez %s',
    past: 'pred %s',
    s: processRelativeTime$6,
    m: processRelativeTime$6,
    mm: processRelativeTime$6,
    h: processRelativeTime$6,
    hh: processRelativeTime$6,
    d: processRelativeTime$6,
    dd: processRelativeTime$6,
    M: processRelativeTime$6,
    MM: processRelativeTime$6,
    y: processRelativeTime$6,
    yy: processRelativeTime$6
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Albanian [sq]
//! author : Flakërim Ismani : https://github.com/flakerimi
//! author : Menelion Elensúle : https://github.com/Oire
//! author : Oerd Cukalla : https://github.com/oerd
/* jshint -W100 */

var sq = {
  months: 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor'.split('_'),
  monthsShort: 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj'.split('_'),
  weekdays: 'E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë'.split('_'),
  weekdaysShort: 'Die_Hën_Mar_Mër_Enj_Pre_Sht'.split('_'),
  weekdaysMin: 'D_H_Ma_Më_E_P_Sh'.split('_'),
  weekdaysParseExact: true,
  meridiemParse: /PD|MD/,
  isPM: function isPM(input) {
    return input.charAt(0) === 'M';
  },
  meridiem: function meridiem(hours, minutes, isLower) {
    return hours < 12 ? 'PD' : 'MD';
  },

  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Sot në] LT',
    nextDay: '[Nesër në] LT',
    nextWeek: 'dddd [në] LT',
    lastDay: '[Dje në] LT',
    lastWeek: 'dddd [e kaluar në] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'në %s',
    past: '%s më parë',
    s: 'disa sekonda',
    m: 'një minutë',
    mm: '%d minuta',
    h: 'një orë',
    hh: '%d orë',
    d: 'një ditë',
    dd: '%d ditë',
    M: 'një muaj',
    MM: '%d muaj',
    y: 'një vit',
    yy: '%d vite'
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Serbian Cyrillic [sr-cyrl]
//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j
/* jshint -W100 */

var translator$1 = {
  words: { // Different grammatical cases
    m: ['један минут', 'једне минуте'],
    mm: ['минут', 'минуте', 'минута'],
    h: ['један сат', 'једног сата'],
    hh: ['сат', 'сата', 'сати'],
    dd: ['дан', 'дана', 'дана'],
    MM: ['месец', 'месеца', 'месеци'],
    yy: ['година', 'године', 'година']
  },
  correctGrammaticalCase: function correctGrammaticalCase(number, wordKey) {
    return number === 1 ? wordKey[0] : number >= 2 && number <= 4 ? wordKey[1] : wordKey[2];
  },
  translate: function translate(number, withoutSuffix, key) {
    var wordKey = translator$1.words[key];
    if (key.length === 1) {
      return withoutSuffix ? wordKey[0] : wordKey[1];
    }
    return number + ' ' + translator$1.correctGrammaticalCase(number, wordKey);
  }
};

var srcyrl = {
  months: 'јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар'.split('_'),
  monthsShort: 'јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.'.split('_'),
  monthsParseExact: true,
  weekdays: 'недеља_понедељак_уторак_среда_четвртак_петак_субота'.split('_'),
  weekdaysShort: 'нед._пон._уто._сре._чет._пет._суб.'.split('_'),
  weekdaysMin: 'не_по_ут_ср_че_пе_су'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY H:mm',
    LLLL: 'dddd, D. MMMM YYYY H:mm'
  },
  calendar: {
    sameDay: '[данас у] LT',
    nextDay: '[сутра у] LT',
    nextWeek: function nextWeek() {
      switch (this.day()) {
        case 0:
          return '[у] [недељу] [у] LT';
        case 3:
          return '[у] [среду] [у] LT';
        case 6:
          return '[у] [суботу] [у] LT';
        case 1:
        case 2:
        case 4:
        case 5:
          return '[у] dddd [у] LT';
      }
    },

    lastDay: '[јуче у] LT',
    lastWeek: function lastWeek() {
      var lastWeekDays = ['[прошле] [недеље] [у] LT', '[прошлог] [понедељка] [у] LT', '[прошлог] [уторка] [у] LT', '[прошле] [среде] [у] LT', '[прошлог] [четвртка] [у] LT', '[прошлог] [петка] [у] LT', '[прошле] [суботе] [у] LT'];
      return lastWeekDays[this.day()];
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'за %s',
    past: 'пре %s',
    s: 'неколико секунди',
    m: translator$1.translate,
    mm: translator$1.translate,
    h: translator$1.translate,
    hh: translator$1.translate,
    d: 'дан',
    dd: translator$1.translate,
    M: 'месец',
    MM: translator$1.translate,
    y: 'годину',
    yy: translator$1.translate
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Serbian [sr]
//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j
/* jshint -W100 */

var translator$2 = {
  words: { // Different grammatical cases
    m: ['jedan minut', 'jedne minute'],
    mm: ['minut', 'minute', 'minuta'],
    h: ['jedan sat', 'jednog sata'],
    hh: ['sat', 'sata', 'sati'],
    dd: ['dan', 'dana', 'dana'],
    MM: ['mesec', 'meseca', 'meseci'],
    yy: ['godina', 'godine', 'godina']
  },
  correctGrammaticalCase: function correctGrammaticalCase(number, wordKey) {
    return number === 1 ? wordKey[0] : number >= 2 && number <= 4 ? wordKey[1] : wordKey[2];
  },
  translate: function translate(number, withoutSuffix, key) {
    var wordKey = translator$2.words[key];
    if (key.length === 1) {
      return withoutSuffix ? wordKey[0] : wordKey[1];
    }
    return number + ' ' + translator$2.correctGrammaticalCase(number, wordKey);
  }
};

var sr = {
  months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
  monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
  monthsParseExact: true,
  weekdays: 'nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota'.split('_'),
  weekdaysShort: 'ned._pon._uto._sre._čet._pet._sub.'.split('_'),
  weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY H:mm',
    LLLL: 'dddd, D. MMMM YYYY H:mm'
  },
  calendar: {
    sameDay: '[danas u] LT',
    nextDay: '[sutra u] LT',
    nextWeek: function nextWeek() {
      switch (this.day()) {
        case 0:
          return '[u] [nedelju] [u] LT';
        case 3:
          return '[u] [sredu] [u] LT';
        case 6:
          return '[u] [subotu] [u] LT';
        case 1:
        case 2:
        case 4:
        case 5:
          return '[u] dddd [u] LT';
      }
    },

    lastDay: '[juče u] LT',
    lastWeek: function lastWeek() {
      var lastWeekDays = ['[prošle] [nedelje] [u] LT', '[prošlog] [ponedeljka] [u] LT', '[prošlog] [utorka] [u] LT', '[prošle] [srede] [u] LT', '[prošlog] [četvrtka] [u] LT', '[prošlog] [petka] [u] LT', '[prošle] [subote] [u] LT'];
      return lastWeekDays[this.day()];
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'za %s',
    past: 'pre %s',
    s: 'nekoliko sekundi',
    m: translator$2.translate,
    mm: translator$2.translate,
    h: translator$2.translate,
    hh: translator$2.translate,
    d: 'dan',
    dd: translator$2.translate,
    M: 'mesec',
    MM: translator$2.translate,
    y: 'godinu',
    yy: translator$2.translate
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : siSwati [ss]
//! author : Nicolai Davies<mail@nicolai.io> : https://github.com/nicolaidavies
/* jshint -W100 */

var ss = {
  months: "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split('_'),
  monthsShort: 'Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo'.split('_'),
  weekdays: 'Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo'.split('_'),
  weekdaysShort: 'Lis_Umb_Lsb_Les_Lsi_Lsh_Umg'.split('_'),
  weekdaysMin: 'Li_Us_Lb_Lt_Ls_Lh_Ug'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY h:mm A',
    LLLL: 'dddd, D MMMM YYYY h:mm A'
  },
  calendar: {
    sameDay: '[Namuhla nga] LT',
    nextDay: '[Kusasa nga] LT',
    nextWeek: 'dddd [nga] LT',
    lastDay: '[Itolo nga] LT',
    lastWeek: 'dddd [leliphelile] [nga] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'nga %s',
    past: 'wenteka nga %s',
    s: 'emizuzwana lomcane',
    m: 'umzuzu',
    mm: '%d emizuzu',
    h: 'lihora',
    hh: '%d emahora',
    d: 'lilanga',
    dd: '%d emalanga',
    M: 'inyanga',
    MM: '%d tinyanga',
    y: 'umnyaka',
    yy: '%d iminyaka'
  },
  meridiemParse: /ekuseni|emini|entsambama|ebusuku/,
  meridiem: function meridiem(hours, minutes, isLower) {
    if (hours < 11) {
      return 'ekuseni';
    } else if (hours < 15) {
      return 'emini';
    } else if (hours < 19) {
      return 'entsambama';
    }
    return 'ebusuku';
  },
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'ekuseni') {
      return hour;
    } else if (meridiem === 'emini') {
      return hour >= 11 ? hour : hour + 12;
    } else if (meridiem === 'entsambama' || meridiem === 'ebusuku') {
      if (hour === 0) {
        return 0;
      }
      return hour + 12;
    }
  },

  dayOfMonthOrdinalParse: /\d{1,2}/,
  ordinal: '%d',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Swedish [sv]
//! author : Jens Alm : https://github.com/ulmus
/* jshint -W100 */

var sv = {
  months: 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
  monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
  weekdays: 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
  weekdaysShort: 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
  weekdaysMin: 'sö_må_ti_on_to_fr_lö'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY [kl.] HH:mm',
    LLLL: 'dddd D MMMM YYYY [kl.] HH:mm',
    lll: 'D MMM YYYY HH:mm',
    llll: 'ddd D MMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Idag] LT',
    nextDay: '[Imorgon] LT',
    lastDay: '[Igår] LT',
    nextWeek: '[På] dddd LT',
    lastWeek: '[I] dddd[s] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'om %s',
    past: 'för %s sedan',
    s: 'några sekunder',
    m: 'en minut',
    mm: '%d minuter',
    h: 'en timme',
    hh: '%d timmar',
    d: 'en dag',
    dd: '%d dagar',
    M: 'en månad',
    MM: '%d månader',
    y: 'ett år',
    yy: '%d år'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(e|a)/,
  ordinal: function ordinal(number) {
    var b = number % 10;
    var output = ~~(number % 100 / 10) === 1 ? 'e' : b === 1 ? 'a' : b === 2 ? 'a' : b === 3 ? 'e' : 'e';
    return number + output;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Swahili [sw]
//! author : Fahad Kassim : https://github.com/fadsel
/* jshint -W100 */

var sw = {
  months: 'Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba'.split('_'),
  monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des'.split('_'),
  weekdays: 'Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi'.split('_'),
  weekdaysShort: 'Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos'.split('_'),
  weekdaysMin: 'J2_J3_J4_J5_Al_Ij_J1'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[leo saa] LT',
    nextDay: '[kesho saa] LT',
    nextWeek: '[wiki ijayo] dddd [saat] LT',
    lastDay: '[jana] LT',
    lastWeek: '[wiki iliyopita] dddd [saat] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s baadaye',
    past: 'tokea %s',
    s: 'hivi punde',
    m: 'dakika moja',
    mm: 'dakika %d',
    h: 'saa limoja',
    hh: 'masaa %d',
    d: 'siku moja',
    dd: 'masiku %d',
    M: 'mwezi mmoja',
    MM: 'miezi %d',
    y: 'mwaka mmoja',
    yy: 'miaka %d'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Tamil [ta]
//! author : Arjunkumar Krishnamoorthy : https://github.com/tk120404
/* jshint -W100 */

var symbolMap$13 = {
  1: '௧',
  2: '௨',
  3: '௩',
  4: '௪',
  5: '௫',
  6: '௬',
  7: '௭',
  8: '௮',
  9: '௯',
  0: '௦'
};

var numberMap$12 = {
  '௧': '1',
  '௨': '2',
  '௩': '3',
  '௪': '4',
  '௫': '5',
  '௬': '6',
  '௭': '7',
  '௮': '8',
  '௯': '9',
  '௦': '0'
};

var ta = {
  months: 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
  monthsShort: 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
  weekdays: 'ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை'.split('_'),
  weekdaysShort: 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split('_'),
  weekdaysMin: 'ஞா_தி_செ_பு_வி_வெ_ச'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY, HH:mm',
    LLLL: 'dddd, D MMMM YYYY, HH:mm'
  },
  calendar: {
    sameDay: '[இன்று] LT',
    nextDay: '[நாளை] LT',
    nextWeek: 'dddd, LT',
    lastDay: '[நேற்று] LT',
    lastWeek: '[கடந்த வாரம்] dddd, LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s இல்',
    past: '%s முன்',
    s: 'ஒரு சில விநாடிகள்',
    m: 'ஒரு நிமிடம்',
    mm: '%d நிமிடங்கள்',
    h: 'ஒரு மணி நேரம்',
    hh: '%d மணி நேரம்',
    d: 'ஒரு நாள்',
    dd: '%d நாட்கள்',
    M: 'ஒரு மாதம்',
    MM: '%d மாதங்கள்',
    y: 'ஒரு வருடம்',
    yy: '%d ஆண்டுகள்'
  },
  dayOfMonthOrdinalParse: /\d{1,2}வது/,
  ordinal: function ordinal(number) {
    return number + '\u0BB5\u0BA4\u0BC1';
  },
  preparse: function preparse(string) {
    return string.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function (match) {
      return numberMap$12[match];
    });
  },
  postformat: function postformat(string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap$13[match];
    });
  },

  // refer http://ta.wikipedia.org/s/1er1
  meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 2) {
      return ' யாமம்';
    } else if (hour < 6) {
      return ' வைகறை'; // வைகறை
    } else if (hour < 10) {
      return ' காலை'; // காலை
    } else if (hour < 14) {
      return ' நண்பகல்'; // நண்பகல்
    } else if (hour < 18) {
      return ' எற்பாடு'; // எற்பாடு
    } else if (hour < 22) {
      return ' மாலை'; // மாலை
    }
    return ' யாமம்';
  },
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'யாமம்') {
      return hour < 2 ? hour : hour + 12;
    } else if (meridiem === 'வைகறை' || meridiem === 'காலை') {
      return hour;
    } else if (meridiem === 'நண்பகல்') {
      return hour >= 10 ? hour : hour + 12;
    }
    return hour + 12;
  },

  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Telugu [te]
//! author : Krishna Chaitanya Thota : https://github.com/kcthota
/* jshint -W100 */

var te = {
  months: 'జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జూలై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్'.split('_'),
  monthsShort: 'జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జూలై_ఆగ._సెప్._అక్టో._నవ._డిసె.'.split('_'),
  monthsParseExact: true,
  weekdays: 'ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం'.split('_'),
  weekdaysShort: 'ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని'.split('_'),
  weekdaysMin: 'ఆ_సో_మం_బు_గు_శు_శ'.split('_'),
  longDateFormat: {
    LT: 'A h:mm',
    LTS: 'A h:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY, A h:mm',
    LLLL: 'dddd, D MMMM YYYY, A h:mm'
  },
  calendar: {
    sameDay: '[నేడు] LT',
    nextDay: '[రేపు] LT',
    nextWeek: 'dddd, LT',
    lastDay: '[నిన్న] LT',
    lastWeek: '[గత] dddd, LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s లో',
    past: '%s క్రితం',
    s: 'కొన్ని క్షణాలు',
    m: 'ఒక నిమిషం',
    mm: '%d నిమిషాలు',
    h: 'ఒక గంట',
    hh: '%d గంటలు',
    d: 'ఒక రోజు',
    dd: '%d రోజులు',
    M: 'ఒక నెల',
    MM: '%d నెలలు',
    y: 'ఒక సంవత్సరం',
    yy: '%d సంవత్సరాలు'
  },
  dayOfMonthOrdinalParse: /\d{1,2}వ/,
  ordinal: '%dవ',
  meridiemParse: /రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === 'రాత్రి') {
      return hour < 4 ? hour : hour + 12;
    } else if (meridiem === 'ఉదయం') {
      return hour;
    } else if (meridiem === 'మధ్యాహ్నం') {
      return hour >= 10 ? hour : hour + 12;
    } else if (meridiem === 'సాయంత్రం') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'రాత్రి';
    } else if (hour < 10) {
      return 'ఉదయం';
    } else if (hour < 17) {
      return 'మధ్యాహ్నం';
    } else if (hour < 20) {
      return 'సాయంత్రం';
    }
    return 'రాత్రి';
  },

  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Tetun Dili (East Timor) [tet]
//! author : Joshua Brooks : https://github.com/joshbrooks
//! author : Onorio De J. Afonso : https://github.com/marobo
/* jshint -W100 */

var tet = {
  months: 'Janeiru_Fevereiru_Marsu_Abril_Maiu_Juniu_Juliu_Augustu_Setembru_Outubru_Novembru_Dezembru'.split('_'),
  monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Aug_Set_Out_Nov_Dez'.split('_'),
  weekdays: 'Domingu_Segunda_Tersa_Kuarta_Kinta_Sexta_Sabadu'.split('_'),
  weekdaysShort: 'Dom_Seg_Ters_Kua_Kint_Sext_Sab'.split('_'),
  weekdaysMin: 'Do_Seg_Te_Ku_Ki_Sex_Sa'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Ohin iha] LT',
    nextDay: '[Aban iha] LT',
    nextWeek: 'dddd [iha] LT',
    lastDay: '[Horiseik iha] LT',
    lastWeek: 'dddd [semana kotuk] [iha] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'iha %s',
    past: '%s liuba',
    s: 'minutu balun',
    m: 'minutu ida',
    mm: 'minutus %d',
    h: 'horas ida',
    hh: 'horas %d',
    d: 'loron ida',
    dd: 'loron %d',
    M: 'fulan ida',
    MM: 'fulan %d',
    y: 'tinan ida',
    yy: 'tinan %d'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
  ordinal: function ordinal(number) {
    var b = number % 10;
    var output = ~~(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
    return number + output;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Thai [th]
//! author : Kridsada Thanabulpong : https://github.com/sirn
/* jshint -W100 */

var th = {
  months: 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split('_'),
  monthsShort: 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'),
  monthsParseExact: true,
  weekdays: 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
  weekdaysShort: 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์'.split('_'), // yes, three characters difference
  weekdaysMin: 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY เวลา H:mm',
    LLLL: 'วันddddที่ D MMMM YYYY เวลา H:mm'
  },
  meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
  isPM: function isPM(input) {
    return input === 'หลังเที่ยง';
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 12) {
      return 'ก่อนเที่ยง';
    }
    return 'หลังเที่ยง';
  },

  calendar: {
    sameDay: '[วันนี้ เวลา] LT',
    nextDay: '[พรุ่งนี้ เวลา] LT',
    nextWeek: 'dddd[หน้า เวลา] LT',
    lastDay: '[เมื่อวานนี้ เวลา] LT',
    lastWeek: '[วัน]dddd[ที่แล้ว เวลา] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'อีก %s',
    past: '%sที่แล้ว',
    s: 'ไม่กี่วินาที',
    m: '1 นาที',
    mm: '%d นาที',
    h: '1 ชั่วโมง',
    hh: '%d ชั่วโมง',
    d: '1 วัน',
    dd: '%d วัน',
    M: '1 เดือน',
    MM: '%d เดือน',
    y: '1 ปี',
    yy: '%d ปี'
  }
};

//! now.js locale configuration
//! locale : Tagalog (Philippines) [tl-ph]
//! author : Dan Hagman : https://github.com/hagmandan
/* jshint -W100 */

var tlph = {
  months: 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
  monthsShort: 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
  weekdays: 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
  weekdaysShort: 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
  weekdaysMin: 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'MM/D/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY HH:mm',
    LLLL: 'dddd, MMMM DD, YYYY HH:mm'
  },
  calendar: {
    sameDay: 'LT [ngayong araw]',
    nextDay: '[Bukas ng] LT',
    nextWeek: 'LT [sa susunod na] dddd',
    lastDay: 'LT [kahapon]',
    lastWeek: 'LT [noong nakaraang] dddd',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'sa loob ng %s',
    past: '%s ang nakalipas',
    s: 'ilang segundo',
    m: 'isang minuto',
    mm: '%d minuto',
    h: 'isang oras',
    hh: '%d oras',
    d: 'isang araw',
    dd: '%d araw',
    M: 'isang buwan',
    MM: '%d buwan',
    y: 'isang taon',
    yy: '%d taon'
  },
  dayOfMonthOrdinalParse: /\d{1,2}/,
  ordinal: function ordinal(number) {
    return number;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Klingon [tlh]
//! author : Dominika Kruk : https://github.com/amaranthrose
/* jshint -W100 */

var numbersNouns = 'pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut'.split('_');

function translateFuture(output) {
  var time = output;
  time = output.indexOf('jaj') !== -1 ? time.slice(0, -3) + 'leS' : output.indexOf('jar') !== -1 ? time.slice(0, -3) + 'waQ' : output.indexOf('DIS') !== -1 ? time.slice(0, -3) + 'nem' : time + ' pIq';
  return time;
}

function translatePast(output) {
  var time = output;
  time = output.indexOf('jaj') !== -1 ? time.slice(0, -3) + 'Hu\u2019' : output.indexOf('jar') !== -1 ? time.slice(0, -3) + 'wen' : output.indexOf('DIS') !== -1 ? time.slice(0, -3) + 'ben' : time + ' ret';
  return time;
}

function translate$9(number, withoutSuffix, string, isFuture) {
  var numberNoun = numberAsNoun(number);
  switch (string) {
    case 'mm':
      return numberNoun + ' tup';
    case 'hh':
      return numberNoun + ' rep';
    case 'dd':
      return numberNoun + ' jaj';
    case 'MM':
      return numberNoun + ' jar';
    case 'yy':
      return numberNoun + ' DIS';
  }
}

function numberAsNoun(number) {
  var hundred = Math.floor(number % 1000 / 100);
  var ten = Math.floor(number % 100 / 10);
  var one = number % 10;
  var word = '';
  if (hundred > 0) {
    word += numbersNouns[hundred] + 'vatlh';
  }
  if (ten > 0) {
    word += (word !== '' ? ' ' : '') + numbersNouns[ten] + 'maH';
  }
  if (one > 0) {
    word += (word !== '' ? ' ' : '') + numbersNouns[one];
  }
  return word === '' ? 'pagh' : word;
}

var tlh = {
  months: 'tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’'.split('_'),
  monthsShort: 'jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’'.split('_'),
  monthsParseExact: true,
  weekdays: 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
  weekdaysShort: 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
  weekdaysMin: 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[DaHjaj] LT',
    nextDay: '[wa’leS] LT',
    nextWeek: 'LLL',
    lastDay: '[wa’Hu’] LT',
    lastWeek: 'LLL',
    sameElse: 'L'
  },
  relativeTime: {
    future: translateFuture,
    past: translatePast,
    s: 'puS lup',
    m: 'wa’ tup',
    mm: translate$9,
    h: 'wa’ rep',
    hh: translate$9,
    d: 'wa’ jaj',
    dd: translate$9,
    M: 'wa’ jar',
    MM: translate$9,
    y: 'wa’ DIS',
    yy: translate$9
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Turkish [tr]
//! authors : Erhan Gundogan : https://github.com/erhangundogan,
//!           Burak Yiğit Kaya: https://github.com/BYK
/* jshint -W100 */

var suffixes$3 = {
  1: '\'inci',
  5: '\'inci',
  8: '\'inci',
  70: '\'inci',
  80: '\'inci',
  2: '\'nci',
  7: '\'nci',
  20: '\'nci',
  50: '\'nci',
  3: '\'üncü',
  4: '\'üncü',
  100: '\'üncü',
  6: '\'ncı',
  9: '\'uncu',
  10: '\'uncu',
  30: '\'uncu',
  60: '\'ıncı',
  90: '\'ıncı'
};

var tr = {
  months: 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
  monthsShort: 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
  weekdays: 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
  weekdaysShort: 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
  weekdaysMin: 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[bugün saat] LT',
    nextDay: '[yarın saat] LT',
    nextWeek: '[gelecek] dddd [saat] LT',
    lastDay: '[dün] LT',
    lastWeek: '[geçen] dddd [saat] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s sonra',
    past: '%s önce',
    s: 'birkaç saniye',
    m: 'bir dakika',
    mm: '%d dakika',
    h: 'bir saat',
    hh: '%d saat',
    d: 'bir gün',
    dd: '%d gün',
    M: 'bir ay',
    MM: '%d ay',
    y: 'bir yıl',
    yy: '%d yıl'
  },
  dayOfMonthOrdinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
  ordinal: function ordinal(number) {
    if (number === 0) {
      // special case for zero
      return number + '\'\u0131nc\u0131';
    }
    var a = number % 10;
    var b = number % 100 - a;
    var c = number >= 100 ? 100 : null;
    return number + (suffixes$3[a] || suffixes$3[b] || suffixes$3[c]);
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Talossan [tzl]
//! author : Robin van der Vliet : https://github.com/robin0van0der0v
//! author : Iustì Canun
/* jshint -W100 */

// After the year there should be a slash and the amount of years since December 26, 1979 in Roman numerals.
// This is currently too difficult (maybe even impossible) to add.
var tzl = {
  months: 'Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar'.split('_'),
  monthsShort: 'Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec'.split('_'),
  weekdays: 'Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi'.split('_'),
  weekdaysShort: 'Súl_Lún_Mai_Már_Xhú_Vié_Sát'.split('_'),
  weekdaysMin: 'Sú_Lú_Ma_Má_Xh_Vi_Sá'.split('_'),
  longDateFormat: {
    LT: 'HH.mm',
    LTS: 'HH.mm.ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM [dallas] YYYY',
    LLL: 'D. MMMM [dallas] YYYY HH.mm',
    LLLL: 'dddd, [li] D. MMMM [dallas] YYYY HH.mm'
  },
  meridiemParse: /d\'o|d\'a/i,
  isPM: function isPM(input) {
    return input.toLowerCase() === 'd\'o';
  },
  meridiem: function meridiem(hours, minutes, isLower) {
    if (hours > 11) {
      return isLower ? 'd\'o' : 'D\'O';
    }
    return isLower ? 'd\'a' : 'D\'A';
  },

  calendar: {
    sameDay: '[oxhi à] LT',
    nextDay: '[demà à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[ieiri à] LT',
    lastWeek: '[sür el] dddd [lasteu à] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'osprei %s',
    past: 'ja%s',
    s: processRelativeTime$7,
    m: processRelativeTime$7,
    mm: processRelativeTime$7,
    h: processRelativeTime$7,
    hh: processRelativeTime$7,
    d: processRelativeTime$7,
    dd: processRelativeTime$7,
    M: processRelativeTime$7,
    MM: processRelativeTime$7,
    y: processRelativeTime$7,
    yy: processRelativeTime$7
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

function processRelativeTime$7(number, withoutSuffix, key, isFuture) {
  var format = {
    s: ['viensas secunds', '\'iensas secunds'],
    m: ['\'n míut', '\'iens míut'],
    mm: [number + ' m\xEDuts', number + ' m\xEDuts'],
    h: ['\'n þora', '\'iensa þora'],
    hh: [number + ' \xFEoras', number + ' \xFEoras'],
    d: ['\'n ziua', '\'iensa ziua'],
    dd: [number + ' ziuas', number + ' ziuas'],
    M: ['\'n mes', '\'iens mes'],
    MM: [number + ' mesen', number + ' mesen'],
    y: ['\'n ar', '\'iens ar'],
    yy: [number + ' ars', number + ' ars']
  };
  return isFuture ? format[key][0] : withoutSuffix ? format[key][0] : format[key][1];
}

//! now.js locale configuration
//! locale : Central Atlas Tamazight Latin [tzm-latn]
//! author : Abdel Said : https://github.com/abdelsaid
/* jshint -W100 */

var tzmlatn = {
  months: 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
  monthsShort: 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
  weekdays: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
  weekdaysShort: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
  weekdaysMin: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[asdkh g] LT',
    nextDay: '[aska g] LT',
    nextWeek: 'dddd [g] LT',
    lastDay: '[assant g] LT',
    lastWeek: 'dddd [g] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'dadkh s yan %s',
    past: 'yan %s',
    s: 'imik',
    m: 'minuḍ',
    mm: '%d minuḍ',
    h: 'saɛa',
    hh: '%d tassaɛin',
    d: 'ass',
    dd: '%d ossan',
    M: 'ayowr',
    MM: '%d iyyirn',
    y: 'asgas',
    yy: '%d isgasn'
  },
  week: {
    dow: 6, // Saturday is the first day of the week.
    doy: 12 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Central Atlas Tamazight [tzm]
//! author : Abdel Said : https://github.com/abdelsaid
/* jshint -W100 */

var tzm = {
  months: 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
  monthsShort: 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
  weekdays: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
  weekdaysShort: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
  weekdaysMin: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[ⴰⵙⴷⵅ ⴴ] LT',
    nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
    nextWeek: 'dddd [ⴴ] LT',
    lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
    lastWeek: 'dddd [ⴴ] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s',
    past: 'ⵢⴰⵏ %s',
    s: 'ⵉⵎⵉⴽ',
    m: 'ⵎⵉⵏⵓⴺ',
    mm: '%d ⵎⵉⵏⵓⴺ',
    h: 'ⵙⴰⵄⴰ',
    hh: '%d ⵜⴰⵙⵙⴰⵄⵉⵏ',
    d: 'ⴰⵙⵙ',
    dd: '%d oⵙⵙⴰⵏ',
    M: 'ⴰⵢoⵓⵔ',
    MM: '%d ⵉⵢⵢⵉⵔⵏ',
    y: 'ⴰⵙⴳⴰⵙ',
    yy: '%d ⵉⵙⴳⴰⵙⵏ'
  },
  week: {
    dow: 6, // Saturday is the first day of the week.
    doy: 12 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Ukrainian [uk]
//! author : zemlanin : https://github.com/zemlanin
//! Author : Menelion Elensúle : https://github.com/Oire
/* jshint -W100 */

function plural$6(word, num) {
  var forms = word.split('_');
  return num % 10 === 1 && num % 100 !== 11 ? forms[0] : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2];
}

function relativeTimeWithPlural$4(number, withoutSuffix, key) {
  var format = {
    mm: withoutSuffix ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
    hh: withoutSuffix ? 'година_години_годин' : 'годину_години_годин',
    dd: 'день_дні_днів',
    MM: 'місяць_місяці_місяців',
    yy: 'рік_роки_років'
  };
  if (key === 'm') {
    return withoutSuffix ? 'хвилина' : 'хвилину';
  } else if (key === 'h') {
    return withoutSuffix ? 'година' : 'годину';
  }
  return number + ' ' + plural$6(format[key], +number);
}

function weekdaysCaseReplace(m, format) {
  var weekdays = {
    nominative: 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
    accusative: 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
    genitive: 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
  };

  if (!m) {
    return weekdays.nominative;
  }

  var nounCase = /(\[[ВвУу]\]) ?dddd/.test(format) ? 'accusative' : /\[?(?:минулої|наступної)? ?\] ?dddd/.test(format) ? 'genitive' : 'nominative';
  return weekdays[nounCase][m.day()];
}

function processHoursFunction(str) {
  return function () {
    return str + '\u043E' + (this.hours() === 11 ? 'б' : '') + '] LT';
  };
}

var uk = {
  months: {
    format: 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
    standalone: 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_')
  },
  monthsShort: 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
  weekdays: weekdaysCaseReplace,
  weekdaysShort: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
  weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY р.',
    LLL: 'D MMMM YYYY р., HH:mm',
    LLLL: 'dddd, D MMMM YYYY р., HH:mm'
  },
  calendar: {
    sameDay: processHoursFunction('[Сьогодні '),
    nextDay: processHoursFunction('[Завтра '),
    lastDay: processHoursFunction('[Вчора '),
    nextWeek: processHoursFunction('[У] dddd ['),
    lastWeek: function lastWeek() {
      switch (this.day()) {
        case 0:
        case 3:
        case 5:
        case 6:
          return processHoursFunction('[Минулої] dddd [').call(this);
        case 1:
        case 2:
        case 4:
          return processHoursFunction('[Минулого] dddd [').call(this);
      }
    },

    sameElse: 'L'
  },
  relativeTime: {
    future: 'за %s',
    past: '%s тому',
    s: 'декілька секунд',
    m: relativeTimeWithPlural$4,
    mm: relativeTimeWithPlural$4,
    h: 'годину',
    hh: relativeTimeWithPlural$4,
    d: 'день',
    dd: relativeTimeWithPlural$4,
    M: 'місяць',
    MM: relativeTimeWithPlural$4,
    y: 'рік',
    yy: relativeTimeWithPlural$4
  },
  // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
  meridiemParse: /ночі|ранку|дня|вечора/,
  isPM: function isPM(input) {
    return (/^(дня|вечора)$/.test(input)
    );
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 4) {
      return 'ночі';
    } else if (hour < 12) {
      return 'ранку';
    } else if (hour < 17) {
      return 'дня';
    }
    return 'вечора';
  },

  dayOfMonthOrdinalParse: /\d{1,2}-(й|го)/,
  ordinal: function ordinal(number, period) {
    switch (period) {
      case 'M':
      case 'd':
      case 'DDD':
      case 'w':
      case 'W':
        return number + '-\u0439';
      case 'D':
        return number + '-\u0433\u043E';
      default:
        return number;
    }
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Urdu [ur]
//! author : Sawood Alam : https://github.com/ibnesayeed
//! author : Zack : https://github.com/ZackVision
/* jshint -W100 */

var months$7 = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];

var days$2 = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

var ur = {
  months: months$7,
  monthsShort: months$7,
  weekdays: days$2,
  weekdaysShort: days$2,
  weekdaysMin: days$2,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd، D MMMM YYYY HH:mm'
  },
  meridiemParse: /صبح|شام/,
  isPM: function isPM(input) {
    return input === 'شام';
  },
  meridiem: function meridiem(hour, minute, isLower) {
    if (hour < 12) {
      return 'صبح';
    }
    return 'شام';
  },

  calendar: {
    sameDay: '[آج بوقت] LT',
    nextDay: '[کل بوقت] LT',
    nextWeek: 'dddd [بوقت] LT',
    lastDay: '[گذشتہ روز بوقت] LT',
    lastWeek: '[گذشتہ] dddd [بوقت] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s بعد',
    past: '%s قبل',
    s: 'چند سیکنڈ',
    m: 'ایک منٹ',
    mm: '%d منٹ',
    h: 'ایک گھنٹہ',
    hh: '%d گھنٹے',
    d: 'ایک دن',
    dd: '%d دن',
    M: 'ایک ماہ',
    MM: '%d ماہ',
    y: 'ایک سال',
    yy: '%d سال'
  },
  preparse: function preparse(string) {
    return string.replace(/،/g, ',');
  },
  postformat: function postformat(string) {
    return string.replace(/,/g, '،');
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Uzbek Latin [uz-latn]
//! author : Rasulbek Mirzayev : github.com/Rasulbeeek
/* jshint -W100 */

var uzlatn = {
  months: 'Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr'.split('_'),
  monthsShort: 'Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek'.split('_'),
  weekdays: 'Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba'.split('_'),
  weekdaysShort: 'Yak_Dush_Sesh_Chor_Pay_Jum_Shan'.split('_'),
  weekdaysMin: 'Ya_Du_Se_Cho_Pa_Ju_Sha'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'D MMMM YYYY, dddd HH:mm'
  },
  calendar: {
    sameDay: '[Bugun soat] LT [da]',
    nextDay: '[Ertaga] LT [da]',
    nextWeek: 'dddd [kuni soat] LT [da]',
    lastDay: '[Kecha soat] LT [da]',
    lastWeek: '[O\'tgan] dddd [kuni soat] LT [da]',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'Yaqin %s ichida',
    past: 'Bir necha %s oldin',
    s: 'soniya',
    m: 'bir daqiqa',
    mm: '%d daqiqa',
    h: 'bir soat',
    hh: '%d soat',
    d: 'bir kun',
    dd: '%d kun',
    M: 'bir oy',
    MM: '%d oy',
    y: 'bir yil',
    yy: '%d yil'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 1st is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Uzbek [uz]
//! author : Sardor Muminov : https://github.com/muminoff
/* jshint -W100 */

var uz = {
  months: 'январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр'.split('_'),
  monthsShort: 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
  weekdays: 'Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба'.split('_'),
  weekdaysShort: 'Якш_Душ_Сеш_Чор_Пай_Жум_Шан'.split('_'),
  weekdaysMin: 'Як_Ду_Се_Чо_Па_Жу_Ша'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'D MMMM YYYY, dddd HH:mm'
  },
  calendar: {
    sameDay: '[Бугун соат] LT [да]',
    nextDay: '[Эртага] LT [да]',
    nextWeek: 'dddd [куни соат] LT [да]',
    lastDay: '[Кеча соат] LT [да]',
    lastWeek: '[Утган] dddd [куни соат] LT [да]',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'Якин %s ичида',
    past: 'Бир неча %s олдин',
    s: 'фурсат',
    m: 'бир дакика',
    mm: '%d дакика',
    h: 'бир соат',
    hh: '%d соат',
    d: 'бир кун',
    dd: '%d кун',
    M: 'бир ой',
    MM: '%d ой',
    y: 'бир йил',
    yy: '%d йил'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Vietnamese [vi]
//! author : Bang Nguyen : https://github.com/bangnk
/* jshint -W100 */

var vi = {
  months: 'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split('_'),
  monthsShort: 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
  monthsParseExact: true,
  weekdays: 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'),
  weekdaysShort: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
  weekdaysMin: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
  weekdaysParseExact: true,
  meridiemParse: /sa|ch/i,
  isPM: function isPM(input) {
    return (/^ch$/i.test(input)
    );
  },
  meridiem: function meridiem(hours, minutes, isLower) {
    if (hours < 12) {
      return isLower ? 'sa' : 'SA';
    }
    return isLower ? 'ch' : 'CH';
  },

  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM [năm] YYYY',
    LLL: 'D MMMM [năm] YYYY HH:mm',
    LLLL: 'dddd, D MMMM [năm] YYYY HH:mm',
    l: 'DD/M/YYYY',
    ll: 'D MMM YYYY',
    lll: 'D MMM YYYY HH:mm',
    llll: 'ddd, D MMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Hôm nay lúc] LT',
    nextDay: '[Ngày mai lúc] LT',
    nextWeek: 'dddd [tuần tới lúc] LT',
    lastDay: '[Hôm qua lúc] LT',
    lastWeek: 'dddd [tuần rồi lúc] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s tới',
    past: '%s trước',
    s: 'vài giây',
    m: 'một phút',
    mm: '%d phút',
    h: 'một giờ',
    hh: '%d giờ',
    d: 'một ngày',
    dd: '%d ngày',
    M: 'một tháng',
    MM: '%d tháng',
    y: 'một năm',
    yy: '%d năm'
  },
  dayOfMonthOrdinalParse: /\d{1,2}/,
  ordinal: function ordinal(number) {
    return number;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Pseudo [x-pseudo]
//! author : Andrew Hood : https://github.com/andrewhood125
/* jshint -W100 */

var xpseudo = {
  months: 'J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér'.split('_'),
  monthsShort: 'J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc'.split('_'),
  monthsParseExact: true,
  weekdays: 'S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý'.split('_'),
  weekdaysShort: 'S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát'.split('_'),
  weekdaysMin: 'S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[T~ódá~ý át] LT',
    nextDay: '[T~ómó~rró~w át] LT',
    nextWeek: 'dddd [át] LT',
    lastDay: '[Ý~ést~érdá~ý át] LT',
    lastWeek: '[L~ást] dddd [át] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'í~ñ %s',
    past: '%s á~gó',
    s: 'á ~féw ~sécó~ñds',
    m: 'á ~míñ~úté',
    mm: '%d m~íñú~tés',
    h: 'á~ñ hó~úr',
    hh: '%d h~óúrs',
    d: 'á ~dáý',
    dd: '%d d~áýs',
    M: 'á ~móñ~th',
    MM: '%d m~óñt~hs',
    y: 'á ~ýéár',
    yy: '%d ý~éárs'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
  ordinal: function ordinal(number) {
    var b = number % 10;
    var output = ~~(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
    return number + output;
  },

  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Yoruba Nigeria [yo]
//! author : Atolagbe Abisoye : https://github.com/andela-batolagbe
/* jshint -W100 */

var yo = {
  months: 'Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀'.split('_'),
  monthsShort: 'Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀'.split('_'),
  weekdays: 'Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta'.split('_'),
  weekdaysShort: 'Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá'.split('_'),
  weekdaysMin: 'Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb'.split('_'),
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY h:mm A',
    LLLL: 'dddd, D MMMM YYYY h:mm A'
  },
  calendar: {
    sameDay: '[Ònì ni] LT',
    nextDay: '[Ọ̀la ni] LT',
    nextWeek: 'dddd [Ọsẹ̀ tón\'bọ] [ni] LT',
    lastDay: '[Àna ni] LT',
    lastWeek: 'dddd [Ọsẹ̀ tólọ́] [ni] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'ní %s',
    past: '%s kọjá',
    s: 'ìsẹjú aayá die',
    m: 'ìsẹjú kan',
    mm: 'ìsẹjú %d',
    h: 'wákati kan',
    hh: 'wákati %d',
    d: 'ọjọ́ kan',
    dd: 'ọjọ́ %d',
    M: 'osù kan',
    MM: 'osù %d',
    y: 'ọdún kan',
    yy: 'ọdún %d'
  },
  dayOfMonthOrdinalParse: /ọjọ́\s\d{1,2}/,
  ordinal: 'ọjọ́ %d',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
};

//! now.js locale configuration
//! locale : Chinese (China) [zh-cn]
//! author : suupic : https://github.com/suupic
//! author : Zeno Zeng : https://github.com/zenozeng
/* jshint -W100 */

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
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
      return hour;
    } else if (meridiem === '下午' || meridiem === '晚上') {
      return hour + 12;
    }
    // '中午'
    return hour >= 11 ? hour : hour + 12;
  },
  meridiem: function meridiem(hour, minute, isLower) {
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

//! now.js locale configuration
//! locale : Chinese (Hong Kong) [zh-hk]
//! author : Ben : https://github.com/ben-lin
//! author : Chris Lam : https://github.com/hehachris
//! author : Konstantin : https://github.com/skfd
/* jshint -W100 */

var zhhk = {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY年MMMD日',
    LL: 'YYYY年MMMD日',
    LLL: 'YYYY年MMMD日 HH:mm',
    LLLL: 'YYYY年MMMD日dddd HH:mm',
    l: 'YYYY年MMMD日',
    ll: 'YYYY年MMMD日',
    lll: 'YYYY年MMMD日 HH:mm',
    llll: 'YYYY年MMMD日dddd HH:mm'
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
      return hour;
    } else if (meridiem === '中午') {
      return hour >= 11 ? hour : hour + 12;
    } else if (meridiem === '下午' || meridiem === '晚上') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hour, minute, isLower) {
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
  dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
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
        return number + '\u9031';
      default:
        return number;
    }
  },

  relativeTime: {
    future: '%s內',
    past: '%s前',
    s: '幾秒',
    m: '1 分鐘',
    mm: '%d 分鐘',
    h: '1 小時',
    hh: '%d 小時',
    d: '1 天',
    dd: '%d 天',
    M: '1 個月',
    MM: '%d 個月',
    y: '1 年',
    yy: '%d 年'
  }
};

//! now.js locale configuration
//! locale : Chinese (Taiwan) [zh-tw]
//! author : Ben : https://github.com/ben-lin
//! author : Chris Lam : https://github.com/hehachris
/* jshint -W100 */

var zhtw = {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY年MMMD日',
    LL: 'YYYY年MMMD日',
    LLL: 'YYYY年MMMD日 HH:mm',
    LLLL: 'YYYY年MMMD日dddd HH:mm',
    l: 'YYYY年MMMD日',
    ll: 'YYYY年MMMD日',
    lll: 'YYYY年MMMD日 HH:mm',
    llll: 'YYYY年MMMD日dddd HH:mm'
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
      return hour;
    } else if (meridiem === '中午') {
      return hour >= 11 ? hour : hour + 12;
    } else if (meridiem === '下午' || meridiem === '晚上') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hour, minute, isLower) {
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
  dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
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
        return number + '\u9031';
      default:
        return number;
    }
  },

  relativeTime: {
    future: '%s內',
    past: '%s前',
    s: '幾秒',
    m: '1 分鐘',
    mm: '%d 分鐘',
    h: '1 小時',
    hh: '%d 小時',
    d: '1 天',
    dd: '%d 天',
    M: '1 個月',
    MM: '%d 個月',
    y: '1 年',
    yy: '%d 年'
  }
};

var i18ns = {
  'af': af,
  'ar-dz': ardz,
  'ar-kw': arkw,
  'ar-ly': arly,
  'ar-ma': arma,
  'ar-sa': arsa,
  'ar-tn': artn,
  'ar': ar,
  'az': az,
  'be': be,
  'bg': bg,
  'bm': bm,
  'bn': bn,
  'bo': bo,
  'br': br,
  'bs': bs,
  'ca': ca,
  'cs': cs,
  'cv': cv,
  'cy': cy,
  'da': da,
  'de-at': deat,
  'de-ch': dech,
  'de': de,
  'dv': dv,
  'el': el,
  'en-au': enau,
  'en-ca': enca,
  'en-gb': engb,
  'en-ie': enie,
  'en-nz': ennz,
  'eo': eo,
  'es-do': esdo,
  'es-us': esus,
  'es': es,
  'et': et,
  'eu': eu,
  'fa': fa,
  'fi': fi,
  'fo': fo,
  'fr-ca': frca,
  'fr-ch': frch,
  'fr': fr,
  'fy': fy,
  'gd': gd,
  'gl': gl,
  'gom-latn': gomlatn,
  'gu': gu,
  'he': he,
  'hi': hi,
  'hr': hr,
  'hu': hu,
  'hy-am': hyam,
  'id': id,
  'is': is,
  'it': it,
  'ja': ja,
  'jv': jv,
  'ka': ka,
  'kk': kk,
  'km': km,
  'kn': kn,
  'ko': ko,
  'ky': ky,
  'lb': lb,
  'lo': lo,
  'lt': lt,
  'lv': lv,
  'me': me,
  'mi': mi,
  'mk': mk,
  'ml': ml,
  'mr': mr,
  'ms-my': msmy,
  'ms': ms,
  'my': my,
  'nb': nb,
  'ne': ne,
  'nl-be': nlbe,
  'nl': nl,
  'nn': nn,
  'pa-in': pain,
  'pl': pl,
  'pt-br': ptbr,
  'pt': pt,
  'ro': ro,
  'ru': ru,
  'sd': sd,
  'se': se,
  'si': si,
  'sk': sk,
  'sl': sl,
  'sq': sq,
  'sr-cyrl': srcyrl,
  'sr': sr,
  'ss': ss,
  'sv': sv,
  'sw': sw,
  'ta': ta,
  'te': te,
  'tet': tet,
  'th': th,
  'tl-ph': tlph,
  'tlh': tlh,
  'tr': tr,
  'tzl': tzl,
  'tzm-latn': tzmlatn,
  'tzm': tzm,
  'uk': uk,
  'ur': ur,
  'uz-latn': uzlatn,
  'uz': uz,
  'vi': vi,
  'x-pseudo': xpseudo,
  'yo': yo,
  'zh-cn': zhcn,
  'zh-hk': zhhk,
  'zh-tw': zhtw
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

function isNaN$1(value) {
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
  if (!locales[name]) {
    oldLocale = globalLocale && globalLocale._abbr;
    defineLocale(name, i18ns[name]);
    getSetGlobalLocale(oldLocale);
  }
  return locales[name];
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
      // moment.duration._locale = moment._locale = data;
      globalLocale = data;
    }
  }

  // return globalLocale._abbr;
}

function defineLocale(name, config) {
  if (config !== null) {
    var parentConfig = baseConfig;
    config.abbr = name;
    if (locales[name] != null) {
      deprecateSimple('defineLocaleOverride', 'use Now.updateLocale(localeName, config) to change ' + 'an existing locale. Now.defineLocale(localeName, ' + 'config) should only be used for creating a new locale');

      parentConfig = locales[name]._config;
    } else if (config.parentLocale != null) {
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
    locales[name] = new Locale(mergeConfigs(parentConfig, config));

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
    locale = loadLocale(key);
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
  return isNaN$1(input) ? null : input;
};

var parseWeekday = function parseWeekday(input, locale) {
  if (isString(input)) {
    return input;
  }

  if (!isNaN$1(input)) {
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
          return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
      }
      if (ordinal) {
        this.formatTokenFunctions[ordinal] = function () {
          return this.localeData().ordinal(func.apply(this, arguments), token);
        };
      }
    }
  }, {
    key: 'makeFormatFunction',
    value: function makeFormatFunction(format) {
      var array = format.match(this.formattingTokens);
      var i = void 0;
      var length = void 0;

      for (i = 0, length = array.length; i < length; i++) {
        if (this.formatTokenFunctions[array[i]]) {
          array[i] = this.formatTokenFunctions[array[i]];
        } else {
          array[i] = removeFormattingTokens(array[i]);
        }
      }

      return function (context) {
        var output = '';
        var i = void 0;
        for (i = 0; i < length; i++) {
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

      format = this.expandFormat(format, context.localeData());
      this.formatFunctions[format] = this.formatFunctions[format] || this.makeFormatFunction(format);

      return this.formatFunctions[format](context);
    }
  }, {
    key: 'expandFormat',
    value: function expandFormat(format, locale) {
      var i = 5;

      function replaceLongDateFormatTokens(input) {
        return locale.longDateFormat(input) || input;
      }

      this.localFormattingTokens.lastIndex = 0;
      while (i >= 0 && this.localFormattingTokens.test(format)) {
        format = format.replace(this.localFormattingTokens, replaceLongDateFormatTokens);
        this.localFormattingTokens.lastIndex = 0;
        i -= 1;
      }

      return format;
    }
  }]);
  return Format;
}();

var format$1 = new Format();

var VERSION = '0.1.0';
var SECOND = 1000;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
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
    this._format = format$1;
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
          dayObj = that.computeBeginningOfWeek().addDays(-(7 - _offset));
          return val && val === 'self' ? dayObj : dayObj.format('YYYY-MM-DD HH:mm:ss');
        }
        // today is not sunday, so get after sunday
        var offset = index;
        if (index === 0) {
          offset = 7;
        }
        dayObj = that.computeBeginningOfWeek().addDays(offset);
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
        var isoWeekDay = parseIsoWeekday(val, this.localeData());
        return this.day(this.day() === 0 ? isoWeekDay - 7 : isoWeekDay);
      } else {
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
        default:
          return this;
      }
    }
  }, {
    key: 'format',
    value: function format(obj) {
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
    value: function beginningOfMinute(val) {
      return val && val === 'self' ? this.computeBeginningOfMinute() : this.computeBeginningOfMinute().format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'beginningOfHour',
    value: function beginningOfHour(val) {
      return val && val === 'self' ? this.computeBeginningOfHour() : this.computeBeginningOfHour().format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'beginningOfDay',
    value: function beginningOfDay(val) {
      return val && val === 'self' ? this.computeBeginningOfDay() : this.computeBeginningOfDay().format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'beginningOfWeek',
    value: function beginningOfWeek(val) {
      return val && val === 'self' ? this.computeBeginningOfWeek() : this.computeBeginningOfWeek().format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'beginningOfMonth',
    value: function beginningOfMonth(val) {
      return val && val === 'self' ? this.computeBeginningOfMonth() : this.computeBeginningOfMonth().format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'beginningOfQuarter',
    value: function beginningOfQuarter(val) {
      return val && val === 'self' ? this.computeBeginningOfQuarter() : this.computeBeginningOfQuarter().format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'beginningOfYear',
    value: function beginningOfYear(val) {
      return val && val === 'self' ? this.computeBeginningOfYear() : this.computeBeginningOfYear().format('YYYY-MM-DD HH:mm:ss');
    }
  }, {
    key: 'endOfMinute',
    value: function endOfMinute(val) {
      var clone = this.clone().computeBeginningOfMinute().addMilliSeconds(MINUTE - 1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfHour',
    value: function endOfHour(val) {
      var clone = this.clone().computeBeginningOfHour().addMilliSeconds(HOUR - 1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfDay',
    value: function endOfDay(val) {
      var clone = this.clone().computeBeginningOfDay().addMilliSeconds(DAY - 1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfWeek',
    value: function endOfWeek(val) {
      var clone = this.clone();
      clone.firstDayMonday = this.firstDayMonday;
      var computed = clone.computeBeginningOfWeek().addMilliSeconds(7 * DAY - 1);
      return val && val === 'self' ? computed : computed.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfMonth',
    value: function endOfMonth(val) {
      var clone = this.clone().computeBeginningOfMonth().addMonths(1).addMilliSeconds(-1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfQuarter',
    value: function endOfQuarter(val) {
      var clone = this.clone().computeBeginningOfQuarter().addMonths(3).addMilliSeconds(-1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'endOfYear',
    value: function endOfYear(val) {
      var clone = this.clone().computeBeginningOfYear().addYears(1).addMilliSeconds(-1);
      return val && val === 'self' ? clone : clone.format('YYYY-MM-DD HH:mm:ss.SSS');
    }
  }, {
    key: 'dayOfYear',
    value: function dayOfYear() {
      return Math.round((this.beginningOfDay('self').date - this.beginningOfYear('self').date) / DAY) + 1;
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
      return this instanceof Now;
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
      return this.isAfter(date1) && this.isBefore(date2);
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

initLocale();

return Now$1;

})));
//# sourceMappingURL=nowjs.js.map
