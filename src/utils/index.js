/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
/* eslint prefer-destructuring: ["error", { "object": false }] */
/* eslint no-void: 0 */
/* global isFinite */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint no-underscore-dangle: ["error",
{ "allowAfterThis": true, "allow": ["_config", "_locale", "_abbr"] }
] */
/* eslint no-use-before-define: ["error", { "functions": false }] */

import Locale from '../Locale';

import baseConfig from '../config/index';

import i18ns from '../i18n/index';

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
const MAX_ARRAY_INDEX = 2 ** 53 - 1;
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

export function extend(a, b) {
  const res = a;
  const bKeys = Object.keys(b);
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

let hookCallback;
export function hooks(...args) {
  return hookCallback(args);
}

export function setHookCallback(callback) {
  hookCallback = callback;
}

function warn(msg) {
  if (hooks.suppressDeprecationWarnings === false &&
    (typeof console !== 'undefined') && console.warn) {
    console.warn(`Deprecation warning: ${msg}`);
  }
}

export function deprecate(msg, fn) {
  let firstTime = true;

  return extend(function (...args) {
    if (hooks.deprecationHandler != null) {
      hooks.deprecationHandler(null, msg);
    }
    if (firstTime) {
      const arr = [];
      let arg;
      for (let i = 0; i < args.length; i += 1) {
        arg = '';
        if (typeof args[i] === 'object') {
          arg += `\n[${i}] `;
          const argZeroKeys = keys(args[0]);
          const argZeroLen = argZeroKeys.length;

          for (let j = 0; j < argZeroLen; j += 1) {
            arg += `${argZeroKeys[j]}: ${args[0][argZeroKeys[j]]}, `;
          }
          arg = arg.slice(0, -2); // Remove trailing comma and space
        } else {
          arg = args[i];
        }
        arr.push(arg);
      }
      warn(`${msg}\nArguments: ${Array.prototype.slice.call(arr).join('')}\n${(new Error()).stack}`);
      firstTime = false;
    }
    return fn.apply(this, args);
  }, fn);
}

const deprecations = {};

export function deprecateSimple(name, msg) {
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

export function zeroFill(number, targetLength, forceSign) {
  const absNumber = `${Math.abs(number)}`;
  const zeroToFill = targetLength - absNumber.length;
  const sign = number >= 0;
  return (sign ? (forceSign ? '+' : '') : '-') +
    (10 ** Math.max(0, zeroToFill)).toString().substr(1) + absNumber;
}

function mergeConfigs(parentConfig, childConfig) {
  const res = extend({}, parentConfig);
  let i;
  let j;
  const cKeys = Object.keys(childConfig);
  const cLen = cKeys.length;
  const pKeys = Object.keys(parentConfig);
  const pLen = pKeys.length;

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
    if (has(parentConfig, cKeys[j]) &&
      !has(childConfig, cKeys[j]) &&
      isObject(parentConfig[cKeys[j]])) {
      // make sure changes to properties don't modify parent config
      res[cKeys[j]] = extend({}, res[cKeys[j]]);
    }
  }

  return res;
}

// internal storage for locale config files
const locales = {};
const localeFamilies = {};
let globalLocale;

function normalizeLocale(key) {
  return key ? key.toLowerCase().replace('_', '-') : key;
}

export function defineLocale(name, config) {
  const configCanBeModify = config;
  if (configCanBeModify !== null) {
    let parentConfig = baseConfig;
    configCanBeModify.abbr = name;
    if (locales[name] != null) {
      deprecateSimple(
        'defineLocaleOverride',
        'use Now.updateLocale(localeName, config) to change ' +
        'an existing locale. Now.defineLocale(localeName, ' +
        'config) should only be used for creating a new locale',
      );

      parentConfig = locales[name]._config;
    } else if (configCanBeModify.parentLocale != null) {
      if (locales[configCanBeModify.parentLocale] != null) {
        parentConfig = locales[configCanBeModify.parentLocale]._config;
      } else {
        if (!localeFamilies[configCanBeModify.parentLocale]) {
          localeFamilies[configCanBeModify.parentLocale] = [];
        }
        localeFamilies[configCanBeModify.parentLocale].push({
          name,
          configCanBeModify,
        });
        return null;
      }
    }
    locales[name] = new Locale(mergeConfigs(parentConfig, configCanBeModify));

    if (localeFamilies[name]) {
      localeFamilies[name].forEach((x) => {
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
export function getSetGlobalLocale(key, values) {
  let data;
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

function loadLocale(name) {
  let oldLocale = null;
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
  let i = 0;
  let j;
  let next;
  let locale;
  let split;

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
export function getLocale(key) {
  let locale;
  let keyCanBeModify = key;

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

export function updateLocale(name, config) {
  let configCanBeModify = config;
  if (configCanBeModify != null) {
    let parentConfig = baseConfig;
    // MERGE
    if (locales[name] != null) {
      parentConfig = locales[name]._config;
    }
    configCanBeModify = mergeConfigs(parentConfig, configCanBeModify);
    const locale = new Locale(configCanBeModify);
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

export const listLocales = () => keys(locales);

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
