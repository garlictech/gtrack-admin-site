import { BackgroundImageData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
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
