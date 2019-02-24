import { BackgroundImageData } from 'subrepos/provider-client';

import { ExternalPoi } from './external-poi.interface';

export interface WikipediaPoiInfo {
  pageid?: number;
  lng?: string;
  url?: string;
  extract?: string;
  photos?: Array<BackgroundImageData>;
}

export interface WikipediaPoi extends ExternalPoi {
  wikipedia?: WikipediaPoiInfo;
}
