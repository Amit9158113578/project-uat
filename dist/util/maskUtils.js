"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaskUtils = void 0;
const commonUtils_1 = require("./commonUtils");
/**

 * @description Mask util functions

 */
class MaskUtils {
    static maskObj(object, fields) {
        let objects = [];
        if (Array.isArray(object)) {
            objects = object;
        }
        else {
            objects.push(object);
        }
        for (let index = 0; index < objects.length; index++) {
            const obj = objects[index];
            const keys = Object.keys(obj);
            for (let index = 0; index < keys.length; index++) {
                const field = keys[index];
                if ((obj[field] instanceof Object && !Array.isArray(obj[field])) || (Array.isArray(obj[field]) &&
                    !commonUtils_1.CommonUtils.isEmpty(obj[field]) && obj[field][0] instanceof Object)) {
                    obj[field] = this.maskObj(obj[field], fields);
                }
                else if (fields.includes(field) && obj[field]) {
                    if (this.EMAIL_IDENTIFIERS.includes(field.toLowerCase())) {
                        if (Array.isArray(obj[field])) {
                            for (let index = 0; index < obj[field].length; index++) {
                                obj[field][index] = this.maskEmail(obj[field][index]);
                            }
                        }
                        else {
                            obj[field] = this.maskEmail(obj[field]);
                        }
                    }
                    else if (this.PHONE_IDENTIFIERS.includes(field.toLowerCase())) {
                        if (Array.isArray(obj[field])) {
                            for (let index = 0; index < obj[field].length; index++) {
                                obj[field][index] = this.maskPhone(obj[field][index]);
                            }
                        }
                        else {
                            obj[field] = this.maskPhone(obj[field]);
                        }
                    }
                    else {
                        obj[field] = obj[field].toString().replace(new RegExp(obj[field], 'g'), `*`.repeat(obj[field].length));
                    }
                }
            }
        }
        return object;
    }
    static mask(obj, fieldsToBeMasked) {
        if (!fieldsToBeMasked) {
            fieldsToBeMasked = require('../private/security/MaskingFields.json');
        }
        return this.maskObj(obj, fieldsToBeMasked);
    }
    static maskPhone(phone) {
        const options = {
            maskWith: '*',
            unmaskedEndDigits: 1,
            unmaskedStartDigits: 4,
        };
        let maskLength = phone.length - options.unmaskedStartDigits - options.unmaskedEndDigits;
        if ((options.unmaskedStartDigits + options.unmaskedEndDigits) >= phone.length) {
            return phone;
        }
        return phone.substr(0, options.unmaskedStartDigits) +
            `${options.maskWith}`.repeat(maskLength) + phone.substr(phone.length - options.unmaskedEndDigits);
    }
    static maskEmail(email) {
        const options = {
            maskAtTheRate: false,
            maskWith: '*',
            unmaskedEndCharactersAfterAt: 2,
            unmaskedStartCharactersBeforeAt: 3,
        };
        let maskedEmail = '';
        const indexOfAt = email.indexOf('@');
        if (indexOfAt < 0) {
            return email;
        }
        const [before, after] = email.split('@');
        const beforeLength = before.length;
        const afterLength = after.length;
        maskedEmail += (options.unmaskedStartCharactersBeforeAt >= beforeLength) ? before :
            before.substr(0, options.unmaskedStartCharactersBeforeAt) +
                `${options.maskWith}`.repeat(beforeLength - options.unmaskedStartCharactersBeforeAt);
        maskedEmail += options.maskAtTheRate ? options.maskWith : '@';
        maskedEmail += (options.unmaskedEndCharactersAfterAt >= afterLength) ? after :
            (`${options.maskWith}`.repeat(afterLength - options.unmaskedEndCharactersAfterAt)
                + after.substr(afterLength - options.unmaskedEndCharactersAfterAt));
        return maskedEmail;
    }
    maskString(str) {
        return str.replace(new RegExp(str, 'g'), `*`.repeat(str.length));
    }
}
exports.MaskUtils = MaskUtils;
MaskUtils.EMAIL_IDENTIFIERS = ['email', 'participants'];
MaskUtils.PHONE_IDENTIFIERS = ['phone', 'mobile'];
