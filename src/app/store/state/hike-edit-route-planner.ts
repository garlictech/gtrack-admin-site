import { RouteTotal } from 'app/shared/interfaces';

import { Segment } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

export interface HikeEditRoutePlannerState {
  segments: Array<Segment>;
  total: RouteTotal;
  location: any;
  route: GeoJSON.FeatureCollection<any>;
  routing: boolean; // Routing queries are running
  planning: boolean; // Planing mode on/off
}
