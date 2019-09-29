import HTTPProxy from './httpServer';
import AppConfig from './config';
import HTTPSProxy from './httpsServer';


const config = new AppConfig();
const httpProxy = new HTTPProxy(config);
const httpsProxy = new HTTPSProxy(config);

httpProxy.init();
httpsProxy.init();
