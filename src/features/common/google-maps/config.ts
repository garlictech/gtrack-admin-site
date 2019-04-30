export interface GoogleMapsConfig {
  key: string;
  libraries?: Array<string>;
  v?: string;
}

export const GOOGLE_MAPS_CONFIG = {
  key: 'AIzaSyANByCixyD2mLtE80aUooldhc3E9W1NqGQ',
  // key: 'AIzaSyAlBUYkm8VYLS1eeOL7rYdd7Sh0syilXL4', // gTrackDemo1 - Tamás
  libraries: ['geometry', 'places']
};
