import tls from 'tls';
import fs from 'fs';
import path from 'path';
import https from 'https';

// eslint-disable-next-line no-unused-vars
import AppConfig from './config';
import { getResponseHandler, handleError } from './utils';


type SetContextCB = (_: null, ctx: tls.SecureContext) => any;

const localhostCrt = fs.readFileSync(path.resolve(__dirname, '..', 'localhost.crt'));
const localhostKey = fs.readFileSync(path.resolve(__dirname, '..', 'localhost.key'));


const SNICallback = (serverName: string, cb: SetContextCB) => {
  // eslint-disable-next-line no-console
  console.log('servername', serverName);

  const context = tls.createSecureContext({
    cert: localhostCrt,
    key: localhostKey,
  });
  cb(null, context);
};

export default class HTTPSProxy {
  private config: AppConfig;

  private server: https.Server;

  constructor(config: AppConfig) {
    this.config = config;
    this.server = https.createServer(
      { SNICallback },
      getResponseHandler(true),
    );
  }

  init = () => {
    this.server.on(
      'tlsClientError',
      handleError('tlsClientError'),
    );

    this.server.listen(this.config.https, () => {
      // eslint-disable-next-line no-console
      console.log(`HTTPS Server is listening at address ${this.config.https}`);
    });

    return this;
  }
}
