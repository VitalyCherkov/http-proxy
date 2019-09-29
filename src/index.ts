import fs from 'fs';
import tls from 'tls';
import net from 'net';
import path from 'path';
import http from 'http';
import https from 'https';
import request from 'request';
import urlParse from 'url-parse';


const PORT = 3030;

const HTTPS_PORT = 443;

const NOT_FOUND = 404;

const destPorts = {
  HTTP: 80,
  HTTPS: 443,
};

const getResponseHandler = (secure: boolean) => (req, resp) => {
  const parsedUrl = urlParse(req.url!);
  console.log('response handler; secure =', secure, parsedUrl);
  const proto = secure ? 'https' : 'http';
  const url = `${proto}://${req.headers.host}${req.url}`;

  const defaultPort = secure ? destPorts.HTTPS : destPorts.HTTP;

  const options = {
    url,
    port: +parsedUrl.port || defaultPort,
  };

  req
    .pipe(request(options))
    .on('error', () => {
      resp.writeHead(NOT_FOUND);
      resp.end();
    })
    .pipe(resp);
};

const httpServer = http.createServer(getResponseHandler(false));

httpServer.on('connect', (req, cltSocket, head) => {
  console.log('http proxy connect', req.url);
  const srvSocket = net.connect(443, 'localhost', () => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n'
      + 'Proxy-agent: Node.js-Proxy\r\n'
      + '\r\n');
    srvSocket.write(head);
    srvSocket.pipe(cltSocket)
      .on('error', (err) => {
        console.log('error', err);
      })
      .pipe(srvSocket);
  });
});

const listener = httpServer.listen(PORT, () => {
  const info = listener.address();
  console.log(`HTTP Server is listening at address ${info}`);
});

type SetContextCB = (_: null, ctx: tls.SecureContext) => any;

const localhostCrt = fs.readFileSync(path.resolve(__dirname, '..', 'localhost.crt'));
const localhostKey = fs.readFileSync(path.resolve(__dirname, '..', 'localhost.key'));

const SNICallback = (serverName: string, cb: SetContextCB) => {
  console.log('servername', serverName);
  const context = tls.createSecureContext({
    cert: localhostCrt,
    key: localhostKey,
  });
  cb(null, context);
};

const httpsServer = https.createServer(
  { SNICallback },
  getResponseHandler(true),
);

httpsServer.on('tlsClientError', (err) => {
  console.log('tlsClientError', err);
});

httpsServer.listen(HTTPS_PORT, () => {
  const info = listener.address();
  console.log(`HTTPS Server is listening at address ${info}`);
});
