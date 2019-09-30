// eslint-disable-next-line no-unused-vars
import * as http from 'http';

// eslint-disable-next-line no-unused-vars
import { ILogItem, LogSaver } from 'db/types';


export default (saveToDb: LogSaver) => async (isSecure: boolean, req: http.IncomingMessage) => {
  const log: ILogItem = {
    date: new Date(),
    host: req.headers.host || '',
    method: req.method || '',
    protocol: isSecure ? 'https' : 'http',
    rawData: req.rawHeaders.join('\n'),
  };

  await saveToDb(log);
};
