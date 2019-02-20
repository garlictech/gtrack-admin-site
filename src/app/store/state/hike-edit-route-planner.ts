import { IRouteTotal } from 'app/shared/interfaces';
import { ISegment } from 'subrepos/gtrack-common-ngx';

export interface HikeEditRoutePlannerState {
  segments: Array<ISegment>;
  total: IRouteTotal;
  location: any;
  route: GeoJSON.FeatureCollection<any>;
  routing: boolean; // Routing queries are running
  planning: boolean; // Planing mode on/off
}
