import { IEnvironment } from './ienvironment';

export class Environment implements IEnvironment {
  production = true;
  webappServer = 'https://gtrack-admin-zlnhf.firebaseapp.com/';
  deepstream = 'ws://deepstream-staging.gtracksport.com/deepstream';

  authentication = {
    server: 'https://lz679q1jla.execute-api.us-east-1.amazonaws.com/latest',
    google: {
      appId: '941049973777-8pdbs3vi9veua8i21fbnhkmku74s00dm.apps.googleusercontent.com'
    }
  };

  graphhopper = {
    apiKey: '440eeec6-5492-4713-8c7a-2e9f2904d5b3'
  };
}
