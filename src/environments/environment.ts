// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  authServer: 'http://localhost:3000',
  webappServer: 'http://localhost:8081',
  google: {
    appId: '941049973777-8pdbs3vi9veua8i21fbnhkmku74s00dm.apps.googleusercontent.com'
  },
  firebase: {
    apiKey: 'AIzaSyBCM1WTsTQi7yOXc2WlTVJdGuJEHD4QngE',
    authDomain: 'gtrack-auth-e2e.firebaseapp.com',
    databaseURL: 'https://gtrack-auth-e2e.firebaseio.com',
    storageBucket: 'gtrack-auth-e2e.appspot.com',
    messagingSenderId: '383921170591'
  },
  production: false
};
