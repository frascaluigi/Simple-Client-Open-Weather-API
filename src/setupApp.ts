import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import { config } from './loadConfiguration';
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);

const setupExpressApp = () => {
	const NODE_ENV = config.get('NODE_ENV');
	const isDev = NODE_ENV === 'development';

	const app = express();

	if (isDev) {
		// Use FileStore in development mode
		app.use(
			expressSession({
				resave: false,
				saveUninitialized: true,
				secret: 'unguessable',
				store: new FileStore(),
			})
		);
	} else {
		// Use RedisStore in production mode
	}

	app.use(cors());
	app.use(bodyParser.json({ limit: '12mb' }));
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use(morgan('development'));

	app.use(passport.initialize());
	app.use(passport.session());

	return app;
};

export default setupExpressApp;
