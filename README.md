## Now

Now is a time toolkit for javascript

## Overview

Now is inspire by [Now](https://github.com/jinzhu/now)(a time toolkit for golang). When I'm about to complete the code, I found that this is just a total toy. go's standard library time native support Format, Duration and so on. Format and i18n needs a huge amount of work. I found that [moment](https://github.com/moment/moment) had implemented them in a very elegant way. So I borrow it, respect and gratitude!
## Install

Install with npm

```
npm install now.js
```

ES6/commonjs
```javascript
// ES6
import Now from 'now.js';

// commonjs
var Now = require('now.js');
```

Import now.js into your page

```html
// default support 'en' and 'zh-cn'
<script type="text/javascript" src="/path/to/nowjs.min.js"></script>

// or locale version support 118 languages
<script type="text/javascript" src="/path/to/nowjs.locale.min.js"></script>
```

## Examples
```javascript
var now = new Now()

now.format() // "2017-11-20T22:23:00+08:00"
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-20 22:23:00.285"
now.format("dddd, MMMM Do YYYY, h:mm:ss a") // "Monday, November 20th 2017, 10:23:00 pm"

now.locale('zh-cn') // default support 'en' and 'zh-cn'
now.format("dddd, MMMM Do YYYY, h:mm:ss a") // "星期一, 十一月 20日 2017, 10:23:00 晚上"
now.elapse() // "10 天前"
// same as
now.timeAgo() // "10 天前"

// monday
now.monday() // "2017-11-20 00:00:00"

// isMonday
now.isMonday() // true

// isBefore
now.isBefore(new Date(2020, 10, 11)) // true

// isLeapYear
now.isLeapYear() // false
now.isLeapYear(2008) // true

// between
now.between(new Date(2008, 10, 10), new Date(2018, 10, 10)) // true

// UTC
now.UTC().format() // "2017-11-20T22:23:00+00:00"

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

[More examples](https://github.com/hongmaoxiao/now/blob/master/example)

## Localization
From `now.js` 0.3.0, default just supports 'en' and 'zh-cn'.If you want to support more locales. Please use `nowjs.locale.js` or `nowjs.locale.min.js` instead.

## Browser Support

Modern browsers and Internet Explorer 9+.

## Contribute
Bug reports or suggestions please check out [issues](https://github.com/hongmaoxiao/now/issues).<br>
Any pull request will be apreciated.

1. Fork
2. run `npm install`
3. run `npm run start` in the main folder to launch a development webserver
4. complete your code and create pull request

**Note:**

1. Pull request to `master` branch will be rejected, submit your pull request to `develop` branch.
2. Do not upload build files in your pull request. These are `dist/*.js`. I will build them by myself.

## Changelog

#### 0.3.0
1. default version(nowjs.js, nowjs.min.js) and locale version(nowjs.locale.js, nowjs.locale.min.js).
2. default version just supports 'en' and 'zh-cn' locales; locale version support 118 languages.

#### 0.2.0
1. fix package.json homepage, repository url and bugs url.
2. add Contribute to readme.

## Author

**hongmaoxiao**

* <http://github.com/hongmaoxiao>
* <buaaxhm@gmail.com>
* <https://twitter.com/buaaxhm>

## License

MIT
