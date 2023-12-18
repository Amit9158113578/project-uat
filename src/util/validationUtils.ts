import Ajv, { Options } from 'ajv';

import { BaseDIConfig } from '../config/baseDIConfig';

import { ILoggerService } from '../service/util/iLoggerService';

import { BaseIdentifiers } from '../config/baseIdentifiers';

const ajvErrors = require('ajv-errors');

 

/**

 

 * @description Validation util functions

 

 */

export class ValidationUtils {

 

    /**

 

     * @description validates object with provided schema

     * @param object {Object} - JSON object to be validated

     * @param schema {JSONSchema} - JSON Validation Schema

     * @returns array<error> if validation errors

     */

    public static validate(object: any, schema: any): Array<any> {

        let errors = [];

        let validator = new Ajv({ allErrors: true } as Options); // Exclude jsonPointers

        let loggerService = BaseDIConfig.getContainer().get<ILoggerService>(BaseIdentifiers.LoggerService);

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

        } catch (error) {

            loggerService.error('Error :: ValidationUtils::validate- ', error);

        }

        return errors;

    }

}