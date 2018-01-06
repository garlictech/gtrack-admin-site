import { IPoi } from 'subrepos/gtrack-common-ngx';

export interface IExternalPoi extends IPoi {
  /*
  id?: string | undefined;
  elevation?: string | undefined;
  lat: number;
  lon: number;
  objectType?: string | undefined;
  title?: string | undefined;
  types?: string[] | undefined;
  segment?: any | undefined;
  inHike?: boolean | undefined;
  distanceFromOrigo?: number | undefined;
  isStart?: boolean | undefined;
  isFinish?: boolean | undefined;
  */
  // Extends IPoi
  google?: {
    [lng: string]: any;
  } | undefined;
  osm?: {
    [lng: string]: any;
  } | undefined;
  wikipedia?: {
    id: string;
    url: string;
    extract?: string;
  } | undefined;
  inGtrackDb?: boolean | undefined;
  onRoute?: boolean | undefined;
  distFromRoute?: number | undefined;
}
