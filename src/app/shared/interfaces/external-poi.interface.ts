import { IPoi } from 'subrepos/provider-client';

export interface IExternalPoi extends IPoi {
  inGtrackDb?: boolean | undefined;
  onRoute?: boolean | undefined;
  distFromRoute?: number | undefined;
}
