//! now.js locale configuration
//! locale : Hindi [hi]
//! author : Mayank Singhal : https://github.com/mayanksinghal

const symbolMap = {
  1: '१',
  2: '२',
  3: '३',
  4: '४',
  5: '५',
  6: '६',
  7: '७',
  8: '८',
  9: '९',
  0: '०',
};

const numberMap = {
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
  '०': '0',
};

export default {
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
    LLLL: 'dddd, D MMMM YYYY, A h:mm बजे',
  },
  calendar: {
    sameDay: '[आज] LT',
    nextDay: '[कल] LT',
    nextWeek: 'dddd, LT',
    lastDay: '[कल] LT',
    lastWeek: '[पिछले] dddd, LT',
    sameElse: 'L',
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
    yy: '%d वर्ष',
  },
  preparse(string) {
    return string.replace(/[१२३४५६७८९०]/g, match => numberMap[match]);
  },
  postformat(string) {
    return string.replace(/\d/g, match => symbolMap[match]);
  },
  // Hindi notation for meridiems are quite fuzzy in practice. While there exists
  // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
  meridiemParse: /रात|सुबह|दोपहर|शाम/,
  meridiemHour(hour, meridiem) {
    let h = hour;
    if (h === 12) {
      h = 0;
    }
    if (meridiem === 'रात') {
      return h < 4 ? h : h + 12;
    } else if (meridiem === 'सुबह') {
      return h;
    } else if (meridiem === 'दोपहर') {
      return h >= 10 ? h : h + 12;
    } else if (meridiem === 'शाम') {
      return h + 12;
    }
    return h;
  },
  meridiem(hour) {
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
    doy: 6, // The week that contains Jan 1st is the first week of the year.
  },
};
