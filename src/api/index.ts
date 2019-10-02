import Koa from 'koa';
import Router from 'koa-router';

// eslint-disable-next-line no-unused-vars
import AppConfig from 'appConfig';
// eslint-disable-next-line no-unused-vars
import { LogGetter } from 'db/types';
import { urls } from './config';


export default (config: AppConfig, getter: LogGetter) => {
  const app = new Koa();
  const router = new Router({
    prefix: config.apiPrefix,
  });

  router
    .get('/', (ctx) => {
      ctx.body = 'Hello World!';
    })
    .get(urls.GET, async (ctx) => {
      const { query } = ctx.request;
      const result = await getter(query);

      ctx.response.body = JSON.stringify(result);
    });

  app
    .use(router.routes())
    .listen(config.apiPort);
};
