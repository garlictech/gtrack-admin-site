export interface IEnvironment {
  production: boolean;
  webappServer: string;
  deepstream: string;

  authentication: {
    server: any;
    google: {
      appId: string;
    };
  };

  firebase: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    storageBucket: string;
    messagingSenderId: string;
  };
}
