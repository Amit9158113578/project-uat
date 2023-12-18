/**

 * @description Unit util functions

 */
export class UnitUtils {


    public static convertMilesToMeters(miles: number) {
        return miles * 1609.344;
    }

    public static convertMetersToMiles(meters: number) {
        return meters * 0.000621371192;
    }

}
