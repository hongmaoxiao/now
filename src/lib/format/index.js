import {
  zeroFill,
  isFunction,
} from '../../utils';

export const formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

const localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

const formatFunctions = {};

export const formatTokenFunctions = {};

export function addFormatToken(token, padded, ordinal, callback) {
  let func = callback;
  if (typeof callback === 'string') {
    func = function() {
      return this[callback]();
    };
  }
  if (token) {
    formatTokenFunctions[token] = func;
  }
  if (padded) {
    formatTokenFunctions[padded[0]] = function() {
      return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
    };
  }
  if (ordinal) {
    formatTokenFunctions[ordinal] = function() {
      return this.localeData().ordinal(func.apply(this, arguments), token);
    };
  }
}

function removeFormattingTokens(input) {
  if (input.match(/\[[\s\S]/)) {
    return input.replace(/^\[|\]$/g, '');
  }
  return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
  let array = format.match(formattingTokens);
  let i;
  let length;

  for (i = 0, length = array.length; i < length; i++) {
    if (formatTokenFunctions[array[i]]) {
      array[i] = formatTokenFunctions[array[i]];
    } else {
      array[i] = removeFormattingTokens(array[i]);
    }
  }

  console.log("formmmmm array: ", array)
  return function(mom) {
    let output = '';
    let i;
    for (i = 0; i < length; i++) {
      console.log('oooooo: ', output);
      output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
    }
    return output;
  };
}

export function formatMoment(m, format) {
  // if (!m.isValid()) {
  // return m.localeData().invalidDate();
  // }

  console.log('m: ', m);
  console.log("localeData: ", m.localeData());
  format = expandFormat(format, m.localeData());
  console.log('format: ', format);
  formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

  return formatFunctions[format](m);
}

export function expandFormat(format, locale) {
  let i = 5;

  function replaceLongDateFormatTokens(input) {
    return locale.longDateFormat(input) || inpiut;
  }

  localFormattingTokens.lastIndex = 0;
  while (i >= 0 && localFormattingTokens.test(format)) {
  console.log("formmmmm in: ", format)
    format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
    localFormattingTokens.lastIndex = 0;
    i -= 1;
  }
  // console.log("formmmmm: ", format)

  return format;
}

