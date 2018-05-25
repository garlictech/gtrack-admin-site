import { IProviderInput } from './provider';
import { ILocalizedItem, ITextualDescription } from './common';
import { IPublishable, EObjectState } from './state';

export enum EPoiTypes {
  google = 'google',
  wikipedia = 'wikipedia',
  osmAmenity = 'osmAmenity',
  osmNatural = 'osmNatural',
  osmRoute = 'osmRoute'
}

export interface IPoiArchiveInput extends IProviderInput {
  id: string;
}

export interface IPoiMergeInput extends IProviderInput {
  ids: string[]
}

export interface IPoiSaveResponse {
  success: boolean;
  id: string;
}

export interface IPoi {
  id?: string;
  elevation: number;
  lat: number;
  lon: number;
  objectType?: EPoiTypes;
  types: string[];
  description: ILocalizedItem<ITextualDescription>;
  tags?: string[];
  objectId?: {
    [objectType: string]: string | ILocalizedItem<string>; // Google/OSM pageid, wiki multi ids
  };
  additionalData?: {
    [key: string]: string; // url/address/phoneNumber/openingHours
  };
}

export interface IPoiInput extends IPoi, IProviderInput {}

export interface IPoiStored extends IPoi, IPublishable {
  id: string;
  timestamp: number;
}
