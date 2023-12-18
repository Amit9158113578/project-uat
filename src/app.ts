
/**

 * @description Aplication

 */
import { Server } from './server';
(async () => {
    let server = new Server();
    await server.start();
})();
