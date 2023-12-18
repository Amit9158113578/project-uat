
import * as moment from 'moment-timezone';
/**

 * @description Date util functions

 */
export class DateUtils {

    public static readonly DATETIME_FORMAT_TIMEZONE = 'MMM DD, YYYY HH:mm z';

    public static readonly FORMAT_DATETIME_AM_PM = 'MM/DD/YYYY h:mm a z';

    public static readonly FORMAT_DATE = 'YYYY-MM-DD';

    public static readonly DEFAULT_TIMEZONE = 'Asia/Kolkata';

    public static getCurrentTimeInMillis(): number {
        const timeInMillis = new Date().getTime();
        return timeInMillis;
    }

    public static getMMMYYYY(date: any, timeZone?: string): string {
        if (!timeZone) {
            timeZone = this.DEFAULT_TIMEZONE;
        }
        return moment.tz(date, timeZone).format('MMM-YYYY');
    }

    public static getCurrentDate(): Date {
        return new Date();
    }

    public static getHours(dateinMillis: any): any {
        const diff = moment.duration(dateinMillis);
        return diff.asHours();
    }

    public static formatDate(date: any, format?: string, timeZone?: string): string {
        if (!timeZone) {
            timeZone = this.DEFAULT_TIMEZONE;
        }
        if (!format) {
            format = DateUtils.FORMAT_DATETIME_AM_PM;
        }
        return moment.tz(date, timeZone).format(format);
    }

    public static convertToUTCInMillis(dateTime: any, timeZone?: string): number {
        timeZone = timeZone ? timeZone : this.DEFAULT_TIMEZONE;
        const datetimeWithTimezone = moment.tz(dateTime, timeZone).format('YYYY-MM-DD HH:mm:ss ZZ');
        const timeInMillis = Date.parse(datetimeWithTimezone);
        return new Date(timeInMillis).getTime();
    }

    public static convertMinutesToMillis(minutes: number): number {
        return minutes ? Math.floor(minutes * 60 * 1000) : 0;
    }

    public static convertMinutesToSeconds(minutes: number): number {
        return minutes ? Math.floor(minutes * 60) : 0;
    }

    public static convertHoursToMillis(hours: number): number {
        return hours ? Math.floor(hours * 60 * 60 * 1000) : 0;
    }

    public static convertSecondsToMillis(seconds: number): number {
        return seconds ? Math.floor(seconds * 1000) : 0;
    }

    public static convertMillisToMinutes(millis: number): number {
        return millis ? Math.floor(millis / 60000) : 0;
    }

    public static convertMillisToHours(millis: number): number {
        const minutes = this.convertMillisToMinutes(millis);
        return minutes ? Math.floor(minutes / 60) : 0;
    }

    public static convertHoursToDays(hours: number): number {
        return hours ? Math.floor(hours / 24) : 0;
    }
}
