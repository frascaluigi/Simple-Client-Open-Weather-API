import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import * as pkg from '../../package.json';
import { config } from '../loadConfiguration';
const router = express.Router();

const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
	openapi: '3.0.1',
	info: {
		title: 'Simple Client Open Weather API',
		version: pkg.version,
		description: 'simple client open weather api',
	},
	servers: [
		{
			url:
				config.get('server').service_url +
				':' +
				config.get('server').port +
				'/api',
		},
	],
	components: {
		securitySchemes: {
			apiKeyAuth: {
				type: 'apiKey',
				in: 'header',
				name: 'X-API-KEY',
			},
		},
	},
	secutiry: [
		{
			apiKeyAuth: [],
		},
	],
};

const options: swaggerJSDoc.Options = {
	swaggerDefinition: swaggerDefinition,
	apis: ['src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
