// eslint-disable-next-line no-unused-vars
import { IStorageGetter } from 'db/types';
// eslint-disable-next-line no-unused-vars
import * as mongoose from 'mongoose';


const DEFAULT_LIMIT = 20;

export default (model: mongoose.Model<any, any>): IStorageGetter => async (req) => {
  let limit: number = req.limit || 0;
  limit = !limit ? DEFAULT_LIMIT : Math.min(limit, DEFAULT_LIMIT);

  const findParams: any = {};

  if (req.protocol) {
    findParams.protocol = req.protocol;
  }

  if (req.method) {
    findParams.method = req.method;
  }

  if (req.uri) {
    findParams.host = new RegExp(req.uri, 'i');
  }

  let query = model.find(findParams);

  if (req.since) {
    query = query.where('date').lt(new Date(req.since));
  }

  // eslint-disable-next-line no-return-await
  return await query.sort('-date').limit(limit).exec() as any;
};
