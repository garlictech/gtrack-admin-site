import { BackgroundImageData } from 'subrepos/provider-client';

import { ExternalPoi } from './external-poi.interface';

export interface IWikipediaPoiInfo {
  pageid?: number;
  lng?: string;
  url?: string;
  extract?: string;
  photos?: Array<BackgroundImageData>;
}

export interface IWikipediaPoi extends ExternalPoi {
  wikipedia?: IWikipediaPoiInfo | undefined;
}
