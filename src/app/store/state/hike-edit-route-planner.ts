import { ISegment } from 'subrepos/gtrack-common-ngx';

export interface IHikeEditRoutePlannerState {
  segments: ISegment[];
  total: any;
  location: any;
  route: GeoJSON.FeatureCollection<any>;
};
