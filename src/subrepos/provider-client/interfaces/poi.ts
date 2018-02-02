import { IProviderInput } from './provider';

export enum EPoiTypes {
  google = 'google',
  wikipedia = 'wikipedia',
  osm = 'osm'
};

export interface IPoiSaveResponse {
  success: boolean;
  id: string;
}

export interface IPoi {
  elevation?: number;
  lat: number;
  lon: number;
  objectType?: EPoiTypes;
  title?: string;
  types?: string[];
  inHike?: boolean;
  distanceFromOrigo?: number;
  isStart?: boolean;
  isFinish?: boolean;
}

export interface IPoiInput extends IPoi, IProviderInput {}

export interface IPoiStored extends IPoi {
  id: string;
  timestamp: number;
}
