export interface IGeoPositionError {
  code: number;
  message: string;
}

export interface IGeoCoordinates {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  altitudeAccuracy: number | null;
}

export interface IGeoPosition {
  coords: IGeoCoordinates;
  timestamp: number;
}
