import routes from './routes';
const { URL } = require('url');
import { config } from './loadConfiguration';
import setupApp from './setupApp';

const NODE_ENV = config.get('NODE_ENV');
const CONFIG_SERVER = config.get('server');
const serviceUrl = new URL(
	'/api',
	CONFIG_SERVER.service_url + ':' + CONFIG_SERVER.port
);

const app = setupApp();

app.use('/api', routes);

NODE_ENV !== 'test' &&
	app.listen(CONFIG_SERVER.port, () => {
		console.info(
			`${config.get(
				'app_name'
			)} started: ${serviceUrl} (ENVIRONMENT: ${NODE_ENV})`
		);
	});
