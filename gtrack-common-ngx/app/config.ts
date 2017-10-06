export interface IGoogleMapsConfig {
  key: string;
  v?: string;
};

export class CommonConfig {
  googleMaps: IGoogleMapsConfig = {
    key: null
  };
}
