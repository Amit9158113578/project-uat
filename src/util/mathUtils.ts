

/**

 * @description Math util functions

 */
export class MathUtils {

    public static roundOff(num: number) {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    public static formatCurrency(amountInCent: number): string {
        const amount = Math.round(amountInCent / 100);
        const formattedAmount = amount.toString().includes('.') ? '$' + amount.toString() : '$' + amount.toString() + '.00';
        return formattedAmount;
    }

    public static convert$ToCents(amountInCent: number) {
        if (amountInCent) {
            const amount = Math.round(amountInCent * 100);
            return amount;
        } else {
            return 0;
        }
    }

    public static convertCentsTo$(amountInCent: number): number {
        const amount = Math.round(amountInCent / 100);
        return amount;
    }

}
