import { ProviderInput } from './provider';

export interface RouteSaveResponse {
  success: boolean;
  id: string;
}

export interface RouteBounds {
  NorthEast: {
    lat: number;
    lon: number;
  };
  SouthWest: {
    lat: number;
    lon: number;
  };
}

export interface RouteData {
  id?: string;
  bounds: RouteBounds;
  route: GeoJSON.FeatureCollection<any>;
}

export interface RouteInput extends RouteData, ProviderInput {}

export interface RouteStored extends RouteData {
  id: string;
  timestamp: number;
}
