import { IEnvironment } from './ienvironment';

export class Environment implements IEnvironment {
  production = false;
  webappServer = 'http://localhost:8081';
  deepstream = 'ws://localhost:6020/deepstream';
  // deepstream = 'ws://deepstream.gtracksport.com/deepstream';

  authentication = {
    server: 'https://lz679q1jla.execute-api.us-east-1.amazonaws.com/latest',
    // server: 'https://y0z8yjok18.execute-api.us-east-1.amazonaws.com/latest',
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

  valhalla = {
    apiKey: 'valhalla-i5h6bCM'
  };
}
