import express from 'express'
import morgan from 'morgan';
import cors from 'cors'
import bodyParser from 'body-parser'
import weather_api from './routes/index'
import nconf from 'nconf';
import * as path from 'path';

nconf
  .argv()
  .env()
  .defaults({'NODE_ENV': 'development'});

const NODE_ENV = nconf.get('NODE_ENV');
nconf
  .file({ file: path.join(`${__dirname}/../config/`, `${NODE_ENV}.config.json`) });

export const config = nconf;

const isDev = NODE_ENV === 'development';

const SERVER = nconf.get('server');
const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '12mb' }))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(morgan('development'))
app.use('/exposed-api', weather_api)


app.listen(SERVER.port, () => {
  console.log(`${SERVER.app_name} started on port: ${SERVER.port} (ENVIRONMENT: ${NODE_ENV})`)
})


