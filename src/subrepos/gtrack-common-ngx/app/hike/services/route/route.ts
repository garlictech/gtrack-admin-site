import { IRoute, IRouteData, IRouteBounds } from 'subrepos/provider-client';

export class Route implements IRoute {
  public id: string;
  public bounds: IRouteBounds;
  public route: IRouteData;

  public get path() {
    return this.route.features[0].geometry;
  }

  public get geojson() {
    return this.route;
  }

  constructor(data: IRoute) {
    Object.assign(this, data);
  }
}
