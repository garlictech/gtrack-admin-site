import { IPoi } from 'subrepos/provider-client';

export interface IGTrackPoi extends IPoi {
  id?: string;
  inHike?: boolean | undefined;
  distFromRoute?: number | undefined;
  onRoute?: boolean | undefined;
}
