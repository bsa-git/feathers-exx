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
            return await serviceRouter.serviceStartClient('dishes');
            break;
        case 'service/rest-apis':
            return await serviceRouter.serviceRestApis();
            break;
        case 'service/rest-client':
            return await serviceRouter.serviceRestClient();
            break;
        case 'service/real-time':
            return await serviceRouter.serviceRealTime();
            break;
        case 'database/feathers-memory':
            return await databaseRouter.databaseFeathersMemory();
            break;
        default:
            return `Does not match controller/action:  '${client.req.controller}/${client.req.action}'`
    }
}
