export interface IGoogleMapsConfig {
  key: string;
  libraries?: string[];
  v?: string;
};

export class SharedConfig {
  googleMaps: IGoogleMapsConfig = {
    key: 'AIzaSyANByCixyD2mLtE80aUooldhc3E9W1NqGQ',
    libraries: ['geometry', 'places']
  };
}