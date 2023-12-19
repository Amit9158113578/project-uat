"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathUtils = void 0;
/**

 * @description Math util functions

 */
class MathUtils {
    static roundOff(num) {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }
    static formatCurrency(amountInCent) {
        const amount = Math.round(amountInCent / 100);
        const formattedAmount = amount.toString().includes('.') ? '$' + amount.toString() : '$' + amount.toString() + '.00';
        return formattedAmount;
    }
    static convert$ToCents(amountInCent) {
        if (amountInCent) {
            const amount = Math.round(amountInCent * 100);
            return amount;
        }
        else {
            return 0;
        }
    }
    static convertCentsTo$(amountInCent) {
        const amount = Math.round(amountInCent / 100);
        return amount;
    }
}
exports.MathUtils = MathUtils;
