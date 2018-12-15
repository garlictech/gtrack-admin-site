import { IProviderInput } from './provider';
import { ILocalizedItem, ITextualDescription } from './common';
import { IPublishable } from './state';
import { ILocatable } from '.';
import { CheckpointSequence } from '../../gtrack-common-ngx';

export interface IHikeProgramSaveResponse {
  id: string;
  success: boolean;
}

export interface IPoiImageInfo {
  url: string;
  width?: number;
  height?: number;
}

export enum EPoiImageTypes {
  google = 'google',
  wikipedia = 'wikipedia',
  mapillary = 'mapillary',
  flickr = 'flickr'
}

export interface IPoiImageSource {
  type: EPoiImageTypes;
  poiObjectId: string;
  photoReference?: string;
}

export interface IBackgroundImageData {
  title: string;
  lat: number;
  lon: number;
  original: IPoiImageInfo;
  card: IPoiImageInfo;
  thumbnail: IPoiImageInfo;
  source: IPoiImageSource;
  additionalData?: any;
}

export interface IBackgroundImageDataStored extends IBackgroundImageData {
  id: string;
}

export interface IRouteSegment {
  uphill: number;
  downhill: number;
  distance: number;
  score?: number;
  time?: number;
  difficulty?: number;
}

export interface IHikeProgramStop {
  distanceFromOrigo: number;
  poiId: string;
  lat: number;
  lon: number;
  onRoute?: boolean;
  segment: IRouteSegment;
  isStart?: boolean;
  isFinish?: boolean;
}

export interface IHikeProgram {
  id?: string;
  distance: number;
  isRoundTrip: boolean;
  feature: boolean;
  uphill: number;
  downhill: number;
  time: number;
  reverseTime: number;
  score: number;
  reverseScore: number;
  location: string;
  difficulty: number;
  backgroundImages?: IBackgroundImageData[];
  rate?: string;
  routeIcon?: string;
  elevationIcon?: string;
  routeId: string;
  description: ILocalizedItem<ITextualDescription>;
  offlineMap?: string;
  stops: IHikeProgramStop[];
  reverseStops: IHikeProgramStop[];
  checkpoints?: CheckpointSequence;
}

export interface IHikeProgramInput extends IHikeProgram, IProviderInput {}

export interface IHikeProgramStored extends IHikeProgram, IPublishable, ILocatable {
  id: string;
  timestamp: number;
}
