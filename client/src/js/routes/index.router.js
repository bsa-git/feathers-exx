"use strict";

// import AuthRouter from './auth.router.class'
import ServiceRouter from './service.router.class'

export default async function (client) {
    const serviceRouter = new ServiceRouter(client);
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
        default:
            return `Does not match controller/action:  '${client.req.controller}/${client.req.action}'`
    }
}
