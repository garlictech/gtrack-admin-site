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

  graphhopper = { apiKey: '111444bf-7c37-499b-b87c-b324d7406715' };
}
