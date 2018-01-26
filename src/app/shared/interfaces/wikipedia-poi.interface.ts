import { IExternalPoi } from './external-poi.interface';

export interface IWikipediaPoi extends IExternalPoi {
  wikipedia?: {
    id: string;
    url: string;
    extract?: string;
  } | undefined;
}
