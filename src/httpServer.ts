import http from 'http';
import net from 'net';

// eslint-disable-next-line no-unused-vars
import AppConfig, { LISTENING_HOST } from './appConfig';
// eslint-disable-next-line no-unused-vars
import { handleError, HTTPHandler } from './utils';


export default class HTTPProxy {
  private config: AppConfig;

  private handler: HTTPHandler;

  private server: http.Server;

  constructor(config: AppConfig, handler: HTTPHandler) {
    this.config = config;
    this.handler = handler;
    this.server = http.createServer(handler);
  }

  init = () => {
    this.listenConnect();
    this.server.listen(this.config.http, () => {
      // eslint-disable-next-line no-console
      console.log(`HTTP Server is listening at address ${this.config.http}`);
    });

    return this;
  };

  private listenConnect = () => {
    this.server.on('connect', (req, cltSocket, head) => {
      const srvSocket = net.connect(
        this.config.https,
        LISTENING_HOST,
        () => {
          cltSocket.write('HTTP/1.1 200 Connection Established\r\n'
          + 'Proxy-agent: Node.js-Proxy\r\n'
          + '\r\n');
          srvSocket.write(head);
          srvSocket
            .on('error', handleError('srvSocket'))
            .pipe(cltSocket)
            .on('error', handleError('cltSocket'))
            .pipe(srvSocket);
        },
      );
    });
  };
}
