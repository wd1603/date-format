'use strict';

function padWithZeros(vNumber, width) {
    var numAsString = vNumber.toString();
    while (numAsString.length < width) {
        numAsString = '0' + numAsString;
    }
    return numAsString;
}

function addZero(vNumber) {
    return padWithZeros(vNumber, 2);
}

/**
 * Formats the TimeOffset
 * Thanks to http://www.svendtofte.com/code/date_format/
 * @private
 */
function offset(timezoneOffset) {
  // Difference to Greenwich time (GMT) in hours
    var os = Math.abs(timezoneOffset);
    var h = String(Math.floor(os / 60));
    var m = String(os % 60);
    if (h.length === 1) {
        h = '0' + h;
    }
    if (m.length === 1) {
        m = '0' + m;
    }
    return timezoneOffset < 0 ? '+' + h + m : '-' + h + m;
}

function asString(format, date, timezoneOffset) {
    if (typeof format !== 'string') {
        timezoneOffset = date;
        date = format;
        format = module.exports.ISO8601_FORMAT;
    }
    if (!date) {
        date = new Date();
    }
  // make the date independent of the system timezone by working with UTC
    if (timezoneOffset === undefined) {
        timezoneOffset = date.getTimezoneOffset();
    }

    date.setUTCMinutes(date.getUTCMinutes() - timezoneOffset);
    var vDay = addZero(date.getUTCDate());
    var vMonth = addZero(date.getUTCMonth() + 1);
    var vYearLong = addZero(date.getUTCFullYear());
    var vYearShort = addZero(date.getUTCFullYear().toString().substring(2, 4));
    var vYear = (format.indexOf('yyyy') > -1 ? vYearLong : vYearShort);
    var vHour = addZero(date.getUTCHours());
    var vMinute = addZero(date.getUTCMinutes());
    var vSecond = addZero(date.getUTCSeconds());
    var vMillisecond = padWithZeros(date.getUTCMilliseconds(), 3);
    var vTimeZone = offset(timezoneOffset);
    date.setUTCMinutes(date.getUTCMinutes() + timezoneOffset);
    var formatted = format
    .replace(/dd/g, vDay)
    .replace(/MM/g, vMonth)
    .replace(/y{1,4}/g, vYear)
    .replace(/hh/g, vHour)
    .replace(/mm/g, vMinute)
    .replace(/m5/g, addZero(Math.floor(date.getUTCMinutes()/5)*5))
    .replace(/ss/g, vSecond)
    .replace(/SSS/g, vMillisecond)
    .replace(/O/g, vTimeZone);
    return formatted;
}

module.exports = asString;
module.exports.asString = asString;
module.exports.ISO8601_FORMAT = 'yyyy-MM-ddThh:mm:ss.SSS';
module.exports.ISO8601_WITH_TZ_OFFSET_FORMAT = 'yyyy-MM-ddThh:mm:ss.SSSO';
module.exports.DATETIME_FORMAT = 'dd MM yyyy hh:mm:ss.SSS';
module.exports.ABSOLUTETIME_FORMAT = 'hh:mm:ss.SSS';
