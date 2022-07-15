// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageJson from 'package.json';

export const environment = {
  production: false,
  sandbox: true,
  version: packageJson.version,
  gatewayURL:
    'https://gateway.sandbox.labportal.geneicd.com/s3?key=geneicd-labportalsandbox-synthetic/',
  resultGatewayUrl: '',
  resultGatewayKey: '',
  aws: {
    region: 'us-east-2',
    cognitoPool: {
      UserPoolId: 'us-east-2_ryd3QJXCf', // user pool id
      ClientId: '5nso0on0qgj1t5u6lgic989kh1', // client id
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
