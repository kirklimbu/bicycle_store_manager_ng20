// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // global configurations
  production: false,
  serviceWorker: true,

  apiUrl: 'https://abstraders.com.np/inventory/api/', // test-namecheap (namecheap ip)
  // apiUrl: 'http://94.136.187.127:10051/inventory/api/', // test-namecheap (namecheap ip)

  defaultImage: '../../../assets/images/logo.png',
  USERDATA_KEY: 'authf649fc9a5f55',
  X_TenantID: 'kalpaanta',
  UserAgent: 'webAgent',
};
