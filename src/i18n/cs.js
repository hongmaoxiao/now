//! now.js locale configuration
//! locale : Czech [cs]
//! author : petrbela : https://github.com/petrbela
/* eslint no-bitwise: ["error", { "allow": ["~"] }] */

const months = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_');
const monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_');

function plural(n) {
  return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
}

function translate(number, withoutSuffix, key, isFuture) {
  const result = `${number} `;
  switch (key) {
    case 's': // a few seconds / in a few seconds / a few seconds ago
      return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
    case 'm': // a minute / in a minute / a minute ago
      return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
    case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
      if (withoutSuffix || isFuture) {
        return result + (plural(number) ? 'minuty' : 'minut');
      }
      return `${result}minutami`;
    case 'h': // an hour / in an hour / an hour ago
      return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
    case 'hh': // 9 hours / in 9 hours / 9 hours ago
      if (withoutSuffix || isFuture) {
        return result + (plural(number) ? 'hodiny' : 'hodin');
      }
      return `${result}hodinami`;
    case 'd': // a day / in a day / a day ago
      return (withoutSuffix || isFuture) ? 'den' : 'dnem';
    case 'dd': // 9 days / in 9 days / 9 days ago
      if (withoutSuffix || isFuture) {
        return result + (plural(number) ? 'dny' : 'dní');
      }
      return `${result}dny`;
    case 'M': // a month / in a month / a month ago
      return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
    case 'MM': // 9 months / in 9 months / 9 months ago
      if (withoutSuffix || isFuture) {
        return result + (plural(number) ? 'měsíce' : 'měsíců');
      }
      return `${result}měsíci`;
    case 'y': // a year / in a year / a year ago
      return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
    case 'yy': // 9 years / in 9 years / 9 years ago
      if (withoutSuffix || isFuture) {
        return result + (plural(number) ? 'roky' : 'let');
      }
      return `${result}lety`;
    default:
      return result;
  }
}

export default {
  months,
  monthsShort,
  monthsParse: (function (month, monthShort) {
    let i;
    const monthsParseRes = [];
    for (i = 0; i < 12; i += 1) {
      // use custom parser to solve problem with July (červenec)
      monthsParseRes[i] = new RegExp(`^${month[i]}$|^${monthShort[i]}$`, 'i');
    }
    return monthsParseRes;
  }(months, monthsShort)),
  shortMonthsParse: (function (monthShort) {
    let i;
    const shortMonthsParseRes = [];
    for (i = 0; i < 12; i += 1) {
      shortMonthsParseRes[i] = new RegExp(`^${monthShort[i]}$`, 'i');
    }
    return shortMonthsParseRes;
  }(monthsShort)),
  longMonthsParse: (function (month) {
    let i;
    const longMonthsParseRes = [];
    for (i = 0; i < 12; i += 1) {
      longMonthsParseRes[i] = new RegExp(`^${month[i]}$`, 'i');
    }
    return longMonthsParseRes;
  }(months)),
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
    l: 'D. M. YYYY',
  },
  calendar: {
    sameDay: '[dnes v] LT',
    nextDay: '[zítra v] LT',
    nextWeek() {
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
        default:
          return '';
      }
    },
    lastDay: '[včera v] LT',
    lastWeek() {
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
        default:
          return '';
      }
    },
    sameElse: 'L',
  },
  relativeTime: {
    future: 'za %s',
    past: 'před %s',
    s: translate,
    m: translate,
    mm: translate,
    h: translate,
    hh: translate,
    d: translate,
    dd: translate,
    M: translate,
    MM: translate,
    y: translate,
    yy: translate,
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4, // The week that contains Jan 4th is the first week of the year.
  },
};

