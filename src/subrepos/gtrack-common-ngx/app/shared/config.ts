export interface IGoogleMapsConfig {
  key: string;
  libraries?: string[];
  v?: string;
}

export class SharedConfig {
  googleMaps: IGoogleMapsConfig = {
    key: 'AIzaSyANByCixyD2mLtE80aUooldhc3E9W1NqGQ',
    // key: 'AIzaSyAlBUYkm8VYLS1eeOL7rYdd7Sh0syilXL4', // gTrackDemo1 - Tamás
    libraries: ['geometry', 'places']
  };
}
