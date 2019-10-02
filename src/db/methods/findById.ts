// eslint-disable-next-line no-unused-vars
import * as mongoose from 'mongoose';
// eslint-disable-next-line no-unused-vars
import { IStorageFinderById } from 'db/types';


export default (model: mongoose.Model<any, any>): IStorageFinderById =>
  async (id) =>
    await model.findOne({
      _id: id,
    });
