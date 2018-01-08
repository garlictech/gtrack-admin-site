export interface IPoi {
  id: string;
  elevation?: string;
  lat: number;
  lon: number;
  objectType?: string;
  title?: string;
  types?: string[];
  segment?: any;
  inHike?: boolean;
  distanceFromOrigo?: number;
  isStart?: boolean;
  isFinish?: boolean;
}
