import { IPoiStored } from 'subrepos/provider-client';

export interface IGTrackPoi extends IPoiStored {
  inHike?: boolean | undefined;
  distFromRoute?: number | undefined;
  distFromOrigo?: number | undefined;
  onRoute?: boolean | undefined;
}

// gTRackPoi merge

export interface IComparedProperty {
  [flatKey: string]: Array<any>;
}

export interface IFilteredProperties {
  unique?: IComparedProperty;
  conflicts?: IComparedProperty;
}
