// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --staging2` `ng serve --configuration=staging2` replaces `environment.ts` with `environment.stag.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
    production: false,
    CAS_URL_API: 'https://cas.grainchain.io/',
    LOCAL_API: 'http://172.16.20.22:8080/api',
    sentry_dns: 'https://10a2b8910e1a40a39385696babe0d454@o226201.ingest.sentry.io/5340950',
    API_WORKER_SYNC: 'http://192.168.100.36:8000',
    TIME_IDLE: 86400,
    USER_TYPE: 'user',
    COMPANY_NAME: 'Sol Café',
    PARTITION_KEY: '62bb1fb99e1dbaa708f853b7'
};
