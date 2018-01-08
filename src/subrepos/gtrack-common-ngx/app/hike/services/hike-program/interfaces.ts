import { IPoi } from '../poi';

export interface IHikeDescriptionData {
  full: string;
  name: string;
  summary: string;
};

export interface IHikeDescription {
  [locale: string]: IHikeDescriptionData;
};

export interface IHikeProgramBackgroundImage {
  url: string;
};

export interface IHikeProgramStopData {
  distanceFromOrigo: number;
  isCheckpoint: boolean;
  poiId: string;
  lat: number;
  lon: number;
  segment: {
    uphill: number;
    downhill: number;
    distance: number;
    score: number;
    time: number;
  }
};

export interface IHikeProgramStop extends IHikeProgramStopData {
  isStart?: boolean;
  isFinish?: boolean;
}

export interface IHikeProgramBase {
  id: string;
  distance: number;
  isRoundTrip: boolean;
  uphill: number;
  downhill: number;
  time: number;
  score: number;
  location: string;
  difficulty: string;
  backgroundImageUrls?: [IHikeProgramBackgroundImage];
  rate?: string;
  routeIcon: string;
  elevationIcon: string;
  routeId: string;
  description: IHikeDescription;
  offlineMap?: string;
}

export interface IHikeProgramData extends IHikeProgramBase {
  pois: string[];
  stops: IHikeProgramStopData[]
}

export interface IHikeProgram extends IHikeProgramBase {
  stops: IHikeProgramStop[]
}
