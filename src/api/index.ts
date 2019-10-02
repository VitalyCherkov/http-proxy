import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import requestPromise from 'request-promise';

// eslint-disable-next-line no-unused-vars
import AppConfig, { statusCodes } from 'appConfig';
// eslint-disable-next-line no-unused-vars
import { LogModelMethods } from 'db/types';
import { urls } from './config';
import { deserializeRequest } from '../utils';


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
    });

  router.post(urls.REPEAT, async (ctx) => {
    try {
      const { id } = ctx.request.body;
      const savedData = await methods.findById(id);

      if (savedData && savedData.rawData) {
        const savedRequest = deserializeRequest(savedData.rawData);

        if (savedRequest) {
          const result = await requestPromise({
            ...savedRequest,
            resolveWithFullResponse: true,
          });

          ctx.response.body = result.toJSON();
        }
      }
    } catch (e) {
      ctx.response.body = e.response.toJSON();
    }

    ctx.status = statusCodes.OK;
  });

  app
    .use(bodyParser())
    .use(router.routes())
    .listen(config.apiPort);
};
