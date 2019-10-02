import fs from 'fs';
import path from 'path';
import shelljs from 'shelljs';

// eslint-disable-next-line no-unused-vars
import AppConfig from 'appConfig';


interface SecureOptions {
  cert: Buffer;
  key: Buffer;
}

const getCommand = ({
  country,
  city,
  organization,
  domain,
  location,
  rootLocation,
}: any) => `
  cd ${location};
  openssl genrsa -out ${domain}.key 2048;
  openssl req -new -sha256 -key ${domain}.key -subj "/C=${country}/ST=${city}/O=${organization}, Inc./CN=${domain}" -out ${domain}.csr;
  openssl req -in ${domain}.csr -noout -text;
  openssl x509 -req -in ${domain}.csr -CA ${rootLocation}/rootCA.crt -CAkey ${rootLocation}/rootCA.key -CAcreateserial -out ${domain}.crt -days 500 -sha256;
  openssl x509 -in ${domain}.crt -text -noout;
`;

const generate = (config: AppConfig, serverName: string) => {
  // TODO: placeholders to command
  const command = getCommand({
    country: 'RU',
    city: 'Moscow',
    organization: 'Technopark',
    location: config.certsLocation,
    rootLocation: config.rootLocation,
    domain: serverName,
  });

  // TODO: error handling
  shelljs.exec(command);
};

export default (config: AppConfig, serverName: string): SecureOptions => {
  const certPath = path.resolve(config.certsLocation, `${serverName}.crt`);
  const keyPath = path.resolve(config.certsLocation, `${serverName}.key`);

  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    generate(config, serverName);
  }

  return {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
  };
};
