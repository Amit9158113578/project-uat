"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
const moment = require("moment-timezone");
/**

 * @description Date util functions

 */
class DateUtils {
    static getCurrentTimeInMillis() {
        const timeInMillis = new Date().getTime();
        return timeInMillis;
    }
    static getMMMYYYY(date, timeZone) {
        if (!timeZone) {
            timeZone = this.DEFAULT_TIMEZONE;
        }
        return moment.tz(date, timeZone).format('MMM-YYYY');
    }
    static getCurrentDate() {
        return new Date();
    }
    static getHours(dateinMillis) {
        const diff = moment.duration(dateinMillis);
        return diff.asHours();
    }
    static formatDate(date, format, timeZone) {
        if (!timeZone) {
            timeZone = this.DEFAULT_TIMEZONE;
        }
        if (!format) {
            format = DateUtils.FORMAT_DATETIME_AM_PM;
        }
        return moment.tz(date, timeZone).format(format);
    }
    static convertToUTCInMillis(dateTime, timeZone) {
        timeZone = timeZone ? timeZone : this.DEFAULT_TIMEZONE;
        const datetimeWithTimezone = moment.tz(dateTime, timeZone).format('YYYY-MM-DD HH:mm:ss ZZ');
        const timeInMillis = Date.parse(datetimeWithTimezone);
        return new Date(timeInMillis).getTime();
    }
    static convertMinutesToMillis(minutes) {
        return minutes ? Math.floor(minutes * 60 * 1000) : 0;
    }
    static convertMinutesToSeconds(minutes) {
        return minutes ? Math.floor(minutes * 60) : 0;
    }
    static convertHoursToMillis(hours) {
        return hours ? Math.floor(hours * 60 * 60 * 1000) : 0;
    }
    static convertSecondsToMillis(seconds) {
        return seconds ? Math.floor(seconds * 1000) : 0;
    }
    static convertMillisToMinutes(millis) {
        return millis ? Math.floor(millis / 60000) : 0;
    }
    static convertMillisToHours(millis) {
        const minutes = this.convertMillisToMinutes(millis);
        return minutes ? Math.floor(minutes / 60) : 0;
    }
    static convertHoursToDays(hours) {
        return hours ? Math.floor(hours / 24) : 0;
    }
}
exports.DateUtils = DateUtils;
DateUtils.DATETIME_FORMAT_TIMEZONE = 'MMM DD, YYYY HH:mm z';
DateUtils.FORMAT_DATETIME_AM_PM = 'MM/DD/YYYY h:mm a z';
DateUtils.FORMAT_DATE = 'YYYY-MM-DD';
DateUtils.DEFAULT_TIMEZONE = 'Asia/Kolkata';
