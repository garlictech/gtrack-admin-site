export interface GeoPositionError {
  code: number;
  message: string;
}

export interface GeoCoordinates {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  altitudeAccuracy: number | null;
}

export interface GeoPosition {
  coords: GeoCoordinates;
  timestamp: number;
}
