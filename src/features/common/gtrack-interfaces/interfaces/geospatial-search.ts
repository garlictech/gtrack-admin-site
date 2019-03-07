import { ProviderInput } from './provider';

export enum EGeospatialSearchUnits {
  meter = 'm',
  kilometer = 'km',
  mile = 'mi',
  foot = 'ft'
}

export type GeospatialSearchResponse = Array<string>;

export interface GeospatialSearchCircle {
  center: GeoJSON.Position;
  radius: number;
  unit?: EGeospatialSearchUnits;
}

export interface GeospatialBoxSearchPayload {
  table: string;
  box: GeoJSON.Polygon;
  limit?: number;
}

export interface GeospatialCircleSearchPayload {
  table: string;
  circle: GeospatialSearchCircle;
  limit?: number;
}

export interface GeospatialSearchBoxInput extends ProviderInput {
  payload: GeospatialBoxSearchPayload;
}

export interface GeospatialSearchCircleInput extends ProviderInput {
  payload: GeospatialCircleSearchPayload;
}
