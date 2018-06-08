import { IPoiStored } from 'subrepos/provider-client';

export interface IGTrackPoi extends IPoiStored {
  inHike?: boolean | undefined;
  distFromRoute?: number | undefined;
  onRoute?: boolean | undefined;
}

// gTRackPoi merge

export interface IComparedProperty {
  [flatKey: string]: any[];
}

export interface IFilteredProperties {
  unique: IComparedProperty,
  conflicts: IComparedProperty
}
