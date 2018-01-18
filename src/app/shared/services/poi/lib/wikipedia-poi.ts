import { ExternalPoi } from './external-poi';
import { IWikipediaPoi, IExternalPoi } from 'app/shared/interfaces';

export class WikipediaPoi extends ExternalPoi implements IWikipediaPoi {
  public constructor(public data: IWikipediaPoi) {
    super(<IExternalPoi>data);
  }
}
