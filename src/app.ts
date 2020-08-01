import { config } from './loadConfiguration';
import setupApp from './setupApp';
const { URL } = require('url');

const NODE_ENV = config.get('NODE_ENV');
const CONFIG_SERVER = config.get('server');
const serviceUrl = new URL(
	'/api',
	CONFIG_SERVER.service_url + ':' + CONFIG_SERVER.port
);

const app = setupApp();

//error middleware
app.use(function(err, req, res, next) {
	console.error("error middleware: ", err.message);
	const status = err.status ? err.status : 500; 
	res.status(status).send(err?.message);
});

NODE_ENV !== 'test' &&
	app.listen(CONFIG_SERVER.port, () => {
		console.info(
			`${config.get(
				'app_name'
			)} started: ${serviceUrl} (ENVIRONMENT: ${NODE_ENV})`
		);
	});
