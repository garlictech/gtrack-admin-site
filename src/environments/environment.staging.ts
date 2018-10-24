import { IEnvironment } from './ienvironment';

export class Environment implements IEnvironment {
  production = true;
  staging = true;
  webappServer = window.location.origin;
  // deepstream = 'wss://deepstream-staging.gtracksport.com/deepstream';
  deepstream = 'wss://deepstream.staging.gtracksport.com/deepstream';

  lambdaEndpoint = 'https://y3nuwgmlpc.execute-api.us-east-1.amazonaws.com/latest';

  authentication = {
    server: 'https://lz679q1jla.execute-api.us-east-1.amazonaws.com/latest',
    google: { appId: '941049973777-8pdbs3vi9veua8i21fbnhkmku74s00dm.apps.googleusercontent.com' }
  };

  raven = 'https://628e9a0b3fc8471f8bbcff98d3efb2ca@sentry.io/1209866';

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
  };

  googlePhotoLimit = 0; // no limit

  awsConfig = {
    s3: 'to-be-configured',
    policyGenerator: this.lambdaEndpoint + '/generate-s3-policy'
  };
}

export const environment = new Environment();
