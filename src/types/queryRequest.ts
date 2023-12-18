/**


 * @description Query object to build SQl/NoSql queries
 * @example
 * ===============================================================================
 * Find a user having username 'admin'
 * SQL: select * from users where username = 'admin'
 * let query = {table: 'users', conditions:[{op:'eq',field: 'username',value: 'admin'}]}
 *
 * "select * from users where username = 'admin' and (status = 'Active' or status = 'New')"
 * let query = {table: 'users', conditions:[{op:'eq',field: 'username',value: 'admin'},
 *             {op:'or',conditions: [{op:'eq',field:'status', value:'Active'},
 *             {op:'eq',field:'status', value:'New'}] ]}
 *
 * "select * from users where (username = '123456' or mobileno='123456')and (status = 'Active' or status = 'New')"
 *  let query = {table: 'users', conditions:[{op:'and',conditions:[{op:'eq',field: 'username',value: '123456'},
 *             {op:'eq',field: 'mobileno',value: '123456'}]},
 *             {op:'or',conditions: [{op:'eq',field:'status', value:'Active'},
 *             {op:'eq',field:'status', value:'New'}]]}
 * =================================================================================
 */
export interface Query {
    tableName: string;
    id?: string;
    op?: 'and' | 'or';
    conditions?: Array<Condition>;
    subQueries?: Array<Query>;
    outputProperties?: Array<string>;
    limit?: number;
    start?: number;
    order?: { [key: string]: 1 | -1; };
}

export interface Condition {
    op: 'and' | 'or' | 'between' | 'gt' | 'lt' | 'eq' | 'in' | 'gte' | 'lte';
    fieldName?: string;
    value?: any;
    conditions?: Array<Condition>;
}

export interface PersistEntityRequest<T> {
    tableName: string;
    entity: T;
}

export interface UpdateEntityRequest {
    id: string;
    tableName: string;
    values: { [key: string]: any };
}

export interface DeleteEntityRequest {
    id: string;
    tableName: string;
}

export interface FindEntityByIdRequest {
    id: string;
    tableName: string;
}

export interface FindAndModifyRequest {
    query: Query;
    update: any;
}

export interface AggregationRequest {
    $count?: string;
    query: Query;
    $group?: {
        fields: Array<string>;
        output: {
            [key: string]: Sum;
        }
    };
}

interface Sum {
    $sum: string | Sum;
}



