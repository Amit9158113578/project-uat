"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryTranslator = void 0;
const mongodb_1 = require("mongodb");
const commonUtils_1 = require("../../../util/commonUtils");
const dbConstants_1 = require("../../../constants/dbConstants");
const util_1 = require("util");
const serviceException_1 = require("../../../exception/serviceException");
const errorCodes_1 = require("../../../constants/errorCodes");
/**
 *

 * @description Class for query utilities.
 */
class QueryTranslator {
    /**

     * @description converts query to Mongo Db filter query object
     * @param query {Query} - query object to be converted into filter query object
     * @throws ServiceException when query operation is incorrect condition.
     * conditions are empty in case 'and' & 'or' operations
     * @example
     * let query1 = {conditions: [{op:'eq',field:'username',value:'test'}]};
     * let filterQuery1 = {$and: [username: {$eq: 'test'}]}
     * // id column will be replaced with _id
     * let query2 = {conditions: [{op:'eq',field:'id',value:'2xdh-weue-dggd-pors'}]};
     * let filterQuery2 = {$and: [_id: {$eq: '2xdh-weue-dggd-pors'}]}
     */
    static convertQueryToNoSqlQuery(query) {
        const mongoQuery = {};
        const resolvedFilterQuery = this.resolveConditions(query.conditions, query.op);
        if (resolvedFilterQuery) {
            if (resolvedFilterQuery.$and && resolvedFilterQuery.$or) {
                resolvedFilterQuery.$and.push({
                    $or: resolvedFilterQuery.$or,
                });
                delete resolvedFilterQuery.$or;
            }
            return resolvedFilterQuery;
        }
        return mongoQuery;
    }
    /**

     * @private
     * @description resolves condition into filter query
     * @param conditions {Condition[]} - conditions to be converted into filter {@link FilterQuery<T>} query object
     * @throws ServiceException when query operation is incorrect condition.
     * conditions are empty in case 'and' & 'or' operations
     */
    static resolveConditions(conditions, op) {
        if (!commonUtils_1.CommonUtils.isEmpty(conditions)) {
            const mongoQuery = {};
            op = op ? op : 'and';
            mongoQuery[this.operationIdentifier[op]] = [];
            conditions.forEach(condition => {
                if (condition.op === 'or' || condition.op === 'and') {
                    if (!commonUtils_1.CommonUtils.isEmpty(condition.conditions)) {
                        let resolvedFilterQuery = this.resolveConditions(condition.conditions, condition.op);
                        let resolvedConditions = resolvedFilterQuery.$and ? resolvedFilterQuery.$and : resolvedFilterQuery.$or;
                        resolvedConditions.forEach(resolvedCondition => {
                            mongoQuery[this.operationIdentifier[op]].push(resolvedCondition);
                        });
                    }
                    else {
                        throw new serviceException_1.ServiceException(['\'conditions\' must not be empty if \'op\' is \'and\'or \'or\''], errorCodes_1.ErrorCodes.ERR_DB_INVALID_QUERY_EXCEPTION, 400);
                    }
                }
                else {
                    this.checkFieldName(condition);
                    const resolvedCondition = {};
                    resolvedCondition[condition.fieldName] = {};
                    resolvedCondition[condition.fieldName][this.operationIdentifier[condition.op]] = condition.value;
                    mongoQuery[this.operationIdentifier[op]].push(resolvedCondition);
                }
            });
            return mongoQuery;
        }
        return null;
    }
    /**

     * @private
     * @param condition {Condition} - condition object
     * @description checks condition.fieldName and if fieldName is 'id' then replace it with '_id'
     */
    static checkFieldName(condition) {
        if (condition.fieldName === dbConstants_1.FieldNames.FIELD_ID) {
            delete condition.fieldName;
            condition.fieldName = '_id';
            if ((0, util_1.isArray)(condition.value)) {
                condition.value.forEach(element => {
                    element = new mongodb_1.ObjectID(element);
                });
            }
            else {
                condition.value = new mongodb_1.ObjectID(condition.value);
            }
        }
    }
}
exports.QueryTranslator = QueryTranslator;
/**
 * Mongo DB condition operators
 */
QueryTranslator.operationIdentifier = {
    'and': '$and',
    'eq': '$eq',
    'gt': '$gt',
    'gte': '$gte',
    'in': '$in',
    'lt': '$lt',
    'lte': '$lte',
    'ne': '$ne',
    'or': '$or',
};
