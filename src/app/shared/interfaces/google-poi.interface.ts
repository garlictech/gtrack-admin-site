import { IExternalPoi, IExternalPoiImageData } from './external-poi.interface';

export interface IGooglePhotoInfo {
  title: string;
  original: IExternalPoiImageData;
  thumbnail: IExternalPoiImageData;
}

export interface IGooglePoi extends IExternalPoi {
  google?: {
    [lng: string]: any;
  } | undefined;
}
