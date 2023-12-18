
/**

 * @description Encoding and Decoding related util functions

 */
export class EncoderUtil {


    /**

     * @description encodes string into base64 encoded string
     * @param value {string} - value string to be encoded
     * @returns base64 encoded string
     */
    public static base64Encode(value: string) {
        return new Buffer(value).toString('base64');
    }

    /**

     * @description decode string into plain text
     * @param value {string} - value string to be decoded
     * @returns decoded plain text
     */
    public static base64Decode(value: string) {
        return new Buffer(value, 'base64').toString('ascii');
    }
}
