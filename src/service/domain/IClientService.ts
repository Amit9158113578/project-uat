import {  Client } from '../../types/entity';
import { Response } from '../../types/reponse';
import { ListQueryRequest } from '../../types/request';

/**
 * @author <Rohit.L>
 * @description Client Service interface
 */
export interface IClientService {

   /**
    * @author <Rohit.L>
    * @description gets all clients lists
    * @param listQueryRequest {ListQueryRequest} - ListQueryRequest
    * @returns Response all client's details
    * @throws ServiceException if failed to retrieve clients
    */
   getClientList(listQueryRequest: ListQueryRequest): Promise<Response<Client[]>>;

   /**
   * @author <Rohit.L>
   * @description API add new client
   * @param client  {Client} - Client object
   * @returns Response <Client>
   * @throws ServiceException if failed to Client
   */
   createClient(createClientRequest: Client): Promise<Response<Client>>;

   /**
   * @author <Rohit.L>
   * @description gets client  details by id
   * @param clientId {string} - primary key id
   * @returns Response clients details by its id
   * @throws ServiceException if failed to retrieve client details
   */
   getClientById(clientId: string): Promise<Response<Client>>;

   /**
   * @author <Rohit.L>
   * @description updates clients details
   * @param client  {Client} - to update client information
   * @returns updated client information
   * @throws ServiceException if failed to update client details
   */
   updateClient(updateClientRequest: Client, clientId: string): Promise<Response<Number>>;


   /**
   * @author <Rohit.L.>
   * @description delete client details
   * @param id {string} - primary key id
   * @returns delete client information by id
   * @throws ServiceException if failed to delete ruralDestinatio  details
   */
   deleteClient(id: string): Promise<Response<Number>>;

   /**
    * @author <Rohit L.>
    * @description Get client by client
    * @param key {string} - client
    * @returns Response <Client>
    * @throws ServiceException if failed to get Client
    */
   getClientByEmail(name: string): Promise<Response<Client>>;

}
