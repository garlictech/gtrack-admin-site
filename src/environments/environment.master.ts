import { IEnvironment } from './ienvironment';

export class Environment implements IEnvironment {
  production = true;
  staging = false;
  webappServer = 'https://grack-admin-prod.firebaseapp.com/';
  deepstream = 'wss://deepstream.gtracksport.com/deepstream';

  authentication = {
    server: 'https://y0z8yjok18.execute-api.us-east-1.amazonaws.com/latest',
    google: { appId: '941049973777-8pdbs3vi9veua8i21fbnhkmku74s00dm.apps.googleusercontent.com' }
  };
  raven = 'https://628e9a0b3fc8471f8bbcff98d3efb2ca@sentry.io/1209866';

  graphhopper = { apiKey: '111444bf-7c37-499b-b87c-b324d7406715' };

  mapillary = { clientID: 'bWxkcHdGR0dyRVJPNU1wRklzVHZoZzo5YmE0YzlmNzQ1NmY0ZWFh' };

  googlePhotoLimit = 0; // no limit
}
