import { IPoi } from './poi';
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
export interface IHikeProgramStop {
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
  },
  isStart?: boolean;
  isFinish?: boolean;
};
export interface IHikeProgram {
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
  pois: string[];
  stops: IHikeProgramStop[];
}
