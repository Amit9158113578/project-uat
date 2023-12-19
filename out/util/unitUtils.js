"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitUtils = void 0;
/**

 * @description Unit util functions

 */
class UnitUtils {
    static convertMilesToMeters(miles) {
        return miles * 1609.344;
    }
    static convertMetersToMiles(meters) {
        return meters * 0.000621371192;
    }
}
exports.UnitUtils = UnitUtils;
