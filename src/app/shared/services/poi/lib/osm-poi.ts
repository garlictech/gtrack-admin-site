import { ExternalPoi } from './external-poi';
import { IOsmPoi, IExternalPoi } from 'app/shared/interfaces';

export class OsmPoi extends ExternalPoi implements IOsmPoi {
  public constructor(public data: IOsmPoi) {
    super(<IExternalPoi>data);
  }
}
