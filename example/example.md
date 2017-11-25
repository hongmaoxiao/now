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