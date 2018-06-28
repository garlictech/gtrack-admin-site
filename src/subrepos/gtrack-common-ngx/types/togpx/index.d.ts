declare module 'togpx' {
  import { GeoJsonProperties } from "geojson";

  interface ToGpxOptions {
    creator: string;
    metadata: any;
    featureTitle: (progperties: GeoJsonProperties) => string,
    featureDescription: (properties: GeoJsonProperties) => string,
    featureLink: (properties: GeoJsonProperties) => string,
    featureCoordTimes: (feature: GeoJSON.Feature<any>) => string[]
  }

  interface ToGpxStatic {
    (geojson: GeoJSON.GeoJsonObject, options?: ToGpxOptions): string
  }

  const toGpx: ToGpxStatic;
  
  export = toGpx;
}

