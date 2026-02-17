// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // global configurations
  production: false,
  serviceWorker: true,
  // neeraj       11072 
  // bikram     11071 
  apiUrl: 'http://94.136.187.127:11051/inventory/api/', // test
  // apiUrl: 'http://94.136.187.127:11072/inventory/api/', // neeraj
  // apiUrl: 'http://94.136.187.127:11071/inventory/api/', // bikram

  defaultImage: '../../../assets/images/logo.png',
  USERDATA_KEY: 'authf649fc9a5f55',
  UserAgent: 'webAgent',
};
