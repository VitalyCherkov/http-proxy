import fs from 'fs';
import path from 'path';

// eslint-disable-next-line no-unused-vars
import AppConfig from 'appConfig';


interface SecureOptions {
  cert: Buffer;
  key: Buffer;
}

export default (config: AppConfig, serverName: string): SecureOptions => {
  const cert = fs.readFileSync(path.resolve(config.certsLocation, 'localhost.crt'));
  const key = fs.readFileSync(path.resolve(config.certsLocation, 'localhost.key'));

  return {
    cert,
    key,
  };
};
