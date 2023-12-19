"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionUtil = void 0;
const crypto = require("crypto");
const commonConstants_1 = require("../constants/commonConstants");
/**

 * @description Encryption util functions

 */
class EncryptionUtil {
    /**

     * @description signs Http request
     * @param request {Request} - express request
     * @param privateKey {string} - private key
     * @param date {date} - Date
     * @returns signed request string
     */
    static signRequest(request, privateKey, date) {
        let jsonTypes = [
            'application/json',
            'application/json-patch+json',
            'application/vnd.api+json',
            'application/csp-report',
        ];
        let type = request.contentType;
        type = type.split(';')[0];
        // support parsing of json; otherwise, new string from request.body
        let body = (jsonTypes.indexOf(type) > -1 && request.body) ? JSON.stringify(request.body) : '';
        return crypto.createHmac('sha1', privateKey)
            .update(Buffer.from(request.method + '\n' +
            (request.body ? crypto.createHash('md5').update(body, 'utf8').digest('hex') : '') + '\n' +
            type + '\n' + date, 'utf-8')).digest('base64');
    }
    // /**
    //  * @description encrypts plain text
    //  * @param plainText {string} - plain text to be encrypted
    //  * @param salt {string} - salt hashing key
    //  * @returns encrypted string
    //  */
    // public static encrypt(plainText: string, salt: string): string {
    //     return bcrypt.hashSync(plainText, salt);
    // }
    // /**
    //  * @description generates hashing salt key
    //  * @param length {number} - salt key length
    //  * @returns salt
    //  */
    // public static generateSalt(length: number): string {
    //     return bcrypt.genSaltSync(length);
    // }
    // /**
    //  * @description compares plain text with encrypted text
    //  * @param plainText {string} - plain text to be encrypted
    //  * @param salt {string} - salt hashing key
    //  * @returns true if plain text matches with encrypted string
    //  */
    // public static compare(plainText: string, encryptedText: string): boolean {
    //     console.log(plainText,encryptedText);
    //     return bcrypt.compareSync(plainText, encryptedText);
    // }
    /**
    
     * @description encrypts plain text
     * @param plainText {string} - plain text to be encrypted
     * @returns encrypted string
     */
    static encryptString(plainText) {
        const cipher = crypto.createCipher('aes256', commonConstants_1.CommonConstants.JWTPRIVATEKEY);
        const encrypted = cipher.update(plainText, 'utf8', 'hex') + cipher.final('hex');
        return encrypted;
    }
    /**
    
     * @description decrypts encrypted text
     * @param encryptedText {string} - encrypted text to be decrypted
     * @returns decrypted string
     */
    static decryptString(encryptedText) {
        const decipher = crypto.createDecipher('aes256', commonConstants_1.CommonConstants.JWTPRIVATEKEY);
        const decryptedText = decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');
        return decryptedText;
    }
    /**
    
     * @description decrypts encrypted text
     * @param encryptedText {string} - encrypted text to be decrypted
     * @returns decrypted string
     */
    static comparePasswords(plainTextPassword, encryptedPassword) {
        const decryptedPassword = this.decryptString(encryptedPassword);
        console.log('decryptedPassword', decryptedPassword);
        return plainTextPassword === decryptedPassword;
    }
}
exports.EncryptionUtil = EncryptionUtil;
