import mongoose from 'mongoose';

// eslint-disable-next-line no-unused-vars
import AppConfig from 'appConfig';
// eslint-disable-next-line no-unused-vars
import { handleError } from 'utils';

import getMethod from './methods/get';
import saveMethod from './methods/save';
import findByIdMethod from './methods/findById';
// eslint-disable-next-line no-unused-vars
import { LogModelMethods } from './types';


const getConnectionLink = (config: AppConfig) => {
  const {
    mongoDBName,
    mongoHost,
    mongoPort,
  } = config;

  return `mongodb://${mongoHost}:${mongoPort}/${mongoDBName}`;
};

const createSchema = () => new mongoose.Schema({
  host: String,
  protocol: String,
  date: Date,
  rawData: String,
  method: String,
});

export default async (config: AppConfig): Promise<null | LogModelMethods> => {
  const connectionLink = getConnectionLink(config);

  try {
    await mongoose.connect(connectionLink, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    handleError('Mongo conn')(e);
    return null;
  }

  const requestSchema = createSchema();

  const Request = mongoose.model('Request', requestSchema);

  return {
    findById: findByIdMethod(Request),
    save: saveMethod(Request),
    get: getMethod(Request),
  };
};
