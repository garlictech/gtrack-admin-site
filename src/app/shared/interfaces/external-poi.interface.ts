import { IPoi } from 'subrepos/provider-client';

export interface IExternalPoi extends IPoi {
  id?: string;
  inHike?: boolean | undefined;
  distanceFromOrigo?: number | undefined;
  isStart?: boolean | undefined;
  isFinish?: boolean | undefined;
  inGtrackDb?: boolean | undefined;
  distFromRoute?: number | undefined;
  onRoute?: boolean | undefined;
}
