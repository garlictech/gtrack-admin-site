export interface IEnvironment {
  production: boolean;
  staging: boolean;
  webappServer: string;
  deepstream: string;

  authentication: {
    server: any;
    google: {
      appId: string;
    };
  };

  graphhopper: {
    apiKey: string;
  };

  raven: string;
}
