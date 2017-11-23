## Now

Now is a time toolkit for javascript

## Overview

Now is inspire by [Now](https://github.com/jinzhu/now)(a time toolkit for golang). When I'm about to complete the code, I found that this is just a total toy. go's standard library time native support Format, Duration and so on. Format and i18n needs a huge amount of work. I found that [moment](https://github.com/moment/moment) had implemented them in a very elegant way. So I borrow it, respect and gratitude!
## Install

Install with npm

```
npm install now.js
```

Import now.js into your page

```html
<script type="text/javascript" src="/path/to/nowjs.min.js"></script>
```

### Examples
```javascript
import Now from 'now.js'; // for node(browser do not need this)

now = new Now() // "2017-11-20 22:23:00.285"

import Now
now.beginningOfMinute()   // "2017-11-20 22:23:00"
now.beginningOfHour()     // "2017-11-20 22:00:00"
now.beginningOfDay()      // "2017-11-20 00:00:00"
now.beginningOfWeek()     // "2017-11-19 00:00:00"
now.firstDayMonday = true // Set Monday as first day, default is Sunday
now.beginningOfWeek()     // "2017-11-20 00:00:00"
now.beginningOfMonth()    // "2017-11-01 00:00:00"
now.beginningOfQuarter()  // "2017-10-01 00:00:00"
now.beginningOfYear()     // "2017-01-01 00:00:00"

now.endOfMinute()         // "2017-11-20 22:23:59.999"
now.endOfHour()           // "2017-11-20 22:59:59.999"
now.endOfDay()            // "2017-11-20 23:59:59.999"
now.endOfWeek()           // "2017-11-25 23:59:59.999"
now.firstDayMonday = true // Set Monday as first day, default is Sunday
now.endOfWeek()           // "2017-11-26 23:59:59.999"
now.endOfMonth()          // "2017-11-30 23:59:59.999"
now.endOfQuarter()        // "2017-12-31 23:59:59.999"
now.endOfYear()           // "2017-12-31 23:59:59.999"

All the above functions return String type. You can pass 'self' to return Now instance:

var beginningOfMinute = now.beginningOfMinute('self') // return Now instance
beginningOfMinute.format('ddd, Ah') // "Mon, PM10"
beginningOfMinute.format('LLLL') // "Monday, November 20, 2017 10:23 PM"
beginningOfMinute.isMonday() // true

```

### Browser Support
Modern browsers and Internet Explorer 10+.

### Author

**hongmaoxiao**

* <http://github.com/hongmaoxiao>
* <buaaxhm@gmail.com>

### License

MIT
