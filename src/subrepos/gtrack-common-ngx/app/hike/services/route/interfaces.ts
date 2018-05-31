export interface IRoute {
  id: string;
  bounds: {
    NorthEast: {
      lat: number;
      lon: number;
    };
    SouthWest: {
      lat: number;
      lon: number;
    };
  };
  path: {
    coordinates: GeoJSON.Position[];
    type: string;
  };
  geojson: any;
}
