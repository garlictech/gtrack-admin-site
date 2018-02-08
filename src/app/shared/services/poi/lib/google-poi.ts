import { ExternalPoi } from './external-poi';
import { IGooglePoi, IExternalPoi } from 'app/shared/interfaces';

export class GooglePoi extends ExternalPoi implements IGooglePoi {
  public google: {
    [lng: string]: any
  };

  public constructor(data: IGooglePoi) {
    super(data);
  }
}
