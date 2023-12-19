"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncoderUtil = void 0;
/**

 * @description Encoding and Decoding related util functions

 */
class EncoderUtil {
    /**

     * @description encodes string into base64 encoded string
     * @param value {string} - value string to be encoded
     * @returns base64 encoded string
     */
    static base64Encode(value) {
        return new Buffer(value).toString('base64');
    }
    /**

     * @description decode string into plain text
     * @param value {string} - value string to be decoded
     * @returns decoded plain text
     */
    static base64Decode(value) {
        return new Buffer(value, 'base64').toString('ascii');
    }
}
exports.EncoderUtil = EncoderUtil;
