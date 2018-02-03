import { IProviderInput } from './provider';

export enum EPoiTypes {
  google = 'google',
  wikipedia = 'wikipedia',
  osm = 'osm', // TODO: DEPRECATED
  osmAmenity = 'osmAmenity',
  osmNatural = 'osmNatural',
  osmRoute = 'osmRoute'
};

export interface IPoiSaveResponse {
  success: boolean;
  id: string;
}

export interface IPoi {
  id?: string;
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
