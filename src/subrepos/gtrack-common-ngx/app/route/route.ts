import { IRoute } from './iroute';

export class Route implements IRoute {
  public id: string;
  public bounds: {
    NorthEast: {
      lat: number,
      lon: number
    },
    SouthWest: {
      lat: number,
      lon: number
    }
  };

  public path: {
    coordinates: GeoJSON.Position[],
    type: string
  };

  public geojson: any;

  constructor(data: IRoute) {
    Object.assign(this, data);
  }
}
