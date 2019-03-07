import { ExternalPoi } from './external-poi.interface';

export interface GooglePoi extends ExternalPoi {
  google?: {
    [lng: string]: any;
  };
}
