import { writeFile } from 'fs';

const targetPath = './src/environments/environment.ts';

require('dotenv').config();

const envConfigFile = `export const environment = {
    production: ${process.env.ENVIRONMENT},
    isLocal: ${process.env.LOCAL_ENVIRONMENT},
    CAS_URL_API: '${process.env.CAS_URL_API}',
    version: '${process.env.VERSION}',
    LOCAL_API: '${process.env.LOCAL_API}',
    SCALE_CONNECTION : '${process.env.SCALE_CONNECTION}',
    USER_TYPE: '${process.env.USER_TYPE}',
    sentry_dns: '${process.env.SENTRY_DNS}'
    };
`;

writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('Environment file generated correctly');
  }
});
