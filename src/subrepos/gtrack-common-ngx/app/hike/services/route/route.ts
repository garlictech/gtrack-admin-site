import { IRoute, IRouteBounds, IRouteStored } from '../../../../../provider-client';

import _cloneDeep from 'lodash-es/cloneDeep';

export class Route implements IRoute {
  public id: string;
  public bounds: IRouteBounds;
  public route: GeoJSON.FeatureCollection<any>;

  public get path(): GeoJSON.LineString {
    return this.route.features[0].geometry;
  }

  public get geojson() {
    return this.route;
  }

  constructor(data: IRouteStored) {
    const converted = _cloneDeep(data);
    Object.assign(this, converted);
  }
}
