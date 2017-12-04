/* eslint no-underscore-dangle: ["error",
{ "allowAfterThis": true, "allow": ["_config", "_locale", "_abbr"] }
] */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint no-use-before-define: ["error", { "functions": false }] */
import {
  has,
  keys,
  isObject,
  isArray,
  isUndefined,
  extend,
  compareArrays,
} from '../../utils/index';
import Locale from '../../Locale';
import baseConfig from '../../config/index';
import i18ns from '../../i18n/index.locale';

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

function mergeConfigs(parentConfig, childConfig) {
  const res = extend({}, parentConfig);
  let i;
  let j;
  const cKeys = keys(childConfig);
  const cLen = cKeys.length;
  const pKeys = keys(parentConfig);
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

export const listLocales = () => keys(i18ns);
