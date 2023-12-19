"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldNames = exports.DBConstants = void 0;
/**

 * @description - error codes

 */
var DBConstants;
(function (DBConstants) {
    DBConstants.DB_ID_COLUMN_NAME = 'id';
    DBConstants.DB_QUERY_RESULT_LIMIT = Infinity;
    DBConstants.DB_QUERY_MAX_RESULT = 1000;
    // MongoDb Collections
    DBConstants.DB_TABLE_USERS = 'users';
    DBConstants.DB_TABLE_RESOURCES = 'resources';
    DBConstants.DB_TABLE_CLIENTS = 'clients';
    DBConstants.DB_TABLE_ROLES = 'roles';
    DBConstants.DB_TABLE_DEPARTMENTS = 'departments';
    DBConstants.DB_TABLE_CATEGORY = 'category';
    DBConstants.DB_TABLE_PROJECTS = 'projects';
    DBConstants.DB_TABLE_JOBTITLES = 'jobtitles';
})(DBConstants = exports.DBConstants || (exports.DBConstants = {}));
/**

 * @description - DB Field names

 */
var FieldNames;
(function (FieldNames) {
    // Common fields
    /**
     * Mongo collection document id
     */
    FieldNames.FIELD_ID = 'id';
    /**
     * Mongo collection document id
     */
    FieldNames.FIELD_CREATED_ON = 'createdDate';
    /**
     * Mongo collection document id
     */
    FieldNames.FIELD_LAST_MODIFIED_ON = 'modifiedDate';
    /**
    * Mongo collection document id
    */
    FieldNames.FIELD_CREATED_BY = 'createdBy';
    /**
     * Mongo collection document id
     */
    FieldNames.FIELD_LAST_MODIFIED_BY = 'modifiedBy';
    /**
     * @description [Table - user Field - email]
     */
    FieldNames.FIELD_EMAIL = 'email';
    /**
     * @description [Table - accessKey Field - accessKeyId]
     */
    FieldNames.FIELD_ACCESS_ID = 'accessKeyId';
    /**
     * @description [Table - user Field - phone]
     */
    FieldNames.FIELD_PHONE = 'phone';
    /**
   * @description [Table - user Field - phone]
   */
    FieldNames.FIELD_EMPLOYEE_CODE = 'employeeCode';
    /**
     * @description [Table - appsettings Field - key]
     */
    FieldNames.FIELD_KEY = 'key';
    /**
     * @description [Table - members Field - userId]
     */
    FieldNames.FIELD_USER_ID = 'userId';
    FieldNames.FIELD_TRANSPORTER_ID = 'transporterId';
    /**
     * @description [Table - organizations Field - accessCode]
     */
    FieldNames.FIELD_ACCESS_CODE = 'accessCode';
    /**
     * @description [Table - patients Field - organizationId]
     */
    FieldNames.FIELD_ORGANIZATION_ID = 'organizationId';
    /**
      * @description [Table - invoices Field - customerId]
      */
    FieldNames.FIELD_CUSTOMER_ID = 'customerId';
    /**
     * @description [Table - patients Field - status]
     */
    FieldNames.FIELD_STATUS = 'status';
    /**
     * @description [Table - languages Field - billingCode]
     */
    FieldNames.FIELD_BILLING_CODE = 'billingCode';
    /**
     * @description [Table - languages Field - serviceType]
     */
    FieldNames.FIELD_SERVICE_TYPE = 'serviceType';
    /**
     * @description [Table - languages Field - active]
     */
    FieldNames.FIELD_ACTIVE = 'active';
    /**
     * @description [Table - service_requests Field - code]
     */
    FieldNames.FIELD_CODE = 'code';
    /**
    * @description [Table - sequences Field - name]
    */
    FieldNames.FIELD_NAME = 'name';
    /**
    * @description [Table - sequences Field - title]
    */
    FieldNames.FIELD_TITLE = 'title';
    /**
     * @description [Table - sequences Field - requestId]
     */
    FieldNames.FIELD_REQUEST_ID = 'requestId';
    /**
     * @description [Table - service_requests Field - hash]
     */
    FieldNames.FIELD_HASH = 'hash';
    /**
    * @description [Table - user Field - scopes]
    */
    FieldNames.FIELD_SCOPES = 'scopes';
    /**
    * @description [Table - user Field - scopes]
    */
    FieldNames.FIELD_ROLE = 'role';
    /**
    * @description [Table - application Field - host]
    */
    FieldNames.FIELD_HOST = 'host';
    /**
     * @description [Table - service_requests Field - assignment]
     */
    FieldNames.FIELD_ASSIGNMENT = 'assignment';
    /**
     * @description [Table - organizations Field - status]
     */
    FieldNames.FIELD_ACTIVEORG = 'status';
    /**
     * @description [Table - payouts Field - vendorId]
     */
    FieldNames.FIELD_VENDOR_ID = 'vendorId';
    /**
     * @description [Table - service_requests Field - locationId]
     */
    FieldNames.FIELD_LOCATION_ID = 'locationId';
})(FieldNames = exports.FieldNames || (exports.FieldNames = {}));
