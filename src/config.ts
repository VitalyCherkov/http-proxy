export const defaultPorts = {
  HTTP: 80,
  HTTPS: 443,

  HTTP_LISTEN: 3030,
  HTTPS_LISTEN: 443,
};

export const LISTENING_HOST = 'localhost';

export const statusCodes = {
  NOT_FOUND: 404,
};

export default class AppConfig {
  http: number = defaultPorts.HTTP_LISTEN;

  https: number = defaultPorts.HTTPS_LISTEN;
}
