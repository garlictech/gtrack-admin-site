import { ExternalPoi } from './external-poi.interface';

export interface IGooglePoi extends ExternalPoi {
  google?:
    | {
        [lng: string]: any;
      }
    | undefined;
}
