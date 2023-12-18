/**
 * 

 * @description DB Client interface.
 */
export interface IDatabaseClient {

    /**

     * @description This method will connet to DB if DBClient is not connected or initialized and Db object of the provided namespace
     * @param namespace DB namespace name. This parameter is an optional if not provided then
     * DBConstants.DB_NAMESPACE_MTG will be used. e.g medtransgo
     * @throws ServiceException if unable to connect to DB
     * @async
     */
    getConnection(namespace?: string): Promise<any>;

}
