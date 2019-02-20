import { Environment } from './ienvironment';

const lambdaEndpoint = 'https://ii1rrhpq2a.execute-api.us-east-1.amazonaws.com/latest';

export const environment: Environment = {
  production: true,
  staging: false,
  webappServer: window.location.origin,
  deepstream: 'wss://deepstream.gtracksport.com/deepstream',
  lambdaEndpoint,

  authentication: {
    server: 'https://y0z8yjok18.execute-api.us-east-1.amazonaws.com/latest',
    google: { appId: '941049973777-8pdbs3vi9veua8i21fbnhkmku74s00dm.apps.googleusercontent.com' }
  },
  raven: 'https://628e9a0b3fc8471f8bbcff98d3efb2ca@sentry.io/1209866',

  graphhopper: {
    apiKey: '111444bf-7c37-499b-b87c-b324d7406715'
  },

  mapillary: {
    clientID: 'bWxkcHdGR0dyRVJPNU1wRklzVHZoZzo5YmE0YzlmNzQ1NmY0ZWFh'
  },

  flickr: {
    apiKey: '0191c7b116e215758a6c2450bf8a4c46',
    secret: 'c420ea95cde9cfb9'
  },

  googlePhotoLimit: 0, // no limit

  awsConfig: {
    s3: 'to-be-configured',
    policyGenerator: `${lambdaEndpoint}/generate-s3-policy`
  },

  openWeatherMap: {
    key: 'e5a0aba93cfca3ee54c272133018df78'
  }
};
