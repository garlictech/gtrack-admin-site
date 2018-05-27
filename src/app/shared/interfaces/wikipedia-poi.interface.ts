import { IExternalPoi, IExternalPoiImageData } from './external-poi.interface';

export interface IWikipediaPhotoInfo {
  title: string;
  original: IExternalPoiImageData;
  thumbnail: IExternalPoiImageData;
}

export interface IWikipediaPoiInfo {
  pageid?: string;
  lng?: string;
  url?: string;
  extract?: string;
  photos?: IWikipediaPhotoInfo[]
}

export interface IWikipediaPoi extends IExternalPoi {
  wikipedia?: IWikipediaPoiInfo | undefined;
}
