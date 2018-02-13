import { IProviderInput } from './provider';

export interface IRouteSaveResponse {
  success: boolean;
  id: string;
}

export interface IRouteBounds {
  NorthEast: {
    lat: number,
    lon: number
  },
  SouthWest: {
    lat: number,
    lon: number
  }
}

export interface IRouteData extends GeoJSON.FeatureCollection<any> {
  bounds: IRouteBounds;
}

export interface IRoute {
  id?: string;
  bounds: IRouteBounds;
  route: IRouteData;
}

export interface IRouteInput extends IRoute, IProviderInput {}

export interface IRouteStored extends IRoute {
  id: string;
  timestamp: number;
}
