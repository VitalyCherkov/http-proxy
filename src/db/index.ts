import mongoose from 'mongoose';

// eslint-disable-next-line no-unused-vars
import AppConfig from 'appConfig';
// eslint-disable-next-line no-unused-vars
import { LogGetter, LogSaver } from 'db/types';
import { handleError } from 'utils';


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
    handleError('Mongo conn')(e);
    return null;
  }

  const requestSchema = createSchema();

  const Request = mongoose.model('Request', requestSchema);

  const save: LogSaver = (log) => new Promise((res) => {
    const item = new Request(log);
    item.save((err) => {
      if (err) {
        handleError('Mongo save')(err);
      }
      res(!!err);
    });
  });

  const get: LogGetter = async (req) => {
    let limit: number = req.limit || 0;
    limit = !limit ? DEFAULT_LIMIT : Math.min(limit, DEFAULT_LIMIT);

    const findParams: any = {};

    if (req.protocol) {
      findParams.protocol = req.protocol;
    }

    if (req.method) {
      findParams.method = req.method;
    }

    if (req.host) {
      findParams.host = new RegExp(req.host, 'i');
    }

    let query = Request.find(findParams);

    if (req.since) {a
      query = query.where('date').lt(new Date(req.since));
    }

    // eslint-disable-next-line no-return-await
    return await query.sort('-date').limit(limit).exec() as any;
  };

  return {
    save,
    get,
  };
};
