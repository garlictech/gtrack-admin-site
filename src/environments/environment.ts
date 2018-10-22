import { IEnvironment } from './ienvironment';

// Development environment
export class Environment implements IEnvironment {
  production = false;
  staging = false;
  webappServer = window.location.origin;
  deepstream = 'ws://localhost:6020/deepstream';

  lambdaEndpoint = 'https://y3nuwgmlpc.execute-api.us-east-1.amazonaws.com/latest';

  authentication = {
    server: 'https://lz679q1jla.execute-api.us-east-1.amazonaws.com/latest',
    google: { appId: '941049973777-8pdbs3vi9veua8i21fbnhkmku74s00dm.apps.googleusercontent.com' }
  };

  raven = 'no-raven-in-dev';

  graphhopper = {
    apiKey: '111444bf-7c37-499b-b87c-b324d7406715'
  };

  mapillary = {
    clientID: 'bWxkcHdGR0dyRVJPNU1wRklzVHZoZzo5YmE0YzlmNzQ1NmY0ZWFh'
  };

  flickr = {
    // dd9a8ad609e489e39d1ba521525e1dd5 is for petrot81 user!!!
    apiKey: 'dd9a8ad609e489e39d1ba521525e1dd5',
    secret: '287dc1495420c9a3'
  }

  googlePhotoLimit = 2;

  awsConfig = {
    s3: 'to-be-configured',
    policyGenerator: this.lambdaEndpoint + '/generate-s3-policy'
  };
}

export const environment = new Environment();
