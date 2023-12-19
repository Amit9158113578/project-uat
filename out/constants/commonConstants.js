"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonConstants = void 0;
var CommonConstants;
(function (CommonConstants) {
    CommonConstants.TRUST_PROXY = 'trust proxy';
    CommonConstants.APP_NAME = 'promanage-mw';
    CommonConstants.STATE_COOKIE_STATE = 'state';
    CommonConstants.SESSION_COOKIE_NAME = 'web-token';
    CommonConstants.SESSION_COOKIE_SECRET = '#ZArb3fF)U:vcWG';
    CommonConstants.SESSION_INFO_NAME = 'session_info';
    CommonConstants.OUTPUT_NAME = 'output';
    CommonConstants.PARTICULAR_DEPOSIT_DESCRIPTION = 'Deposit (Refundable)';
    CommonConstants.COUNTRY_CODE = '+91';
    CommonConstants.ALGORITHM = 'HS256';
    CommonConstants.AUDIENCE = 'comsense';
    CommonConstants.ISSUER = 'comsense';
    CommonConstants.JWTPRIVATEKEY = 'MY_SECRET_PRIVATE_KEY';
    //UAT Database
    // export const DBCONFIGURATIONURL = 'mongodb+srv://londherohit7777:londherohit7777@cluster0.8etnovu.mongodb.net/comsense_promanage?retryWrites=true&w=majority';
    // export const DBCONFIGURATIONPASSWORD = 'londherohit7777';
    // export const DBCONFIGURATIONUSERNAME = 'londherohit7777';
    //Prod Database
    CommonConstants.DBCONFIGURATIONURL = 'mongodb+srv://promanage_user:Comsense@007@cluster0.pxppdug.mongodb.net/comsense_promanage?retryWrites=true&w=majority';
    CommonConstants.DBCONFIGURATIONPASSWORD = 'Comsense@007';
    CommonConstants.DBCONFIGURATIONUSERNAME = 'promanage_user';
    CommonConstants.HOST = 'project.comsensetechnologies.com/#/reset-password';
    CommonConstants.RESETPASSWORDURL = '/resetPassword';
    CommonConstants.APIURL = 'https://meeting.comsensetechnologies.com:8443/meeting-mw/sendEmail/resetPass';
    // export const DIRNAME='D:\\MTG\\documents'
    CommonConstants.DIRNAME = '/mnt/promanage/documents';
})(CommonConstants = exports.CommonConstants || (exports.CommonConstants = {}));
