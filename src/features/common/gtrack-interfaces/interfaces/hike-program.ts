// tslint:disable-next-line:no-commented-code
// import { CheckpointSequence } from 'subrepos/gtrack-common-ngx';

import { LocalizedItem, TextualDescription } from './common';
import { Locatable } from './location';
import { ProviderInput } from './provider';
import { Publishable } from './state';

export interface HikeProgramSaveResponse {
  id: string;
  success: boolean;
}

export interface PoiImageInfo {
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

export interface PoiImageSource {
  type: EPoiImageTypes;
  poiObjectId: string;
  photoReference?: string;
}

export interface BackgroundImageData {
  title: string;
  lat: number;
  lon: number;
  original: PoiImageInfo;
  card: PoiImageInfo;
  thumbnail: PoiImageInfo;
  source: PoiImageSource;
  additionalData?: any;
}

export interface BackgroundImageDataStored extends BackgroundImageData {
  id: string;
}

export interface RouteSegment {
  uphill: number;
  downhill: number;
  distance: number;
  score?: number;
  time?: number;
  difficulty?: number;
}

export interface HikeProgramStop {
  distanceFromOrigo: number;
  poiId: string;
  lat: number;
  lon: number;
  onRoute?: boolean;
  segment: RouteSegment;
  isStart?: boolean;
  isFinish?: boolean;
}

export enum EHikeProgramDifficulty {
  easy,
  normal,
  hard
}

export interface HikeProgramData {
  id?: string;
  distance: number;
  reversed?: boolean;
  isRoundTrip: boolean;
  feature: boolean;
  uphill: number;
  downhill: number;
  time: number;
  reverseTime: number;
  score: number;
  reverseScore: number;
  location: string;
  difficulty: EHikeProgramDifficulty;
  backgroundImages?: Array<BackgroundImageData>;
  rate?: string;
  routeIcon?: string;
  elevationIcon?: string;
  routeId: string;
  description: LocalizedItem<TextualDescription>;
  teaser: LocalizedItem<TextualDescription>;
  offlineMap?: string;
  stops: Array<HikeProgramStop>;
  reverseStops: Array<HikeProgramStop>;
  // checkpoints?: CheckpointSequence;
}

export interface HikeProgramInput extends HikeProgramData, ProviderInput {}

export interface HikeProgramStored extends HikeProgramData, Publishable, Locatable {
  id: string;
  timestamp: number;
}
