import * as path from 'path';


export const defaultPorts = {
  HTTP: 80,
  HTTPS: 443,

  HTTP_LISTEN: 3030,
  HTTPS_LISTEN: 443,
};

export const LISTENING_HOST = 'localhost';

const DEFAULT_MONGO_PORT = 27017;
const DEFAULT_MONGO_HOST = 'localhost';
const DEFAULT_MONGO_DB_NAME = 'http_proxy';

const DEFAULT_API_PORT = 9090;
const DEFAULT_API_PREFIX = '/api';

export const statusCodes = {
  NOT_FOUND: 404,
  OK: 200,
};

export default class AppConfig {
  http: number = defaultPorts.HTTP_LISTEN;

  https: number = defaultPorts.HTTPS_LISTEN;


  certsLocation: string = path.resolve(__dirname, '../..', 'certs/sites');

  rootLocation: string = path.resolve(__dirname, '../..', 'certs');


  mongoPort: number = DEFAULT_MONGO_PORT;

  mongoHost: string = DEFAULT_MONGO_HOST;

  mongoDBName: string = DEFAULT_MONGO_DB_NAME;

  apiPort: number = DEFAULT_API_PORT;

  apiPrefix: string = DEFAULT_API_PREFIX;
}
