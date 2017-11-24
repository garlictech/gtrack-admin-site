import { IPoi } from '../../../subrepos/gtrack-common-ngx/app/poi/ipoi';

export interface IExternalPoi {
  id?: string;
  elevation?: string;
  lat: number;
  lon: number;
  objectType?: string;
  title?: string;
  types?: string[];
  segment?: any;
  inHike?: boolean;
  distanceFromOrigo?: number;
  isStart?: boolean;
  isFinish?: boolean;
  // Extends IPoi
  google?: {
    [lng: string]: any;
  };
  osm?: {
    [lng: string]: any;
  };
  wikipedia?: {
    id: string;
    url: string;
  };
  inGtrackDb?: boolean;
  onRoute?: boolean;
  distFromRoute?: number;
}
