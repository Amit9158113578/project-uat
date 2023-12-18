/**

 * @description - error codes

 */
export namespace DBConstants {
  export const DB_ID_COLUMN_NAME = 'id';
  export const DB_QUERY_RESULT_LIMIT = Infinity;
  export const DB_QUERY_MAX_RESULT = 1000;
  // MongoDb Collections
  export const DB_TABLE_USERS = 'users';
  export const DB_TABLE_RESOURCES = 'resources';
  export const DB_TABLE_CLIENTS= 'clients';
  export const DB_TABLE_ROLES= 'roles';
  export const DB_TABLE_DEPARTMENTS= 'departments';
  export const DB_TABLE_CATEGORY= 'category';
  export const DB_TABLE_PROJECTS= 'projects';
  export const DB_TABLE_JOBTITLES = 'jobtitles';

}

/**

 * @description - DB Field names

 */
export namespace FieldNames {

  // Common fields
  /**
   * Mongo collection document id
   */
  export const FIELD_ID = 'id';

  /**
   * Mongo collection document id
   */
  export const FIELD_CREATED_ON = 'createdDate';

  /**
   * Mongo collection document id
   */
  export const FIELD_LAST_MODIFIED_ON = 'modifiedDate';


   /**
   * Mongo collection document id
   */
   export const FIELD_CREATED_BY = 'createdBy';

   /**
    * Mongo collection document id
    */
   export const FIELD_LAST_MODIFIED_BY = 'modifiedBy';

  /**
   * @description [Table - user Field - email]
   */
  export const FIELD_EMAIL = 'email';

  /**
   * @description [Table - accessKey Field - accessKeyId]
   */
  export const FIELD_ACCESS_ID = 'accessKeyId';

  /**
   * @description [Table - user Field - phone]
   */
  export const FIELD_PHONE = 'phone';

    /**
   * @description [Table - user Field - phone]
   */
    export const FIELD_EMPLOYEE_CODE = 'employeeCode';

  /**
   * @description [Table - appsettings Field - key]
   */
  export const FIELD_KEY = 'key';

  /**
   * @description [Table - members Field - userId]
   */
  export const FIELD_USER_ID = 'userId';

  export const FIELD_TRANSPORTER_ID = 'transporterId'
  /**
   * @description [Table - organizations Field - accessCode]
   */
  export const FIELD_ACCESS_CODE = 'accessCode';

  /**
   * @description [Table - patients Field - organizationId]
   */
  export const FIELD_ORGANIZATION_ID = 'organizationId';
  /**
    * @description [Table - invoices Field - customerId]
    */
  export const FIELD_CUSTOMER_ID = 'customerId';
  /**
   * @description [Table - patients Field - status]
   */
  export const FIELD_STATUS = 'status';

  /**
   * @description [Table - languages Field - billingCode]
   */
  export const FIELD_BILLING_CODE = 'billingCode';

  /**
   * @description [Table - languages Field - serviceType]
   */
  export const FIELD_SERVICE_TYPE = 'serviceType';

  /**
   * @description [Table - languages Field - active]
   */
  export const FIELD_ACTIVE = 'active';

  /**
   * @description [Table - service_requests Field - code]
   */
  export const FIELD_CODE = 'code';

  /**
  * @description [Table - sequences Field - name]
  */
  export const FIELD_NAME = 'name';

  
  /**
  * @description [Table - sequences Field - title]
  */
  export const FIELD_TITLE = 'title';

  /**
   * @description [Table - sequences Field - requestId]
   */
  export const FIELD_REQUEST_ID = 'requestId';
  /**
   * @description [Table - service_requests Field - hash]
   */
  export const FIELD_HASH = 'hash';

   /**
   * @description [Table - user Field - scopes]
   */
  export const FIELD_SCOPES = 'scopes';


  
   /**
   * @description [Table - user Field - scopes]
   */
   export const FIELD_ROLE = 'role';
   /**
   * @description [Table - application Field - host]
   */
  export const FIELD_HOST = 'host';
  /**
   * @description [Table - service_requests Field - assignment]
   */
  export const FIELD_ASSIGNMENT = 'assignment';
  /**
   * @description [Table - organizations Field - status]
   */
  export const FIELD_ACTIVEORG = 'status';
  /**
   * @description [Table - payouts Field - vendorId]
   */
  export const FIELD_VENDOR_ID = 'vendorId';
  /**
   * @description [Table - service_requests Field - locationId]
   */
  export const FIELD_LOCATION_ID = 'locationId';

}
