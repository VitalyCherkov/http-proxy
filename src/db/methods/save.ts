// eslint-disable-next-line no-unused-vars
import { LogSaver } from 'db/types';
// eslint-disable-next-line no-unused-vars
import * as mongoose from 'mongoose';
import { handleError } from 'utils';


export default (Model: mongoose.Model<any, any>): LogSaver => (log) => new Promise((resolve) => {
  const item = new Model(log);
  item.save((err: Error) => {
    if (err) {
      handleError('Mongo save')(err);
    }
    resolve(!!err);
  });
});
