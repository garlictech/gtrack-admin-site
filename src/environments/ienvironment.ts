export interface Environment {
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

  awsConfig: {
    s3: string;
    policyGenerator: string;
  };

  lambdaEndpoint: string;

  mapillary: {
    clientID: string;
  };

  flickr: {
    apiKey: string;
    secret: string;
  };

  googlePhotoLimit: number;

  openWeatherMap: {
    key: string;
  };
}
