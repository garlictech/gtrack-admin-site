import { IRoute, IRouteBounds, IRouteStored } from 'subrepos/provider-client';
import * as _ from 'lodash';

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
    let converted = _.cloneDeep(data);
    Object.assign(this, converted);
  }
}
