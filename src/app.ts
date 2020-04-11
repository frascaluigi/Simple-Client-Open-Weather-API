import express from 'express'
import morgan from 'morgan';
import cors from 'cors'
import bodyParser from 'body-parser'
import index from './routes/index'
import {config} from './loadConfiguration';
import passport from 'passport';
const {URL} = require('url');

const expressSession =  require('express-session');
const FileStore = require('session-file-store')(expressSession);

const NODE_ENV = config.get('NODE_ENV')
const isDev = NODE_ENV === 'development';

const app = express()

if(isDev){
  // Use FileStore in development mode
  app.use(expressSession({
    resave: false,
    saveUninitialized: true,
    secret: 'unguessable',
    store: new FileStore()
  }))
}else{
  // Use RedisStore in production mode
  console.log("REDIS")
}

const CONFIG_SERVER = config.get('server');
const serviceUrl = new URL('/api', CONFIG_SERVER.service_url+':'+CONFIG_SERVER.port);
  
app.use(cors())
app.use(bodyParser.json({ limit: '12mb' }))
app.use(bodyParser.urlencoded({ extended: false }))
  
app.use(morgan('development'));

app.use(passport.initialize());
app.use(passport.session());


app.use('/api', index)

app.listen(CONFIG_SERVER.port, () => {
  console.log(`${CONFIG_SERVER.app_name} started: ${serviceUrl} (ENVIRONMENT: ${NODE_ENV})`)
})


