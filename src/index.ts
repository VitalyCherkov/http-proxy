import 'module-alias/register';

import HTTPProxy from './httpServer';
import AppConfig from './appConfig';
import HTTPSProxy from './httpsProxy';


const config = new AppConfig();
const httpProxy = new HTTPProxy(config);
const httpsProxy = new HTTPSProxy(config);

httpProxy.init();
httpsProxy.init();
