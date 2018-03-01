import { IEnvironment } from './ienvironment';

export class Environment implements IEnvironment {
  production = true;
  webappServer = 'https://gtrack-admin-zlnhf.firebaseapp.com/';
  deepstream = 'wss://deepstream.gtracksport.com/deepstream';

  authentication = {
    server: 'https://y0z8yjok18.execute-api.us-east-1.amazonaws.com/latest',
    google: {
      appId: '941049973777-8pdbs3vi9veua8i21fbnhkmku74s00dm.apps.googleusercontent.com'
    }
  };

  firebase = {
    apiKey: 'AIzaSyBCM1WTsTQi7yOXc2WlTVJdGuJEHD4QngE',
    authDomain: 'gtrack-auth-e2e.firebaseapp.com',
    databaseURL: 'https://gtrack-auth-e2e.firebaseio.com',
    storageBucket: 'gtrack-auth-e2e.appspot.com',
    messagingSenderId: '383921170591'
  };

  graphhopper = {
    // TODO: '440eeec6-5492-4713-8c7a-2e9f2904d5b3' is a private TEST KEY!!!
    apiKey: '440eeec6-5492-4713-8c7a-2e9f2904d5b3'
  };
}
