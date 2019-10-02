import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

// eslint-disable-next-line no-unused-vars
import AppConfig from 'appConfig';
// eslint-disable-next-line no-unused-vars
import { LogModelMethods } from 'db/types';
import { urls } from './config';


export default (config: AppConfig, methods: LogModelMethods) => {
  const app = new Koa();
  const router = new Router({
    prefix: config.apiPrefix,
  });

  router
    .get(urls.GET, async (ctx) => {
      const { query } = ctx.request;
      const result = await methods.get(query);

      ctx.response.body = JSON.stringify(result);
    })
    .post(urls.REPEAT, async (ctx) => {
      const { id } = ctx.request.body;
      const result = await methods.findById(id);
      console.log(id, result);
    });

  app
    .use(bodyParser())
    .use(router.routes())
    .listen(config.apiPort);
};
