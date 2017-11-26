## Now
### new Now([date])
First of all. you should create a Now instance. **date** argument is optional:
```javascript
// return the current time
now = new Now() // "2017-11-25 00:38:41.151" (for readable, not real output)

// same as
date = new Date() // "2017-11-25 00:38:41.151" (for readable, not real output)
```
If **date** is not null, Its value type should be the same as **new Date()**'s agrument. Taht is:
```javascript
new Date(value);
new Date(dateString);
new Date(year, month, day, hours, minutes, seconds, milliseconds);

// for Now
now = new Now(1483207384005) // "2017-01-01 02:03:04.005"
now = new Now('Jan 1, 2017 02:03:04.005') // "2017-01-01 02:03:04.005"
now = new Now(2017, 0, 1, 2, 3, 4, 5) // "2017-01-01 02:03:04.005"

// valid
now = new Now(2017, 0, 1) // "2017-01-01 00:00:00.000"
now = new Now(2017) // "2017-00-00 00:00:00.000"
```

If **date** is invalid, throw Invalid Date Error.
```javascript
now = new Now('sssss') // Error: Invalid Date
```
## Stactic Functions

### version

Return Now version.

```javascript
Now.version // '0.1.0'
```

### defineLocale
Create a locale that inherits from a parent locale.
```javascript
Now.defineLocale('en-foo', {
  parentLocale: 'en',
  /* */
});
```
Properties that are not specified in the locale will be inherited from the parent locale.

### updateLocale
Update a locale's properties.
```javascript
moment.updateLocale('en', {
  /**/
});
```
### locales
List all locales are available to use.
```javascript
Now.locales() // ["af", "ar-dz", "ar-kw", "ar-ly", "ar-ma"...](118 items)
```
## Functions
If no pecify below.  **now = new Now(2017, 0, 1, 2, 3, 4, 5)**
### date
```javascript
now.date // Sun Jan 01 2017 02:03:04 GMT+0800 (CST)

// same as:
var date = new Date(2017, 0, 1, 2, 3, 4, 5) // "Sun Jan 01 2017 02:03:04 GMT+0800 (CST)"
```
### value
Returns the number of milliseconds between 1 January 1970 00:00:00 UTC and the **now.date**.
```javascript
now.value // 1483207384005

// same as:
var date = new Date(2017, 0, 1, 2, 3, 4, 5)
date.valueOf() // 1483207384005
```
### valueOf()
same as **value**

### unix()
Returns the number of seconds between 1 January 1970 00:00:00 UTC and the **now.date**.
```javascript
now.unix() // 1483207384

// same as:
now.valueOf() / 1000
```

### toString()
Returns a string representing the specified **now.date** Object.
```javascript
now.toString() // "Sun Jan 01 2017 02:03:04 GMT+0800 (CST)"

// same as:
var date = new Date(2017, 0, 1, 2, 3, 4, 5)
date.toString() Returns a string representing the specified Date object.
```

### toISOString()
Formats a string to the ISO8601 standard.
```javascript
now.toISOString() // "2016-12-31T18:03:04.005Z"
```
Note that **.toISOString()** always returns a timestamp in UTC, even if the Now in question is in local mode. This is done to provide consistency with the specification for native JavaScript Date **.toISOString()**. The native Date.prototype.toISOString is used if available, for performance reasons.

### toJson()
When serializing an object to JSON, if there is a **Now** object, it will be represented as an ISO8601 string, adjusted to UTC.
```javascript
JSON.stringify({
    postDate : now
}); // "{"postDate":"2016-12-31T18:03:04.005Z"}"
```
you can modify the toJSON function:
```javascript
now.toJSON = function() { return this.format(); }
```
This changes the behavior as follows:
```javascript
JSON.stringify({
    postDate : now
}); // "{"postDate":"2017-01-01T02:03:04+08:00"}"
```
### toArray()
Returns an array that mirrors the parameters from new Date().
```javascript
now.toArray() // [2017, 0, 1, 2, 3, 4, 5]
```

### toObject()
Returns an object containing year, month, day-of-month, hour, minute, seconds, milliseconds.
```javascript
now.toObject()
// {
//     year: 2017
//     month: 0
//     day: 1,
//     hour: 2,
//     minute: 3,
//     second: 4,
//     milliSeconds: 5
// }
```
### firstDayMonday
Represent if the first day is monday.<br><br>
**get:**
```javascript
now.firstDayMonday // defaut is false

now.beginningOfWeek() // "2017-01-01 00:00:00"
```
**set:**
```javascript
now.firstDayMonday = true // set to true

now.beginningOfWeek() // "2016-12-26 00:00:00"
```

### clone([date])
Return a copy of Now instance. **date** is optional. **date** is same as **new Date()**'s argument.
```javascript
now = new Now(2017, 0, 1, 2, 3, 4, 5) // "2017-01-01 02:03:04.005"
clone = now.clone() // "2017-01-01 02:03:04.005"

now = new Now(2017, 0, 1, 2, 3, 4, 5) // "2017-01-01 02:03:04.005"
clone = now.clone(2020, 2, 11) // "2020-03-11 00:00:00.000"
```

### UTC([date])
By default, Now parses and displays in local time.<br>
If you want to parse or display a date in UTC, you can use **new Now().UTC()** instead of **new Now()**.<br>
This brings us to an interesting feature of now.js. UTC mode.<br>
While in UTC mode, all display methods will display in UTC time instead of local time.
```javascript
now = new Now()
now.format() // "2017-11-25T01:32:47+08:00"
now.UTC().format() // "2017-11-25T01:32:47+00:00"

// date not null
now.UTC(2020, 2, 11).format() // "2020-03-11T00:00:00+00:00"
```
### sunday(['self'])
Return sunday. 'self' is optional.
```javascript
now = new Now()
now.format() // "2017-11-25T01:53:49+08:00"
now.sunday() // "2017-11-26 00:00:00"
```
pass 'self', return Now instance.
```javascript
now = new Now()
now.format() // "2017-11-25T01:53:49+08:00"

self = now.sunday('self')
self.format() // "2017-11-26T00:00:00+08:00"
self.elapse() // "in a day"
```

### monday(['self'])
Return monday. 'self' is optional.
```javascript
now = new Now()
now.format() // "2017-11-25T01:53:49+08:00"

// today is not sunday, get after sunday
now.monday() // "2017-11-20 00:00:00"

// today is sunday, get before sunday
now = new Now(2017, 10, 26)
now.format() // "2017-11-26T00:00:00+08:00"

now.monday() // "2017-11-20 00:00:00"
```
pass 'self', return Now instance.
```javascript
now = new Now()
now.format() // "2017-11-25T01:53:49+08:00"

self = now.sunday('self')
self.format() // "2017-11-20T00:00:00+08:00"
self.elapse() // "5 days ago"
```
### tuesday(['self'])
Return tuesday. 'self' is optional. Similar to **monday**.

### wednesday(['self'])
Return wednesday. 'self' is optional. Similar to **monday**.

### thursday(['self'])
Return thursday. 'self' is optional. Similar to **monday**.

### friday(['self'])
Return friday. 'self' is optional. Similar to **monday**.

### saturday(['self'])
Return saturday. 'self' is optional. Similar to **monday**.

### isSunday()
Return whether the given date is sunday.
```javascript
now = new Now();
now.format() // "2017-11-25T12:30:19+08:00"

now.isSunday() // false
```

### isMonday()
Return whether the given date is monday.
```javascript
now = new Now();
now.format() // "2017-11-25T12:30:19+08:00"

now.isMonday() // false
```

### isTuesday()
Return whether the given date is tuesday. Similar to **isMonday**.

### isWednesday()
Return whether the given date is wednesday. Similar to **isMonday**.

### isThursday()
Return whether the given date is thursday. Similar to **isMonday**.

### isFriday()
Return whether the given date is friday. Similar to **isMonday**.

### isSaturday()
Return whether the given date is saturday. Similar to **isMonday**.

### year()
Get or sets the year.
```javascript
now = new Now();
now.format() // "2017-11-25T20:48:42+08:00"

// get
now.year() // 2017

// set
now.year(2020)
now.year() // 2020
```

### quarter()
Get or sets quarter.
```javascript
now = new Now();
now.format() // "2017-11-25T20:48:42+08:00"

// get
now.quarter() // 4

// set
now.quarter(1)
now.quarter() // 1
```

### month()
Get or sets month.
```javascript
now = new Now();
now.format() // "2017-11-25T20:48:42+08:00"

// get
now.month() // 10

// set
now.month(2)
now.month() // 2
```

### week()
Get or sets week.
```javascript
now = new Now();
now.format() // "2017-11-25T20:48:42+08:00"

// get
now.week() // 47

// set
now.week(50)
now.week() // 50
```

### isoWeek()
Gets or sets the [ISO week of the year](https://en.wikipedia.org/wiki/ISO_week_date).
```javascript
now = new Now();
now.format() // "2017-11-25T20:48:42+08:00"

// get
now.isoWeek() // 47

// set
now.isoWeek(50)
now.isoWeek() // 50
```
### day()
Get or sets the day of the month.
```javascript
now = new Now();
now.format() // "2017-11-25T20:48:42+08:00"

// get
now.day() // 16

// set
now.day(20)
now.day() // 20
```
### weekDay()
Gets or sets the day of the week.<br>
This method can be used to set the day of the week, with Sunday as 0 and Saturday as 6.
```javascript
now = new Now();
now.format() // "2017-11-25T21:59:22+08:00"

// get
now.weekDay() // 6

// set
now.weekDay(2)
now.weekDay() // 2
```

### localeWeekDay()
Gets or sets the day of the week according to the locale.<br>
If the locale assigns Monday as the first day of the week, new Now().weekday(0) will be Monday.<br>
If Sunday is the first day of the week, new Now().weekday(0) will be Sunday.
```javascript
now = new Now();
now.format() // "2017-11-25T21:59:22+08:00"

// get
now.localeWeekDay() // 6

// set
now.localeWeekDay(2)
now.localeWeekDay() // 2
```

### isoWeekDay()
Gets or sets the [ISO day of the week](https://en.wikipedia.org/wiki/ISO_week_date) with 1 being Monday and 7 being Sunday.
```javascript
now = new Now();
now.format() // "2017-11-25T21:59:22+08:00"

// get
now.isoWeekDay() // 6

// set
now.isoWeekDay(2)
now.isoWeekDay() // 2
```

### hour()
Gets or sets the hour.<br>
Accepts numbers from 0 to 23. If the range is exceeded, it will bubble up to the day.
```javascript
now = new Now();
now.format() // "2017-11-25T21:59:22+08:00"

// get
now.hour() // 21

// set
now.hour(10)
now.hour() // 10
```

### minute()
Gets or sets the minutes.<br>
Accepts numbers from 0 to 59. If the range is exceeded, it will bubble up to the hour.
```javascript
now = new Now();
now.format() // "2017-11-25T21:59:22+08:00"

// get
now.minute() // 59

// set
now.minute(10)
now.minute() // 10
```

### second()
Gets or sets the seconds.
Accepts numbers from 0 to 59. If the range is exceeded, it will bubble up to the minutes.
```javascript
now = new Now();
now.format() // "2017-11-25T21:59:22+08:00"

// get
now.second() // 22

// set
now.second(10)
now.second() // 10
```

### milliSecond()
Gets or sets the milliSeconds.
Accepts numbers from 0 to 999. If the range is exceeded, it will bubble up to the seconds.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 22:30:59.496"

// get
now.milliSecond() // 496

// set
now.milliSecond(100)
now.milliSecond() // 100
```

### weeksInYear()
Gets the number of weeks according to locale in the given year.
```javascript
now = new Now();
now.format() // "2017-11-25T22:30:59+08:00"

now.weeksInYear() // 52
```

### isoWeeksInYear()
Gets the number of weeks in the given year, according to [ISO weeks](https://en.wikipedia.org/wiki/ISO_week_date).
```javascript
now = new Now();
now.format() // "2017-11-25T22:30:59+08:00"

now.isoWeeksInYear() // 52
```

### weekYear()
Gets or sets the week-year according to the locale.<br>
Because the first day of the first week does not always fall on the first day of the year, sometimes the week-year will differ from the month year.<br>
For example, in the US, the week that contains Jan 1 is always the first week. In the US, weeks also start on Sunday. If Jan 1 was a Monday, Dec 31 would belong to the same week as Jan 1, and thus the same week-year as Jan 1. Dec 30 would have a different week-year than Dec 31.
```javascript
now = new Now();
now.format() // "2017-11-25T22:30:59+08:00"

now.weekYear() // 2017

// set
now.weekYear(2020)
now.weekYear() // 2020
```

### isoWeekYear()
Gets or sets the [ISO week-year](https://en.wikipedia.org/wiki/ISO_week_date).
```javascript
now = new Now();
now.format() // "2017-11-25T22:30:59+08:00"

now.isoWeekYear() // 2017

// set
now.isoWeekYear(2020)
now.isoWeekYear() // 2020
```

### dayOfYear()
Gets or sets the day of the year.
Accepts numbers from 1 to 366. If the range is exceeded, it will bubble up to the years.
```javascript
now = new Now();
now.format() // "2017-11-25T23:05:27+08:00"

now.dayOfYear() // 329

// set
now.dayOfYear(365)
now.dayOfYear() // 365

// bubble up to the years
now.dayOfYear(366)
now.year() // 2018
now.dayOfYear() // 1
```

### addMilliSeconds()
Add milliseconds to the given date.<br>
Accepts positive number and negative number. If the range is exceeded, it will bubble up or down to the seconds.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:19:36.427"

now.addMilliSeconds(100)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:19:36.527"

// bubble up
now.addMilliSeconds(600)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:19:37.027"

// bubble down
now.addMilliSeconds(500)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:19:36.027"
```

### addSeconds()
Add seconds to the given date.<br>
Accepts positive number and negative number. If the range is exceeded, it will bubble up or down to the minutes.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:19:36.427"

now.addSeconds(10)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:19:46.427"

// bubble up
now.addSeconds(30)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:20:06.427"

// bubble down
now.addSeconds(-40)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:18:56.427"
```

### addMinutes()
Add minutes to the given date.<br>
Accepts positive number and negative number. If the range is exceeded, it will bubble up or down to the hours.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:19:36.427"

now.addMinutes(10)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:29:46.427"

// bubble up
now.addMinutes(43)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 00:02:36.427"

// bubble down
now.addMinutes(-20)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 22:59:36.427"
```

### addHours()
Add hours to the given date.<br>
Accepts positive number and negative number. If the range is exceeded, it will bubble up or down to the days.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:19:36.427"

now.addHours(0)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:19:46.427"

// bubble up
now.addHours(2)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 01:19:36.427"

// bubble down
now.addHours(-25)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-24 22:19:36.427"
```

### addDays()
Add days to the given date.<br>
Accepts positive number and negative number. If the range is exceeded, it will bubble up or down to the months.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-25 23:49:57.600"

now.addDays(3)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-28 23:49:57.600"

// bubble up
now.addDays(10)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-12-05 23:49:57.600"

// bubble down
now.addDays(-26)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-10-30 23:49:57.600"
```

### addWeeks()
Add weeks to the given date.<br>
Accepts positive number and negative number. If the range is exceeded, it will bubble up or down to the months.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 00:08:17.419"

now.addWeeks(1)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-12-03 00:08:17.419"

// bubble up
now.addWeeks(2)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-12-10 00:08:17.419"

// bubble down
now.addWeeks(-4)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-10-29 00:08:17.419"
```

### addMonths()
Add months to the given date.<br>
Accepts positive number and negative number. If the range is exceeded, it will bubble up or down to the years.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 00:08:17.419"

now.addMonths(1)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-12-26 00:08:17.419"

// bubble up
now.addMonths(2)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2018-01-26 00:08:17.419"

// bubble down
now.addMonths(-12)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2016-11-26 00:08:17.419"
```

### addQuarters()
Add quarters to the given date.<br>
Accepts positive number and negative number. If the range is exceeded, it will bubble up or down to the years.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 00:08:17.419"

now.addQuarters(0)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 00:08:17.419"

// bubble up
now.addQuarters(1)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2018-02-26 00:08:17.419"

// bubble down
now.addQuarters(-4)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2016-11-26 00:08:17.419"
```

### addYears()
Add years to the given date.<br>
Accepts positive number and negative number.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 00:08:17.419"

now.addYears(1)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2018-11-26 00:08:17.419"

now.addYears(-1)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2016-11-26 00:08:17.419"
```

### truncate(type)
Returns the result of rounding date toward zero according to **type**.<br>
**type** should be a value of array: ['year', 'month', 'day', 'hour', 'minute', 'second', 'milliSecond'].
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 00:08:17.419"

now.truncate('milliSecond')
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2018-11-26 00:08:17.419"

now.truncate('second')
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2018-11-26 00:08:17.000"

now.truncate('minute')
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2018-11-26 00:08:00.000"

now.truncate('hour')
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2018-11-26 00:00:00.000"

now.truncate('day')
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2018-11-26 00:00:00.000"

now.truncate('month')
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2018-11-01 00:00:00.000"

now.truncate('year')
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2018-01-01 00:00:00.000"
```

### beginningOfSecond(['self'])
Returns the beginning of seconds.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 01:27:44.363"

now.beginningOfSecond() // "2017-11-26 01:27:44.000"

// pass 'self'
self = now.beginningOfSecond('self')
self.format('LLLL') // "Sunday, November 26, 2017 1:27 AM"
self.elapse() // "4 minutes ago"
```

### beginningOfMinute(['self'])
Returns the beginning of minute.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 01:43:30.626"

now.beginningOfMinute() // "2017-11-26 01:43:00"

// pass 'self'
self = now.beginningOfMinute('self')
self.format('LLLL') // "Sunday, November 26, 2017 1:43 AM"
self.elapse() // "in an hour"
```

### beginningOfHour(['self'])
Returns the beginning of hour.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 01:43:30.626"

now.beginningOfHour() // "2017-11-26 01:00:00"

// pass 'self'
self = now.beginningOfHour('self')
self.format('LLLL') // "Sunday, November 26, 2017 1:00 AM"
self.elapse() // "in 5 minutes"
```

### beginningOfDay(['self'])
Returns the beginning of day.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 01:43:30.626"

now.beginningOfDay() // "2017-11-26 00:00:00"

// pass 'self'
self = now.beginningOfDay('self')
self.format('LLLL') // "Sunday, November 26, 2017 12:00 AM"
self.elapse() // "an hour ago"
```

### beginningOfWeek(['self'])
Returns the beginning of week.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 01:43:30.626"

now.beginningOfWeek() // "2017-11-26 00:00:00"

// Set Monday as first day, default is Sunday
now.firstDayMonday = true
now.beginningOfWeek() // "2017-11-20 00:00:00"

// pass 'self'
self = now.beginningOfWeek('self')
self.format('LLLL') // "Sunday, November 26, 2017 12:00 AM"
self.elapse() // "an hour ago"
```

### beginningOfMonth(['self'])
Returns the beginning of month.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 01:43:30.626"

now.beginningOfMonth() // "2017-11-01 00:00:00"

// pass 'self'
self = now.beginningOfMonth('self')
self.format('LLLL') // "Wednesday, November 1, 2017 12:00 AM"
self.elapse() // "25 days ago"
```

### beginningOfQuarter(['self'])
Returns the beginning of quarter.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 01:43:30.626"

now.beginningOfQuarter() // "2017-10-01 00:00:00"

// pass 'self'
self = now.beginningOfQuarter('self')
self.format('LLLL') // "Sunday, October 1, 2017 12:00 AM"
self.elapse() // "2 months ago"
```

### beginningOfYear(['self'])
Returns the beginning of year.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 01:43:30.626"

now.beginningOfYear() // "2017-01-01 00:00:00"

// pass 'self'
self = now.beginningOfYear('self')
self.format('LLLL') // "Sunday, January 1, 2017 12:00 AM"
self.elapse() // "a year ago"
```

### endOfSecond(['self'])
Returns the end of second.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 11:11:07.769"

now.endOfSecond() // "2017-11-26 11:11:07.999"

// pass 'self'
self = now.endOfSecond('self')
self.format('LLLL') // "Sunday, November 26, 2017 11:11 AM"
self.elapse() // "a minute ago"
```

### endOfMinute(['self'])
Returns the end of minute.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 11:11:07.769"

now.endOfMinute() // "2017-11-26 11:11:59.999"

// pass 'self'
self = now.endOfMinute('self')
self.format('LLLL') // "Sunday, November 26, 2017 11:11 AM"
self.elapse() // "2 minutes ago"
```

### endOfHour(['self'])
Returns the end of hour.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 11:11:07.769"

now.endOfHour() // "2017-11-26 11:59:59.999"

// pass 'self'
self = now.endOfHour('self')
self.format('LLLL') // "Sunday, November 26, 2017 11:59 AM"
self.elapse() // "in 44 minutes"
```

### endOfDay(['self'])
Returns the end of day.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 11:11:07.769"

now.endOfDay() // "2017-11-26 23:59:59.999"

// pass 'self'
self = now.endOfDay('self')
self.format('LLLL') // "Sunday, November 26, 2017 11:59 PM"
self.elapse() // "in 13 hours"
```

### endOfWeek(['self'])
Returns the end of week.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 11:11:07.769"

now.endOfWeek() // "2017-12-02 23:59:59.999"

// Set Monday as first day, default is Sunday
now.firstDayMonday = true
now.endOfWeek() // "2017-11-26 23:59:59.999"

// pass 'self'
self = now.endOfWeek('self')
self.format('LLLL') // "Saturday, December 2, 2017 11:59 PM"
self.elapse() // "in 7 days"
```

### endOfMonth(['self'])
Returns the end of month.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 11:11:07.769"

now.endOfMonth() // "2017-11-30 23:59:59.999"

// pass 'self'
self = now.endOfMonth('self')
self.format('LLLL') // "Thursday, November 30, 2017 11:59 PM"
self.elapse() // "in 5 days"
```

### endOfQuarter(['self'])
Returns the end of quarter.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 11:11:07.769"

now.endOfQuarter() // "2017-12-31 23:59:59.999"

// pass 'self'
self = now.endOfQuarter('self')
self.format('LLLL') // "Sunday, December 31, 2017 11:59 PM"
self.elapse() // "in a month"
```

### endOfYear(['self'])
Returns the end of year.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 11:11:07.769"

now.endOfYear() // "2017-12-31 23:59:59.999"

// pass 'self'
self = now.endOfYear('self')
self.format('LLLL') // "Sunday, December 31, 2017 11:59 PM"
self.elapse() // "in a month"
```

### isNow(obj)
Check if a variable is a Now object.
**obj** is optional. If obj is empty, will check **this**.
```javascript
now = new Now();

// not pass an argument, check this
now.isNow() // true
now.isNow(new Date()) // false
now.isNow(0) // false
now.isNow('') // false
now.isNow(undefined) // false
```

### isLeapYear(year)
Check if the given year is leap year.<br>
**year** is optional. If year is empty, will check **this**. Accept Now type.
```javascript
now = new Now();

// not pass an argument, check this
now.year() // 2017
now.isLeapYear() // false
now.isLeapYear(2000) // true
now.isLeapYear(2008) // true

now1 = new Now(2010, 1)
now.isLeapYear(now1) // false
```

### isBefore(date1, [date2])
Check if **date1** is before **date2**.<br>
**date2** is optional. If **date2** is empty, will check if **this** is before **date1**.<br>
Accept Now type.
```javascript
now = new Now();

date1 = new Date(2017, 1);
date2 = new Date(2020, 1);
now.isBefore(date1, date2) // true

now.isBefore(date1) // false

// receive Now type
now1 = new Now(2017, 1);
now2 = new Now(2020, 1);
now.isBefore(now1, now2) // true
```

### isAfter(date1, [date2])
Check if **date1** is after **date2**. Opposite to **isBefore**<br>
**date2** is optional. If **date2** is empty, will check if **this** is after **date1**.<br>
Accept Now type.
```javascript
now = new Now();

date1 = new Date(2017, 1);
date2 = new Date(2020, 1);
now.isAfter(date1, date2) // false

now.isAfter(date1) // true

// receive Now type
now1 = new Now(2017, 1);
now2 = new Now(2020, 1);
now.isAfter(now1, now2) // false
```

### isEqual(date1, [date2])
Check if **date1** is equal to **date2**.<br>
**date2** is optional. If **date2** is empty, will check if **this** is equal to **date1**.<br>
Accept Now type.
```javascript
now = new Now();

date1 = new Date(2017, 1);
date2 = new Date(2017, 1);
now.isEqual(date1, date2) // true

now.isEqual(date1) // false

// receive Now type
now1 = new Now(2017, 1);
now2 = new Now(2017, 1);
now.isEqual(now1, now2) // true
```

### min(date1, ...rest)
Return the minimal by given dates.<br>
**rest** is optional. If **rest**'s length is 0, return the minimal between **this** and **date1**.
If **rest**'s length > 0, **this** is not include<br>
Accept Now type. Accept Array.<br>
Require at least one argument, if not throw Error.
```javascript
now = new Now();

now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 17:16:41.790"
date1 = new Date(2018, 1);
date2 = new Date(2019, 1);

now.min(date1) // now

now.min(date1, date2) // date1

// receive Now type
now1 = new Now(2018, 1);
now2 = new Now(2019, 1);
now.min(now1, now2) // now1

// receive array
now.min([now1, now2]) // now1

now.min() // Uncaught Error: min require at least one argument
```

### max(date1, ...rest)
Return the maximal by given dates. Opposite to **min**<br>
**rest** is optional. If **rest**'s length is 0, return the maximal between **this** and **date1**.
If **rest**'s length > 0, **this** is not include<br>
Accept Now type. Accept Array.<br>
Require at least one argument, if not throw Error.
```javascript
now = new Now();

now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 17:16:41.790"
date1 = new Date(2018, 1);
date2 = new Date(2019, 1);

now.max(date1) // date1

now.max(date1, date2) // date2

// receive Now type
now1 = new Now(2018, 1);
now2 = new Now(2019, 1);
now.max(now1, now2) // now2

// receive array
now.min([now1, now2]) // now2

now.max() // Uncaught Error: max require at least one argument
```

### between(date1, date2)
Check if **this** is between date1 and date2.<br>
Accept Now type.<br>
If date1 or date2 is empty will throw Error.
```javascript
now = new Now();

now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 17:16:41.790"
date1 = new Date(2018, 1);
date2 = new Date(2019, 1);

now.between(date1, date2) // false

date3 = new Date(2010, 1);
date4 = new Date(2020, 1);
now.between(date3, date4) // true

now.between() // Uncaught Error: between require two arguments
```

### sub(date1, [date2])
Return milliseconds between date1 and date2.<br>
**date2** is optional, if empty, return milliseconds between **this** and date1.<br>
Accept Now type.<br>
Receive at least one argument.
```javascript
now = new Now();

now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 19:33:25.198"
date1 = new Date(2018, 1);
date2 = new Date(2019, 1);

now.sub(date1, date2) // -31536000000

now.sub(date1) // -5718394802

now.sub() // Uncaught Error: sub must be receive more than one argument
```

### since(date1, [date2])
Return milliseconds between date1 and date2.<br>
**date2** is optional, if empty, return milliseconds between current time and date1.<br>
Accept Now type.<br>
Receive at least one argument.
```javascript
now = new Now();

now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 21:01:41.535"
date1 = new Date(2018, 1);
date2 = new Date(2019, 1);

now.since(date1, date2) // 31536000000 (the same as now.sub(date2, date1))

now.since(date1) // -5712947919 (same as now.since(date1, new Now()))

now.since() // Uncaught Error: since must be receive more than one argument
```

### elapse([date])
Return format time pass from date to current time. Alias **timeAgo**<br>
**date** is optional, if empty, return format time pass from **this** to current time.<br>
Accept Now type.
```javascript
now = new Now();

now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 21:13:20.522"

date = new Date(2017, 10, 25);
now.elapse(date) // "7 years ago"

// receive Now type
date = new Now(2017, 10, 25);
now.elapse(date) // "7 years ago"

now.elapse() // "a minute ago"

// same as
now.timeAgo() // "a minute ago"
```

### utcOffset(Number | String, Boolean)
Get the UTC offset in minutes..<br><br>
Getting the utcOffset of the current object:
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 21:39:50.982"

now.utcOffset() // 480
```

Setting the UTC offset by supplying minutes. Note that once you set an offset, it's fixed and won't change on its own (i.e there are no DST rules). 
```javascript
now.utcOffset(120)
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 21:39:50.982"
```
If the input is less than 16 and greater than -16, it will interpret your input as hours instead.
```javascript
now.utcOffset(8) // set hours offset
now.utcOffset(480); // set minutes offset (8 * 60)
```
It is also possible to set the UTC offset from a string.
```javascript
// these are equivalent
now.utcOffset("+08:00");
now.utcOffset(8);
now.utcOffset(480);
```
The utcOffset function has an optional second parameter which accepts a boolean value indicating whether to keep the existing time of day.
1. Passing false (the default) will keep the same instant in Universal Time, but the local time will change.
2. Passing true will keep the same local time, but at the expense of choosing a different point in Universal Time.
One use of this feature is if you want to construct a Now instance with a specific time zone offset using only numeric input values:
```javascript
now = new Now(2017, 0, 1, 0, 0, 0)
now.format() // "2017-01-01T00:00:00+08:00"

now.utcOffset(-5, true)
now.format() // "2017-01-01T00:00:00-05:00"
```

### utc()
Sets a flag on the original Now instance to use UTC to display a Now instance instead of the original Now instance's time.
```javascript
now = new Now();

now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26T22:00:49+08:00"

now.hour(); // 22
now.utc();
now.hour(); // 14 UTC
```

### local()
Sets a flag on the original Now instance to use local time to display a Now instance instead of the original Now instance's time.
```javascript
now = new Now().UTC();

now.format() // "2017-11-26T22:03:47+00:00"

now.hour(); // 22
now.local();
now.hour(); // 6
```

### isDST()
Checks if the given time is in daylight saving time.
```javascript
now = new Now(2011, 2, 12);

now.isDST(); // false

now1 = new Now(2011, 2, 14);
now1.isDST(); // true
```

### isLocal()
Checks if the given time is in Local mode. Default is in Local mode.
```javascript
now = new Now();

now.isLocal(); // true
now.utc()
now.isLocal(); // false
```

### isUTC()
Checks if the given time is in UTC mode. Alias isUtc.
```javascript
now = new Now();

now.isUTC(); // false
now.utc()
now.isUTC(); // true
```

## Format
### locale()
Set the locale for further format. Default locale is 'en'.
```javascript
now = new Now();

now.format("dddd, MMMM Do YYYY, h:mm:ss a") // "Sunday, November 26th 2017, 11:23:40 pm"
now.locale('zh-cn'); // change to china locale
now.format("dddd, MMMM Do YYYY, h:mm:ss a") // "星期日, 十一月 26日 2017, 11:23:40 晚上"
```

### localeData([name])
Return the locale data Object. Default is en's locale data.<br>
**name** is optional, if empty, return default local data Object.
```javascript
now = new Now();

now.localeData() // en's Locale Object (you can check this in chrome devtools)
now.localeData('zh-cn') // zh-cn's Locale Object (you can check this in chrome devtools)
```

### format
**format is borrow from the [moment's format](https://momentjs.com/docs/#/displaying/format/). Respect and gratitude!**<br>
This is the most robust display option. It takes a string of tokens and replaces them with their corresponding values.
```javascript
now = new Now()

now.format();                                // "2017-11-26T23:23:40+08:00"
now.format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, November 26th 2017, 11:23:40 pm"
now.format("ddd, hA");                       // "Sun, 11PM"
```

type | Token | Output
----|------|----
Month | M  | 1 2 ... 11 12
Month | Mo  | 1st 2nd ... 11th 12th
Month | MM  | 01 02 ... 11 12
Month | MMM  | Jan Feb ... Nov Dec
Month | MMMM  | January February ... November December
Quarter | Q  | 1 2 3 4
Quarter | Qo  | 1st 2nd 3rd 4th
Day of Month |	D	| 1 2 ... 30 31
Day of Month | Do |	1st 2nd ... 30th 31st
Day of Month | DD |	01 02 ... 30 31
Day of Year	| DDD |	1 2 ... 364 365
Day of Year	| DDDo | 1st 2nd ... 364th 365th
Day of Year	| DDDD | 001 002 ... 364 365
Day of Week	| d	| 0 1 ... 5 6
Day of Week	| do	| 0th 1st ... 5th 6th
Day of Week	| dd	| Su Mo ... Fr Sa
Day of Week	| ddd	| Sun Mon ... Fri Sat
Day of Week	| dddd	| Sunday Monday ... Friday Saturday
Day of Week (Locale) | e | 0 1 ... 5 6
Day of Week (ISO)	| E	| 1 2 ... 6 7
Week of Year	| w	| 1 2 ... 52 53
Week of Year	| wo	| 1st 2nd ... 52nd 53rd
Week of Year	| ww	| 01 02 ... 52 53
Week of Year (ISO) |	W	| 1 2 ... 52 53
Week of Year (ISO) | Wo	| 1st 2nd ... 52nd 53rd
Week of Year (ISO) | WW	| 01 02 ... 52 53
Year | YY	| 70 71 ... 29 30
Year | YYYY	| 1970 1971 ... 2029 2030
Year | Y	| 1970 1971 ... 9999 +10000 +10001 Note: This complies with the ISO 8601 standard for dates past the year 9999
Week Year	| gg |	70 71 ... 29 30
Week Year	| gggg |	1970 1971 ... 2029 2030
Week Year (ISO)	| GG |	70 71 ... 29 30
Week Year (ISO)	| GGGG |	1970 1971 ... 2029 2030
AM/PM	| A	| AM PM
AM/PM	| a	| am pm
Hour	| H	| 0 1 ... 22 23
Hour	| HH	| 00 01 ... 22 23
Hour	| h	| 1 2 ... 11 12
Hour	| hh |	01 02 ... 11 12
Hour	| k	| 1 2 ... 23 24
Hour	| kk |	01 02 ... 23 24
Minute	| m	| 0 1 ... 58 59
Minute	| mm	| 00 01 ... 58 59
Second	| s	| 0 1 ... 58 59
Second	| ss	| 00 01 ... 58 59
Fractional Second	| S	| 0 1 ... 8 9
Fractional Second	| SS	| 00 01 ... 98 99
Fractional Second	| SSS	| 000 001 ... 998 999
Fractional Second	| SSSS ... SSSSSSSSS	| 000[0..] 001[0..] ... 998[0..] 999[0..]
Time Zone	| z or zz	| EST CST ... MST PST Note: as of 1.6.0, the z/zz format tokens have been deprecated from plain moment objects. Read more about it here. However, they do work if you are using a specific time zone with the moment-timezone addon.
Time Zone | Z	| -07:00 -06:00 ... +06:00 +07:00
Time Zone | ZZ |	-0700 -0600 ... +0600 +0700
Unix Timestamp |	X	| 1360013296
Unix Millisecond Timestamp |	x	| 1360013296123