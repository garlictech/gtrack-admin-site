import { IEnvironment } from './ienvironment';

export class Environment implements IEnvironment {
  production = false;
  staging = false;
  webappServer = 'http://localhost:8081';
  deepstream = 'ws://localhost:6020/deepstream';

  lambdaEndpoint = 'https://y3nuwgmlpc.execute-api.us-east-1.amazonaws.com/latest';

  authentication = {
    server: 'https://lz679q1jla.execute-api.us-east-1.amazonaws.com/latest',
    google: { appId: '941049973777-8pdbs3vi9veua8i21fbnhkmku74s00dm.apps.googleusercontent.com' }
  };

  raven = 'no-raven-in-dev';

  graphhopper = { apiKey: '111444bf-7c37-499b-b87c-b324d7406715' };

  mapillary = { clientID: 'bWxkcHdGR0dyRVJPNU1wRklzVHZoZzo5YmE0YzlmNzQ1NmY0ZWFh' };

  googlePhotoLimit = 2;

  awsConfig = { s3: 'to-be-configured', policyGenerator: this.lambdaEndpoint + '/generate-s3-policy' };
}
