/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
/* eslint prefer-destructuring: ["error", { "object": false }] */
/* eslint no-void: 0 */
/* global isFinite */

const ArrayProto = Array.prototype;
const toString = Object.prototype.toString;
const nativeIsArray = Array.isArray;
const nativeIndexOf = ArrayProto.indexOf;
const hasOwnProperty = Object.prototype.hasOwnProperty;

const matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

export const nativeDatetoISOString = Date.prototype.toISOString;

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
const MAX_ARRAY_INDEX = (2 ** 53) - 1;
export const slice = ArrayProto.slice;
export const invalidDateError = 'Invalid Date';
export const invalidDateRegExp = /Invalid Date/;
export const defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
export const defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';
export const defaultWeekdaysRegex = matchWord;
export const defaultWeekdaysShortRegex = matchWord;
export const defaultWeekdaysMinRegex = matchWord;
export const matchOffset = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
export const matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

export function isDate(value) {
  return value instanceof Date || toString.call(value) === '[object Date]';
}

export function isString(value) {
  return typeof value === 'string' || toString.call(value) === '[object String]';
}

export function isNumber(value) {
  return typeof value === 'number' || toString.call(value) === '[object Number]';
}

export function isNaN(value) {
  return isNumber && value !== +value;
}

export function isUndefined(value) {
  return value === void 0;
}

export function isFunction(value) {
  return value instanceof Function || toString.call(value) === '[object Function]';
}

export function isArray(value) {
  return nativeIsArray(value) || toString.call(value) === '[object Array]';
}

export function isObject(value) {
  // return value === Object(value);
  return value != null && Object.prototype.toString.call(value) === '[object Object]';
}

export function isArguments(value) {
  return toString.call(value) === '[object Arguments]';
}

export function zeroFill(number, targetLength, forceSign) {
  const absNumber = `${Math.abs(number)}`;
  const zeroToFill = targetLength - absNumber.length;
  const sign = number >= 0;
  return (sign ? (forceSign ? '+' : '') : '-') +
    (10 ** Math.max(0, zeroToFill)).toString().substr(1) + absNumber;
}

const isArrayLike = (obj) => {
  const len = obj.length;
  return typeof len === 'number' && len >= 0 && len < MAX_ARRAY_INDEX;
};

const baseFlatten = (input, shallow, strict, output) => {
  const res = output || [];
  const inputLen = input.length;
  let idx = res.length;
  let i;

  for (i = 0; i < inputLen; i += 1) {
    const value = input[i];

    if ((isArrayLike(value) && isArray(value)) || isArguments(value)) {
      if (shallow) {
        let j = 0;
        const len = value.length;

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

export const flatten = (array, shallow) => baseFlatten(array, shallow, false);

export function has(obj, key) {
  return hasOwnProperty.call(obj, key);
}

export const keys = Object.keys || function (obj) {
  let i;
  const res = [];
  /* eslint no-restricted-syntax: ["error", "BinaryExpression[operator='in']"] */
  for (i in obj) {
    if (has(obj, i)) {
      res[res.length] = i;
    }
  }
  return res;
};

export function absCeil(number) {
  return number < 0 ? Math.floor(number) : Math.ceil(number);
}

export function absFloor(number) {
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

export function absRound(number) {
  return number < 0 ? Math.round(-1 * number) * -1 : Math.round(number);
}

// 400 years have 146097 days (taking into account leap year rules)
// 400 years have 12 months === 4800
export const daysToMonths = days => (days * 4800) / 146097;

// the reverse of daysToMonths
export const monthsToDays = months => (months * 146097) / 4800;

export function toInt(number) {
  /* eslint no-restricted-globals: [ 0 ] */
  return (+number !== 0 && isFinite(+number)) ? absFloor(+number) : 0;
}

export const isLeapYear = year => (year % 100 !== 0 && year % 4 === 0) || year % 400 === 0;

export function minus(date1, date2) {
  if (isUndefined(date1) || isUndefined(date2)) {
    throw new Error('arguments must be defined');
  }
  if (!(isDate(date1) && isDate(date2))) {
    throw new TypeError('arguments must be Date type');
  }
  return date1 - date2;
}

export function extend(a, b) {
  const res = a;
  const bKeys = keys(b);
  const bKeysLen = bKeys.length;
  let i;

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

export function compareArrays(array1, array2, dontConvert) {
  const l1 = array1.length;
  const l2 = array1.length;
  const len = Math.min(l1, l2);
  const lenthDiff = Math.abs(l1 - l2);
  let diffs = 0;
  let i;

  for (i = 0; i < len; i += 1) {
    if ((dontConvert && array1[i] !== array2[i]) ||
      (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
      diffs += 1;
    }
  }
  return diffs + lenthDiff;
}

export const indexOf = nativeIndexOf || function (o) {
  const len = this.length;
  let i;
  for (i = 0; i < len; i += 1) {
    if (this[i] === o) {
      return i;
    }
  }
  return -1;
};

const daysInYear = year => (isLeapYear(year) ? 366 : 365);

const createUTCDate = (...args) => new Date(Date.UTC.apply(null, args));

const firstWeekOffset = (year, dow, doy) => {
  // first-week day -- which january is always in the first week (4 for iso, 1 for other)
  const fwd = (7 + dow) - doy;
  // first-week day local weekday -- which local weekday is fwd
  const fwdlw = ((7 + createUTCDate(year, 0, fwd).getUTCDay()) - dow) % 7;

  return (-fwdlw + fwd) - 1;
};

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
const dayOfYearFromWeeks = (year, week, weekday, dow, doy) => {
  const localWeekday = ((7 + weekday) - dow) % 7;
  const weekOffset = firstWeekOffset(year, dow, doy);
  const dayOfYear = 1 + (7 * (week - 1)) + localWeekday + weekOffset;
  let resYear;
  let resDayOfYear;

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
    dayOfYear: resDayOfYear,
  };
};

export const weeksInYear = (year, dow, doy) => {
  const weekOffset = firstWeekOffset(year, dow, doy);
  const weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
  return ((daysInYear(year) - weekOffset) + weekOffsetNext) / 7;
};


export const weekOfYear = (mom, dow, doy) => {
  const weekOffset = firstWeekOffset(mom.year(), dow, doy);
  const week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1;
  let resWeek;
  let resYear;

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
    year: resYear,
  };
};

function setWeekAll(weekYear, week, weekday, dow, doy) {
  const dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
  const date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

  this.year(date.getUTCFullYear());
  this.month(date.getUTCMonth());
  this.day(date.getUTCDate());
  return this;
}

export function getSetWeekYearHelper(input, week, weekday, dow, doy) {
  let weekCanBeModify = week;

  if (input == null) {
    return weekOfYear(this, dow, doy).year;
  }
  const weeksTarget = weeksInYear(input, dow, doy);
  if (weekCanBeModify > weeksTarget) {
    weekCanBeModify = weeksTarget;
  }
  return setWeekAll.call(this, input, weekCanBeModify, weekday, dow, doy);
}

export const parseIsoWeekday = (input, locale) => {
  if (isString(input)) {
    return locale.weekdaysParse(input) % 7 || 7;
  }
  return isNaN(input) ? null : input;
};

export const parseWeekday = (input, locale) => {
  let beParse = input;
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
