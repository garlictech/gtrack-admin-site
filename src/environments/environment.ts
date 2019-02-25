import { IEnvironment } from './ienvironment';

// Development environment
export class Environment implements IEnvironment {
  production = false;
  staging = false;
  webappServer = window.location.origin;
  deepstream = 'ws://localhost:6020/deepstream';

  lambdaEndpoint = 'https://3zcs4wggya.execute-api.us-east-1.amazonaws.com/latest';


  authentication = {
    server: 'https://17g10h60ff.execute-api.us-east-1.amazonaws.com/latest',
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
    apiKey: '0191c7b116e215758a6c2450bf8a4c46',
    secret: 'c420ea95cde9cfb9'
  };

  googlePhotoLimit = 2;

  awsConfig = {
    s3: 'to-be-configured',
    policyGenerator: this.lambdaEndpoint + '/generate-s3-policy'
  };

  openWeatherMap = {
    key: 'e5a0aba93cfca3ee54c272133018df78'
  };
}

export const environment = new Environment();
