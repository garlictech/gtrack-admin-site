import { IPoiStored } from 'subrepos/provider-client';

export interface IGTrackPoi extends IPoiStored {
  inHike?: boolean | undefined;
  distFromRoute?: number | undefined;
  onRoute?: boolean | undefined;
}
