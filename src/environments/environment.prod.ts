/**
 * This env is for labportal's production and staging env
 * identical to prod environment, except the sandbox flag is set to true
 */
import packageJson from 'package.json';

export const environment = {
  production: true,
  sandbox: false,
  version: packageJson.version,
  gatewayURL:
    'https://gateway.labportal.geneicd.com/s3?key=geneicd-patient-data/',
  resultGatewayUrl: 'https://result-delivery.labportal.geneicd.com/sendtoemr',
  resultGatewayKey: 'kwJqoT9lAK3ZDOPMIPKso8pqpgIrl8bs7oCOKE0F',
  aws: {
    region: 'us-east-2',
    // For User Pool lab-portal
    cognitoPool: {
      UserPoolId: 'us-east-2_ryd3QJXCf', // user pool id
      ClientId: '5nso0on0qgj1t5u6lgic989kh1', // client id
    },
  },
};
