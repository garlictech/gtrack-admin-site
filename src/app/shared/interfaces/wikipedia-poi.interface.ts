import { IExternalPoi } from './external-poi.interface';
import { IBackgroundImageData } from 'subrepos/provider-client';

export interface IWikipediaPoiInfo {
  pageid?: string;
  lng?: string;
  url?: string;
  extract?: string;
  photos?: IBackgroundImageData[];
}

export interface IWikipediaPoi extends IExternalPoi {
  wikipedia?: IWikipediaPoiInfo | undefined;
}
