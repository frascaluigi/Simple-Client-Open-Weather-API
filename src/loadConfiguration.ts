import nconf from 'nconf';
import * as path from 'path';

// Setup nconf
nconf
  .argv()
  .env()
  .defaults({'NODE_ENV': 'development'});

export const config = nconf
  .file({ file: path.join(`${__dirname}/../config/`, `${process.env.NODE_ENV}.config.json`) });
