import { ExternalPoi } from './external-poi';
import { IWikipediaPoi, IExternalPoi, IWikipediaPoiInfo } from 'app/shared/interfaces';

export class WikipediaPoi extends ExternalPoi implements IWikipediaPoi {
  public wikipedia:  IWikipediaPoiInfo;

  public constructor(public data: IWikipediaPoi) {
    super(<IExternalPoi>data);
  }
}
