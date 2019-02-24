import { PoiStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

export interface GTrackPoi extends PoiStored {
  inHike?: boolean;
  distFromRoute?: number;
  distFromOrigo?: number;
  onRoute?: boolean;
}

// gTRackPoi merge

export interface ComparedProperty {
  [flatKey: string]: Array<any>;
}

export interface FilteredProperties {
  unique?: ComparedProperty;
  conflicts?: ComparedProperty;
}
