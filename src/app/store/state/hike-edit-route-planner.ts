import { ISegment } from 'subrepos/gtrack-common-ngx';

export interface IHikeEditRoutePlannerTotalState {
  distance?: number;
  uphill?: number;
  downhill?: number;
  coordinates?: any;
  time?: number;
  score?: number;
}

export interface IHikeEditRoutePlannerState {
  segments: ISegment[];
  total: IHikeEditRoutePlannerTotalState;
  location: any;
  route: GeoJSON.FeatureCollection<any>;
  planning: boolean;
};
