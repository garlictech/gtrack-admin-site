import { IHikeDescription } from './ihike-description';

export interface IHikeBackgroundImage {
  url: string;
};

export interface IHike {
  id: string;
  distance: number;
  uphill: number;
  downhill: number;
  time: number;
  score: number;
  location: string;
  difficulty: string;
  backgroundImageUrls?: [IHikeBackgroundImage];
  rate?: string;
  routeIcon: string;
  elevationIcon: string;
  routeId: string;
  description: IHikeDescription;
  offlineMap?: string;
}
