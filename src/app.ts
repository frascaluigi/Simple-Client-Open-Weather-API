import express from 'express'
import morgan from 'morgan';
import cors from 'cors'
import bodyParser from 'body-parser'
import index from './routes/index'
import nconf from 'nconf';
import * as path from 'path';
import passport from 'passport';
const expressSession =  require('express-session');
const FileStore = require('session-file-store')(expressSession);
// Setup nconf
nconf
  .argv()
  .env()
  .defaults({'NODE_ENV': 'development'});

const NODE_ENV = nconf.get('NODE_ENV');
nconf
  .file({ file: path.join(`${__dirname}/../config/`, `${NODE_ENV}.config.json`) });
 
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

//Passport Authentication
passport.serializeUser((profile:any, done) => done(null, {
  id: profile.id,
  provider: profile.provider
}))
passport.deserializeUser((user, done) => done(null, user));


const CONFIG_SERVER = nconf.get('server');
  
app.use(cors())
app.use(bodyParser.json({ limit: '12mb' }))
app.use(bodyParser.urlencoded({ extended: false }))
  
app.use(morgan('development'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', index)
  
  
export const config = nconf;

app.listen(CONFIG_SERVER.port, () => {
  console.log(`${CONFIG_SERVER.app_name} started on port: ${CONFIG_SERVER.port} (ENVIRONMENT: ${NODE_ENV})`)
})


