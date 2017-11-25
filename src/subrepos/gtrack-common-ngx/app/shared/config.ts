export interface IGoogleMapsConfig {
  key: string;
  v?: string;
};

export class SharedConfig {
  googleMaps: IGoogleMapsConfig = {
    key: 'AIzaSyANByCixyD2mLtE80aUooldhc3E9W1NqGQ'
  };
}
