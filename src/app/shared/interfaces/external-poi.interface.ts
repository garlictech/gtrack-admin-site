import { IPoi } from 'subrepos/provider-client';

export interface IExternalPoi extends IPoi {
  id: string;
  selected?: boolean | undefined;
  distanceFromOrigo?: number | undefined;
  isStart?: boolean | undefined;
  isFinish?: boolean | undefined;
  inGtrackDb?: boolean | undefined;
  inCollector?: boolean | undefined;
  distFromRoute?: number | undefined;
  onRoute?: boolean | undefined;
}
