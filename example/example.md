## Stactic Functions

### version

return Now version.

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
