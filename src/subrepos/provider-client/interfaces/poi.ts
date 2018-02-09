import { IProviderInput } from './provider';
import { ILocalizedItem, ITextualDescription } from './common';

export enum EPoiTypes {
  google = 'google',
  wikipedia = 'wikipedia',
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
  elevation: number;
  lat: number;
  lon: number;
  objectType: EPoiTypes;
  types: string[];
  description: ILocalizedItem<ITextualDescription>;
  objectId?: {
    [objectType: string]: string // Google/Wikipedia/OSM pageid
  };
  additionalData?: {
    [key: string]: string // url/address/phoneNumber/openingHours
  }
}

export interface IPoiInput extends IPoi, IProviderInput {}

export interface IPoiStored extends IPoi {
  id: string;
  timestamp: number;
}
