//! now.js locale configuration
//! locale : Scottish Gaelic [gd]
//! author : Jon Ashdown : https://github.com/jonashdown
/* jshint -W100 */

import Now from '../index';

const months = [
  'Am Faoilleach', 'An Gearran', 'Am Màrt', 'An Giblean', 'An Cèitean', 'An t-Ògmhios', 'An t-Iuchar', 'An Lùnastal', 'An t-Sultain', 'An Dàmhair', 'An t-Samhain', 'An Dùbhlachd',
];

const monthsShort = ['Faoi', 'Gear', 'Màrt', 'Gibl', 'Cèit', 'Ògmh', 'Iuch', 'Lùn', 'Sult', 'Dàmh', 'Samh', 'Dùbh'];

const weekdays = ['Didòmhnaich', 'Diluain', 'Dimàirt', 'Diciadain', 'Diardaoin', 'Dihaoine', 'Disathairne'];

const weekdaysShort = ['Did', 'Dil', 'Dim', 'Dic', 'Dia', 'Dih', 'Dis'];

const weekdaysMin = ['Dò', 'Lu', 'Mà', 'Ci', 'Ar', 'Ha', 'Sa'];

export default Now.defineLocale('gd', {
  months,
  monthsShort,
  monthsParseExact: true,
  weekdays,
  weekdaysShort,
  weekdaysMin,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm',
  },
  calendar: {
    sameDay: '[An-diugh aig] LT',
    nextDay: '[A-màireach aig] LT',
    nextWeek: 'dddd [aig] LT',
    lastDay: '[An-dè aig] LT',
    lastWeek: 'dddd [seo chaidh] [aig] LT',
    sameElse: 'L',
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
    yy: '%d bliadhna',
  },
  dayOfMonthOrdinalParse: /\d{1,2}(d|na|mh)/,
  ordinal(number) {
    const output = number === 1 ? 'd' : number % 10 === 2 ? 'na' : 'mh';
    return number + output;
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4, // The week that contains Jan 4th is the first week of the year.
  },
});
