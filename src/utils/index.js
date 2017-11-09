/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
/* eslint prefer-destructuring: ["error", { "object": false }] */

import {
  matchWord,
  regexEscape,
} from '../lib/parse/regex';

import Locale from '../Locale';

import {
  baseConfig,
} from '../lib/locale/config';

const ArrayProto = Array.prototype;
const DateProto = Date.prototype;
const toString = Object.prototype.toString;
const nativeIsArray = Array.isArray;
const nativeIndexOf = ArrayProto.indexOf;
const nativeDatetoISOString = Date.prototype.toISOString;
const hasOwnProperty = Object.prototype.hasOwnProperty;

export const slice = ArrayProto.slice;
export const invalidDateError = 'Invalid Date';
export const invalidDateRegExp = /Invalid Date/;
export const defaultMonthsShortRegex = matchWord;
export const defaultMonthsRegex = matchWord;
export const defaultWeekdaysRegex = matchWord;
export const defaultWeekdaysShortRegex = matchWord;
export const defaultWeekdaysMinRegex = matchWord;


export function isDate(value) {
  return value instanceof Date || toString.call(value) === '[object Date]';
}

export function isString(value) {
  return toString.call(value) === '[object String]';
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
  return value != null && Object.prototype.toString.call(value) === '[object Object]'
}

export function has(obj, key) {
  return hasOwnProperty.call(obj, key);
}

export const keys = Object.keys || function(obj) {
  let i;
  let res = [];
  for (i in obj) {
    if (has(obj, i)) {
      res[res.length] = i;
    }
  }
  return res;
}

export function absCeil(number) {
  return number < 0 ? Math.floor(number) : Math.ceil(number);
}

export function absFloor(number) {
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

export function absRound(number) {
  return number < 0 ? Math.round(-1 * number) * -1 : Math.round(number);
}

export function toInt(number) {
  return (+number !== 0 && isFinite(+number)) ? absFloor(+number) : 0;
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
  for (let i in b) {
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

export const indexOf = nativeIndexOf || function(o) {
  const len = this.length;
  let i;
  for (i = 0; i < len; i++) {
    if (this[i] === o) {
      return i;
    }
  }
  return -1;
}

let hookCallback;
export function hooks() {
  return hookCallback.apply(null, arguments);
}

export function setHookCallback(callback) {
  hookCallback = callback;
}

function warn(msg) {
  if (hooks.suppressDeprecationWarnings === false &&
    (typeof console !== 'undefined') && console.warn) {
    console.warn('Deprecation warning: ' + msg);
  }
}

export function deprecate(msg, fn) {
  let firstTime = true;

  return extend(function() {
    if (hooks.deprecationHandler != null) {
      hooks.deprecationHandler(null, msg);
    }
    if (firstTime) {
      let args = [];
      let arg;
      for (let i = 0; i < arguments.length; i++) {
        arg = '';
        if (typeof arguments[i] === 'object') {
          arg += '\n[' + i + '] ';
          for (let key in arguments[0]) {
            arg += key + ': ' + arguments[0][key] + ', ';
          }
          arg = arg.slice(0, -2); // Remove trailing comma and space
        } else {
          arg = arguments[i];
        }
        args.push(arg);
      }
      warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
      firstTime = false;
    }
    return fn.apply(this, arguments);
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
  const absNumber = '' + Math.abs(number);
  const zeroToFill = targetLength - absNumber.length;
  const sign = number >= 0;
  return (sign ? (forceSign ? '+' : '') : '-') +
    Math.pow(10, Math.max(0, zeroToFill)).toString().substr(1) + absNumber;
}

export function compare(date1, date2) {
  if (isUndefined(date1) || isUndefined(date2)) {
    throw new Error('arguments can not be undefined');
  } else if (!(isDate(date1) && isDate(date2))) {
    throw new TypeError('arguments require Date type');
  } else {
    return (date1 < date2) ? -1 : (date1 > date2) ? 1 : 0;
  }
}
export function minus(date1, date2) {
  if (isUndefined(date1) || isUndefined(date2)) {
    throw new Error('arguments must be defined');
  }
  if (!(isDate(date1) && isDate(date2))) {
    throw new TypeError('arguments must be Date type');
  }
  return date1 - date2;
}

export function handleMonthStrictParse(monthName, format, strict) {
  var i, ii, mom, llc = monthName.toLocaleLowerCase();
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
export function handleWeekStrictParse(weekdayName, format, strict) {
  var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
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

export function computeMonthsParse() {
  function cmpLenRev(a, b) {
    return b.length - a.length;
  }

  var shortPieces = [],
    longPieces = [],
    mixedPieces = [],
    i, mom;
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

export function computeWeekdaysParse() {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom, minp, shortp, longp;
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
  var res = extend({}, parentConfig),
    prop;
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
    if (has(parentConfig, prop) &&
      !has(childConfig, prop) &&
      isObject(parentConfig[prop])) {
      // make sure changes to properties don't modify parent config
      res[prop] = extend({}, res[prop]);
    }
  }
  // console.log('res: ', res);
  return res;
}

// internal storage for locale config files
const locales = {};
const localeFamilies = {};
let globalLocale;

function normalizeLocale(key) {
  return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
  var i = 0,
    j, next, locale, split;

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
  let oldLocale = null;
  // console.log('name: ', name, locales[name]);
  // TODO: Find a better way to register and load all the locales in Node
  if (!locales[name] && (typeof module !== 'undefined') &&
    module && module.exports) {
    try {
      console.log('name: ', name);
      oldLocale = globalLocale && globalLocale._abbr;
      let aliasedRequire = require;
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
export function getSetGlobalLocale(key, values) {
  // console.log('keeeee: ', key, values, isUndefined(values));
  let data;
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

export function defineLocale(name, config) {
  if (config !== null) {
    let parentConfig = baseConfig;
    config.abbr = name;
    if (locales[name] != null) {
    // console.log('locales name not null: ', locales[name]);
      deprecateSimple('defineLocaleOverride',
        'use moment.updateLocale(localeName, config) to change ' +
        'an existing locale. moment.defineLocale(localeName, ' +
        'config) should only be used for creating a new locale ' +
        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
      parentConfig = locales[name]._config;
    } else if (config.parentLocale != null) {
    console.log('locales name is null: ', config);
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
      localeFamilies[name].forEach(function(x) {
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

export function updateLocale(name, config) {
  if (config != null) {
    let locale;
    let parentConfig = baseConfig;
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
export function getLocale(key) {
  let locale;

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

export function listLocales() {
  return keys(locales);
}
