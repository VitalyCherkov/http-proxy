// eslint-disable-next-line no-unused-vars
import * as http from 'http';
import urlParse from 'url-parse';
import request from 'request';
import { defaultPorts, statusCodes } from './config';

export const handleError = (prefix: string) => (err: Error) => console.log(prefix, 'err', err);

export const createUrl = (secure: boolean, req: http.IncomingMessage) => {
  let parsedUrl = req.url!;

  if (!parsedUrl!.startsWith('http://') && !parsedUrl!.startsWith('https://')) {
    const proto = secure ? 'https' : 'http';
    parsedUrl = `${proto}://${req.headers.host}${req.url}`;
  }

  return parsedUrl;
};

export const getResponseHandler = (secure: boolean) => (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  const parsedUrl = createUrl(secure, req);
  console.log(parsedUrl);

  const { port } = urlParse(req.url!);

  const defaultPort = port || secure ? defaultPorts.HTTPS : defaultPorts.HTTP;

  const options = {
    url: parsedUrl,
    port: defaultPort,
  };

  req
    .pipe(request(options))
    .on('error', (err: Error) => {
      handleError('res')(err);
      res.writeHead(statusCodes.NOT_FOUND);
      res.end();
    })
    .pipe(res);
};
