import {
  EPoiTypes,
  LocalizedItem,
  PoiData,
  TextualDescription
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';

export interface ExternalPoi extends PoiData {
  id: string;
  elevation: number;
  lat: number;
  lon: number;
  objectTypes?: Array<EPoiTypes>;
  types: Array<string>;
  description: LocalizedItem<TextualDescription>;
  selected?: boolean;
  distanceFromOrigo?: number;
  isStart?: boolean;
  isFinish?: boolean;
  inGtrackDb?: boolean;
  inCollector?: boolean;
  distFromRoute?: number;
  onRoute?: boolean;
}
