// eslint-disable-next-line no-unused-vars
import * as http from 'http';

// eslint-disable-next-line no-unused-vars
import { IStorageItem, IStorageSaver } from 'db/types';
import { serializeRequest } from '../utils';


interface ISaverArgs {
  isSecure: boolean;
  req: http.IncomingMessage;
  uri: string;
  body: string;
}

export type ILogSaver = (args: ISaverArgs) => Promise<void>;

export default (saveToDb: IStorageSaver): ILogSaver =>
  async ({
    isSecure,
    req,
    uri,
    body,
  }) => {
    const log: IStorageItem = {
      uri,
      date: new Date(),
      method: req.method || '',
      protocol: isSecure ? 'https' : 'http',
      rawData: serializeRequest(isSecure, req, body),
    };

    await saveToDb(log);
  };
