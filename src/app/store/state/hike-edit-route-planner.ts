import { ISegment } from 'subrepos/gtrack-common-ngx';
import { IRouteTotal } from 'app/shared/interfaces';

export interface IHikeEditRoutePlannerState {
  segments: ISegment[];
  total: IRouteTotal;
  location: any;
  route: GeoJSON.FeatureCollection<any>;
  routing: boolean; // Routing queries are running
  planning: boolean; // Planing mode on/off
}
