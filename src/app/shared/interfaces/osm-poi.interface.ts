import { ExternalPoi } from './external-poi.interface';

export interface IOsmPoi extends ExternalPoi {
  osm?:
    | {
        [lng: string]: any;
      }
    | undefined;
}
