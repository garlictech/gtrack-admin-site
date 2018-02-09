import { ExternalPoi } from './external-poi';
import { IWikipediaPoi, IWikipediaPoiInfo } from 'app/shared/interfaces';

export class WikipediaPoi extends ExternalPoi implements IWikipediaPoi {
  public wikipedia:  IWikipediaPoiInfo;

  public constructor(data: IWikipediaPoi) {
    super(data);
  }
}
