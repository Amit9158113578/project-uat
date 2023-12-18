import { FilterQuery, ObjectID } from 'mongodb';
import { Query, Condition } from '../../../types/queryRequest';
import { CommonUtils } from '../../../util/commonUtils';
import { FieldNames } from '../../../constants/dbConstants';
import { isArray } from 'util';
import { ServiceException } from '../../../exception/serviceException';
import { ErrorCodes } from '../../../constants/errorCodes';

/**
 * 

 * @description Class for query utilities.
 */
export class QueryTranslator {


    /**
     * Mongo DB condition operators
     */
    private static operationIdentifier = {
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
    public static convertQueryToNoSqlQuery<T>(query: Query): FilterQuery<T> {
        const mongoQuery: FilterQuery<any> = {};
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
    private static resolveConditions(conditions: Condition[], op?: 'and' | 'or'): FilterQuery<any> {
        if (!CommonUtils.isEmpty(conditions)) {
            const mongoQuery: FilterQuery<any> = {};
            op = op ? op : 'and';
            mongoQuery[this.operationIdentifier[op]] = [];
            conditions.forEach(condition => {
                if (condition.op === 'or' || condition.op === 'and') {
                    if (!CommonUtils.isEmpty(condition.conditions)) {
                        let resolvedFilterQuery = this.resolveConditions(condition.conditions, condition.op);
                        let resolvedConditions = resolvedFilterQuery.$and ? resolvedFilterQuery.$and : resolvedFilterQuery.$or;
                        resolvedConditions.forEach(resolvedCondition => {
                            mongoQuery[this.operationIdentifier[op]].push(resolvedCondition);
                        });
                    } else {
                        throw new ServiceException(['\'conditions\' must not be empty if \'op\' is \'and\'or \'or\''],
                            ErrorCodes.ERR_DB_INVALID_QUERY_EXCEPTION, 400);
                    }
                } else {
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
    private static checkFieldName(condition: Condition) {
        if (condition.fieldName === FieldNames.FIELD_ID) {
            delete condition.fieldName;
            condition.fieldName = '_id';
            if (isArray(condition.value)) {
                condition.value.forEach(element => {
                    element = new ObjectID(element);
                });
            } else {
                condition.value = new ObjectID(condition.value);
            }
        }
    }

}
