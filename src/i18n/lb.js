//! now.js locale configuration
//! locale : Luxembourgish [lb]
//! author : mweimerskirch : https://github.com/mweimerskirch
//! author : David Raison : https://github.com/kwisatz

function processRelativeTime(number, withoutSuffix, key) {
  const format = {
    m: ['eng Minutt', 'enger Minutt'],
    h: ['eng Stonn', 'enger Stonn'],
    d: ['een Dag', 'engem Dag'],
    M: ['ee Mount', 'engem Mount'],
    y: ['ee Joer', 'engem Joer'],
  };
  return withoutSuffix ? format[key][0] : format[key][1];
}

/**
 * Returns true if the word before the given number loses the '-n' ending.
 * e.g. 'an 10 Deeg' but 'a 5 Deeg'
 *
 * @param number {integer}
 * @returns {boolean}
 */
function eifelerRegelAppliesToNumber(number) {
  let n = number;
  n = parseInt(n, 10);
  /* eslint no-restricted-globals: [ 0 ] */
  if (isNaN(n)) {
    return false;
  }
  if (n < 0) {
    // Negative Number --> always true
    return true;
  } else if (n < 10) {
    // Only 1 digit
    if (n >= 4 && n <= 7) {
      return true;
    }
    return false;
  } else if (n < 100) {
    // 2 digits
    const lastDigit = n % 10;
    const firstDigit = n / 10;
    if (lastDigit === 0) {
      return eifelerRegelAppliesToNumber(firstDigit);
    }
    return eifelerRegelAppliesToNumber(lastDigit);
  } else if (n < 10000) {
    // 3 or 4 digits --> recursively check first digit
    while (n >= 10) {
      n /= 10;
    }
    return eifelerRegelAppliesToNumber(n);
  }
  // Anything larger than 4 digits: recursively check first n-3 digits
  n /= 1000;
  return eifelerRegelAppliesToNumber(n);
}

function processFutureTime(string) {
  const number = string.substr(0, string.indexOf(' '));
  if (eifelerRegelAppliesToNumber(number)) {
    return `a ${string}`;
  }
  return `an ${string}`;
}

function processPastTime(string) {
  const number = string.substr(0, string.indexOf(' '));
  if (eifelerRegelAppliesToNumber(number)) {
    return `viru ${string}`;
  }
  return `virun ${string}`;
}

export default {
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
    LLLL: 'dddd, D. MMMM YYYY H:mm [Auer]',
  },
  calendar: {
    sameDay: '[Haut um] LT',
    sameElse: 'L',
    nextDay: '[Muer um] LT',
    nextWeek: 'dddd [um] LT',
    lastDay: '[Gëschter um] LT',
    lastWeek() {
      // Different date string for 'Dënschdeg' (Tuesday) and 'Donneschdeg' (Thursday)
      // due to phonological rule
      switch (this.day()) {
        case 2:
        case 4:
          return '[Leschten] dddd [um] LT';
        default:
          return '[Leschte] dddd [um] LT';
      }
    },
  },
  relativeTime: {
    future: processFutureTime,
    past: processPastTime,
    s: 'e puer Sekonnen',
    m: processRelativeTime,
    mm: '%d Minutten',
    h: processRelativeTime,
    hh: '%d Stonnen',
    d: processRelativeTime,
    dd: '%d Deeg',
    M: processRelativeTime,
    MM: '%d Méint',
    y: processRelativeTime,
    yy: '%d Joer',
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4, // The week that contains Jan 4th is the first week of the year.
  },
};
