import { ExternalPoi } from './external-poi';
import { IOsmPoi, IExternalPoi } from 'app/shared/interfaces';

export class OsmPoi extends ExternalPoi implements IOsmPoi {
  public osm: {
    [lng: string]: any
  };

  public constructor(data: IOsmPoi) {
    super(data);
  }
}
