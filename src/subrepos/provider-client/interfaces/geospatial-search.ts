import { IProviderInput } from './provider';

export enum EGeospatialSearchUnits {
  meter = 'm',
  kilometer = 'km',
  mile = 'mi',
  foot = 'ft'
}

export type GeospatialSearchResponse = string[];

export interface IGeospatialSearchCircle {
  center: GeoJSON.Position;
  radius: number;
  unit?: EGeospatialSearchUnits;
}

export interface IGeospatialBoxSearchPayload {
  table: string;
  box: GeoJSON.Polygon;
  limit?: number;
}

export interface IGeospatialCircleSearchPayload {
  table: string;
  circle: IGeospatialSearchCircle;
  limit?: number;
}

export interface IGeospatialSearchBoxInput extends IProviderInput {
  payload: IGeospatialBoxSearchPayload;
}

export interface IGeospatialSearchCircleInput extends IProviderInput {
  payload: IGeospatialCircleSearchPayload;
}
