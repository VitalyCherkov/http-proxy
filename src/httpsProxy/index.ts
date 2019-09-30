import tls from 'tls';
import https from 'https';

// eslint-disable-next-line no-unused-vars
import AppConfig from 'appConfig';
// eslint-disable-next-line no-unused-vars
import { handleError, HTTPHandler } from '../utils';
import generateSecureOptions from './utils/generateSecureOptions';


type SetContextCB = (_: null, ctx: tls.SecureContext) => any;


export default class HTTPSProxy {
  private readonly config: AppConfig;

  private server: https.Server;

  private readonly handler: HTTPHandler;

  constructor(config: AppConfig, handler: HTTPHandler) {
    this.config = config;
    this.handler = handler;
    this.server = https.createServer(
      {
        SNICallback: this.SNICallback,
      },
      this.handler,
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
  };

  private SNICallback = (serverName: string, cb: SetContextCB) => {
    // eslint-disable-next-line no-console
    console.log('servername', serverName);

    const secureOptions = generateSecureOptions(this.config, serverName);
    const context = tls.createSecureContext(secureOptions);

    cb(null, context);
  };
}
