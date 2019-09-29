import mongoose from 'mongoose';

import AppConfig from 'appConfig';


class DB {
  connection: mongoose.Connection | null = null;

  init = (config: AppConfig) => {
    const {
      mongoDBName,
      mongoHost,
      mongoPort,
    } = config;

    const connectionLink = `mongodb://${mongoHost}:${mongoPort}/${mongoDBName}`;

    this.connection = mongoose.connect(connectionLink, {
      useNewUrlParser: true,
    });
  };
}

export default new DB();
