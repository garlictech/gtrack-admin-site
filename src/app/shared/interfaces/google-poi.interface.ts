import { IExternalPoi } from './external-poi.interface';

export interface IGooglePoi extends IExternalPoi {
  google?: {
    [lng: string]: any;
  } | undefined;
}
