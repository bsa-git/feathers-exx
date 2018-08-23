"use strict";

import AuthRouter from './auth.router.class'
import ServiceRouter from './service.router.class'
import DatabaseRouter from './database.router.class'

export default async function (client) {
    const serviceRouter = new ServiceRouter(client);
    const databaseRouter = new DatabaseRouter(client);
    const authRouter = new AuthRouter(client);
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
        case 'database/feathers-sequelize':
            return await databaseRouter.routeFeathersSequelize();
            break;
        case 'database/feathers-mongoose':
            return await databaseRouter.routeFeathersMongoose();
            break;
        case 'database/feathers-mongodb':
            return await databaseRouter.routeFeathersMongoDB();
            break;
        case 'database/feathers-elasticsearch':
            return await databaseRouter.routeFeathersElasticSearch();
            break;
        case 'database/feathers-rethinkdb':
            return await databaseRouter.routeRethinkDB();
            break;
        case 'auth/chat':
            return await authRouter.routeAuthChat();
            break;
        case 'auth/server':
            return await authRouter.routeAuthServer();
            break;
        case 'auth/client':
            return await authRouter.routeAuthClient();
            break;
        case 'auth/local':
            return await authRouter.routeAuthLocal();
            break;
        case 'auth/jwt':
            return await authRouter.routeAuthJwt();
            break;
        case 'auth/oauth1':
            return await authRouter.routeOAuth1();
            break;
        case 'auth/oauth1-ok':
            return await authRouter.routeOAuth1Ok();
            break;
        case 'auth/oauth2':
            return await authRouter.routeOAuth2();
            break;
        case 'auth/oauth2-ok':
            return await authRouter.routeOAuth2Ok();
            break;
        default:
            return `Path controller/action:  '${client.req.controller}/${client.req.action}'`
    }
}
