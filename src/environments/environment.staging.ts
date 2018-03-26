import { IEnvironment } from './ienvironment';

export class Environment implements IEnvironment {
  production = true;
  webappServer = 'https://gtrack-admin-zlnhf.firebaseapp.com/';
  deepstream = 'wss://deepstream-staging.gtracksport.com/deepstream';

  authentication = {
    server: 'https://lz679q1jla.execute-api.us-east-1.amazonaws.com/latest',
    google: {
      appId: '941049973777-8pdbs3vi9veua8i21fbnhkmku74s00dm.apps.googleusercontent.com'
    }
  };

  graphhopper = {
    apiKey: '111444bf-7c37-499b-b87c-b324d7406715'
  };
}
