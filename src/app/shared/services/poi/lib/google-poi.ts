import { ExternalPoi } from './external-poi';
import { IGooglePoi, IExternalPoi } from 'app/shared/interfaces';

export class GooglePoi extends ExternalPoi implements IGooglePoi {
  public constructor(public data: IGooglePoi) {
    super(<IExternalPoi>data);
  }
}
