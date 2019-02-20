import { EPoiTypes, ILocalizedItem, IPoi, ITextualDescription } from 'subrepos/provider-client';

export interface ExternalPoi extends IPoi {
  id: string;
  elevation: number;
  lat: number;
  lon: number;
  objectTypes?: Array<EPoiTypes>;
  types: Array<string>;
  description: ILocalizedItem<ITextualDescription>;
  selected?: boolean | undefined;
  distanceFromOrigo?: number | undefined;
  isStart?: boolean | undefined;
  isFinish?: boolean | undefined;
  inGtrackDb?: boolean | undefined;
  inCollector?: boolean | undefined;
  distFromRoute?: number | undefined;
  onRoute?: boolean | undefined;
}
