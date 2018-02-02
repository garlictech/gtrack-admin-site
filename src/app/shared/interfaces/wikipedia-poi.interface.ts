import { IExternalPoi } from './external-poi.interface';

interface IWikipediaImageData {
  source: string;
  width: number;
  height: number;
}

export interface IWikipediaPageImageInfo {
  title: string;
  original: IWikipediaImageData;
  thumbnail: IWikipediaImageData;
}

export interface IWikipediaPoiInfo {
  pageid?: string;
  lng?: string;
  url?: string;
  extract?: string;
  pageImage?: IWikipediaPageImageInfo
}

export interface IWikipediaPoi extends IExternalPoi {
  wikipedia?: IWikipediaPoiInfo | undefined;
}
