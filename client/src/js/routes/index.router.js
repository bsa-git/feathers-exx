"use strict";

// import AuthRouter from './auth.router.class'
import ServiceRouter from './service.router.class'
import DatabaseRouter from './database.router.class'

export default async function (client) {
    const serviceRouter = new ServiceRouter(client);
    const databaseRouter = new DatabaseRouter(client);
    // const authRouter = new AuthRouter(client);
    switch (`${client.req.controller}/${client.req.action}`) {
        case 'service/start-client':
            return await serviceRouter.routeServiceStartClient('dishes');
            break;
        case 'service/rest-apis':
            return await serviceRouter.routeServiceRestApis();
            break;
        case 'service/rest-client':
            return await serviceRouter.routeServiceRestClient();
            break;
        case 'service/real-time':
            return await serviceRouter.routeServiceRealTime();
            break;
        case 'database/feathers-memory':
            return await databaseRouter.routeFeathersMemory();
            break;
        case 'database/feathers-nedb':
            return await databaseRouter.routeFeathersNeDB();
            break;
        case 'database/feathers-localstorage':
            return await databaseRouter.routeFeathersLocalStorage();
            break;
        case 'database/feathers-knex':
            return await databaseRouter.routeFeathersKnex();
            break;
        default:
            return `Does not match controller/action:  '${client.req.controller}/${client.req.action}'`
    }
}
