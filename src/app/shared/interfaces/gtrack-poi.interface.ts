import { IPoi } from 'subrepos/provider-client';

export interface IGTrackPoi extends IPoi {
  id?: string;
  inHike?: boolean | undefined;
  onRoute?: boolean | undefined;
}
