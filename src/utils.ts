// eslint-disable-next-line no-unused-vars
import * as http from 'http';
import { StringDecoder } from 'string_decoder';
import urlParse from 'url-parse';
import request from 'request';
import { defaultPorts, statusCodes } from './appConfig';
// eslint-disable-next-line no-unused-vars
import { ILogSaver } from './saver';

export const handleError = (prefix: string) => (err: Error) => console.log(prefix, 'err', err);

export const createUrl = (isSecure: boolean, req: http.IncomingMessage) => {
  let parsedUrl = req.url!;

  if (!parsedUrl!.startsWith('http://') && !parsedUrl!.startsWith('https://')) {
    const proto = isSecure ? 'https' : 'http';
    parsedUrl = `${proto}://${req.headers.host}${req.url}`;
  }

  return parsedUrl;
};

export type HTTPHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => void;

const readBody = async (req: http.IncomingMessage) => new Promise<string>((resolve) => {
  const body: Array<string> = [];
  const decorer = new StringDecoder('utf8');
  req.on('data', (chunk) => {
    body.push(decorer.write(chunk));
  });
  req.on('end', () => {
    resolve(body.join(''));
  });
});

export const getResponseHandler = (
  isSecure: boolean,
  saver: ILogSaver,
): HTTPHandler => async (req, res) => {
  const uri = createUrl(isSecure, req);

  const body = await readBody(req);
  await saver({
    isSecure,
    req,
    uri,
    body,
  });

  const { port } = urlParse(req.url!);

  const defaultPort = port || isSecure ? defaultPorts.HTTPS : defaultPorts.HTTP;

  const options = {
    uri,
    method: req.method,
    port: defaultPort,
    body,
  };

  request(options)
    .on('error', (err: Error) => {
      handleError('res')(err);
      res.writeHead(statusCodes.NOT_FOUND);
      res.end();
    })
    .pipe(res);
};

export interface IRequestJSON {
  url: string;
  method: string;
  headers: request.Headers;
  httpVersion: string;
  body?: string;
}

export const serializeRequest = (
  isSecure: boolean,
  req: http.IncomingMessage,
  body: string,
): string => {
  const requestJSON: IRequestJSON = {
    url: createUrl(isSecure, req),
    method: req.method || 'GET',
    headers: req.headers,
    httpVersion: req.httpVersion,
    body,
  };

  return JSON.stringify(requestJSON);
};

export const deserializeRequest = (rawData: string): IRequestJSON | null => {
  try {
    const {
      url = '',
      method = '',
      headers = {},
      httpVersion = '',
      body = '',
    } = JSON.parse(rawData);
    return {
      url,
      method,
      headers,
      httpVersion,
      body,
    };
  } catch (e) {
    handleError('Json parse')(e);
    return null;
  }
};

export const serializeResponse = (resp: http.OutgoingMessage): string => {
  return JSON.stringify({

  });
};
