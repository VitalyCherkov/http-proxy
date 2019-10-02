// eslint-disable-next-line no-unused-vars
import * as mongoose from 'mongoose';
// eslint-disable-next-line no-unused-vars
import { FinderById } from 'db/types';


export default (model: mongoose.Model<any, any>): FinderById => async (id) => {
  // eslint-disable-next-line no-return-await
  return await model.findOne({
    _id: id,
  });
};
