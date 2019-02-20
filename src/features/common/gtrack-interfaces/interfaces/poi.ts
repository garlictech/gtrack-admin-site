import { LocalizedItem, TextualDescription } from './common';
import { BackgroundImageData } from './hike-program';
import { Locatable } from './location';
import { ProviderInput } from './provider';
import { Publishable } from './state';

export enum EPoiTypes {
  google = 'google',
  wikipedia = 'wikipedia',
  osmAmenity = 'osmAmenity',
  osmNatural = 'osmNatural',
  osmRoute = 'osmRoute'
}

export interface PoiArchiveInput extends ProviderInput {
  id: string;
}

export interface PoiMergeInput extends ProviderInput {
  ids: Array<string>;
  newData: PoiData;
}

export interface PoiSaveResponse {
  success: boolean;
  id: string;
}

export interface PoiData {
  id?: string;
  elevation: number;
  lat: number;
  lon: number;
  objectTypes?: Array<EPoiTypes>;
  types: Array<string>;
  description: LocalizedItem<TextualDescription>;
  backgroundImages?: Array<BackgroundImageData>;
  tags?: Array<string>;
  objectId?: {
    [objectType: string]: string | LocalizedItem<string>; // Google/OSM pageid, wiki multi ids
  };
  additionalData?: {
    [key: string]: string; // url/address/phoneNumber/openingHours
  };
}

export interface PoiInput extends PoiData, ProviderInput {}

export interface PoiStored extends PoiData, Publishable, Locatable {
  id: string;
  timestamp: number;
}
