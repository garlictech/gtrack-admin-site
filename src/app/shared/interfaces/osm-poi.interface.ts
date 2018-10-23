import { IExternalPoi } from './external-poi.interface';

export interface IOsmPoi extends IExternalPoi {
  osm?:
    | {
        [lng: string]: any;
      }
    | undefined;
}
