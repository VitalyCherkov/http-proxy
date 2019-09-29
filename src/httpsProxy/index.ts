import tls from 'tls';
import https from 'https';

// eslint-disable-next-line no-unused-vars
import AppConfig from 'appConfig';
import { getResponseHandler, handleError } from '../utils';
import generateSecureOptions from './utils/generateSecureOptions';


type SetContextCB = (_: null, ctx: tls.SecureContext) => any;


export default class HTTPSProxy {
  private readonly config: AppConfig;

  private server: https.Server;

  constructor(config: AppConfig) {
    this.config = config;
    this.server = https.createServer(
      {
        SNICallback: this.SNICallback,
      },
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
  };

  private SNICallback = (serverName: string, cb: SetContextCB) => {
    // eslint-disable-next-line no-console
    console.log('servername', serverName);

    const secureOptions = generateSecureOptions(this.config, serverName);
    const context = tls.createSecureContext(secureOptions);

    cb(null, context);
  };
}
