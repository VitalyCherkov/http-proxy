import mongoose from 'mongoose';

import AppConfig from 'appConfig';
import { LogGetter, LogSaver } from 'db/types';


const DEFAULT_LIMIT = 20;

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

export default async (config: AppConfig) => {
  const connectionLink = getConnectionLink(config);

  try {
    await mongoose.connect(connectionLink, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Mongo conn err', e);
    return null;
  }

  const requestSchema = createSchema();

  const Model = mongoose.model('Request', requestSchema);

  const save: LogSaver = (log) => new Promise((res) => {
    const item = new Model(log);
    item.save((err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('Mongo save err', err);
      }
      res(!!err);
    });
  });

  const get: LogGetter = async (req) => {
    let limit: number = req.limit || 0;
    limit = limit ? DEFAULT_LIMIT : Math.min(limit, DEFAULT_LIMIT);

    const findParams: any = {
      protocol: req.protocol,
      status: req.status,
      method: req.method,
    };

    if (req.host) {
      findParams.host = {
        $regexp: new RegExp(req.host, 'i'),
      };
    }

    if (req.since) {
      findParams.date = {
        $lt: req.since,
      };
    }

    // eslint-disable-next-line no-return-await
    return Model
      .find(findParams)
      .sort({ date: -1 })
      .limit(limit);
  };

  return {
    save,
    get,
  };
};
