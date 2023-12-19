"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationUtils = void 0;
const ajv_1 = require("ajv");
const baseDIConfig_1 = require("../config/baseDIConfig");
const baseIdentifiers_1 = require("../config/baseIdentifiers");
const ajvErrors = require('ajv-errors');
/**

 

 * @description Validation util functions

 

 */
class ValidationUtils {
    /**

 

     * @description validates object with provided schema

     * @param object {Object} - JSON object to be validated

     * @param schema {JSONSchema} - JSON Validation Schema

     * @returns array<error> if validation errors

     */
    static validate(object, schema) {
        let errors = [];
        let validator = new ajv_1.default({ allErrors: true }); // Exclude jsonPointers
        let loggerService = baseDIConfig_1.BaseDIConfig.getContainer().get(baseIdentifiers_1.BaseIdentifiers.LoggerService);
        try {
            ajvErrors(validator);
            let validate = validator.compile(schema);
            let isValid = validate(object);
            if (!isValid) {
                validate.errors.forEach(error => {
                    errors.push(error.message);
                });
                loggerService.warn('ValidationUtils:: Request object not matching the schema: ', validate.errors);
            }
        }
        catch (error) {
            loggerService.error('Error :: ValidationUtils::validate- ', error);
        }
        return errors;
    }
}
exports.ValidationUtils = ValidationUtils;
