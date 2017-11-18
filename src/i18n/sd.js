//! now.js locale configuration
//! locale : Sindhi [sd]
//! author : Narain Sagar : https://github.com/narainsagar
/* jshint -W100 */

const months = [
  'جنوري',
  'فيبروري',
  'مارچ',
  'اپريل',
  'مئي',
  'جون',
  'جولاءِ',
  'آگسٽ',
  'سيپٽمبر',
  'آڪٽوبر',
  'نومبر',
  'ڊسمبر',
];
const days = [
  'آچر',
  'سومر',
  'اڱارو',
  'اربع',
  'خميس',
  'جمع',
  'ڇنڇر',
];

export default {
  months,
  monthsShort: months,
  weekdays: days,
  weekdaysShort: days,
  weekdaysMin: days,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd، D MMMM YYYY HH:mm',
  },
  meridiemParse: /صبح|شام/,
  isPM(input) {
    return input === 'شام';
  },
  meridiem(hour, minute, isLower) {
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
    sameElse: 'L',
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
    yy: '%d سال',
  },
  preparse(string) {
    return string.replace(/،/g, ',');
  },
  postformat(string) {
    return string.replace(/,/g, '،');
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4, // The week that contains Jan 4th is the first week of the year.
  },
};
