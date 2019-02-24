import { ExternalPoi } from './external-poi.interface';

export interface OsmPoi extends ExternalPoi {
  osm?: {
    [lng: string]: any;
  };
}
