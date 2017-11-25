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

```javascript
Now.defineLocale
```

### updateLocale

```javascript
Now.updateLocale
```
### locales
return all the locales.
```javascript
Now.locales()
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

### beginningOfMilliSecond(['self'])
Returns the beginning of milliseconds.
**'self'** is optional. If pass **'self'** return Now instance.
```javascript
now = new Now();
now.format('YYYY-MM-DD HH:mm:ss.SSS') // "2017-11-26 01:27:44.363"

now.beginningOfMilliSecond() // "2017-11-26 01:27:44.363"

// pass 'self'
self = now.beginningOfMilliSecond('self')
self.format('LLLL') // "Sunday, November 26, 2017 1:27 AM"
self.elapse() // "2 minutes ago"
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