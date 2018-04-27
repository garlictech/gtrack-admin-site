import { IPoi } from './poi';
import { IProviderInput } from './provider';
import { ILocalizedItem, ITextualDescription } from './common';

export interface IHikeProgramSaveResponse {
  id: string;
  success: boolean;
}

export interface IHikeProgramBackgroundImage {
  url: string;
}

export interface IHikeProgramStop {
  distanceFromOrigo: number;
  isCheckpoint: boolean;
  poiId: string;
  lat: number;
  lon: number;
  onRoute?: boolean;
  segment: {
    uphill: number;
    downhill: number;
    distance: number;
    score: number;
    time: number;
  };
  isStart?: boolean;
  isFinish?: boolean;
}

export interface IHikeProgram {
  id?: string;
  distance: number;
  isRoundTrip: boolean;
  uphill: number;
  downhill: number;
  time: number;
  score: number;
  location: string;
  difficulty: number;
  backgroundImageUrls?: IHikeProgramBackgroundImage[];
  rate?: string;
  routeIcon?: string;
  elevationIcon?: string;
  routeId: string;
  description: ILocalizedItem<ITextualDescription>;
  offlineMap?: string;
  stops: IHikeProgramStop[];
}

export interface IHikeProgramInput extends IHikeProgram, IProviderInput {}

export interface IHikeProgramStored extends IHikeProgram {
  id: string;
  timestamp: number;
}
