import { RouteBounds, RouteData, RouteStored } from '@features/common/gtrack-interfaces';

import _cloneDeep from 'lodash-es/cloneDeep';

export class Route implements RouteData {
  id: string;
  bounds: RouteBounds;
  route: GeoJSON.FeatureCollection<any>;

  get path(): GeoJSON.LineString {
    return this.route.features[0].geometry;
  }

  get geojson(): any {
    return this.route;
  }

  constructor(data: RouteStored) {
    const converted = _cloneDeep(data);
    Object.assign(this, converted);
  }
}
