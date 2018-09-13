import { IPoi, EPoiTypes, ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

export interface IExternalPoi extends IPoi {
  id: string;
  elevation: number;
  lat: number;
  lon: number;
  objectType?: EPoiTypes;
  types: string[];
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
