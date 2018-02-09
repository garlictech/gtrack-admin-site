import { Poi } from 'subrepos/gtrack-common-ngx/index';
import { IExternalPoi } from 'app/shared/interfaces';

export class ExternalPoi extends Poi implements IExternalPoi {
  // public segment: any;
  public inHike = false;
  public distanceFromOrigo = 0;
  public isStart = false;
  public isFinish = false;
  public inGtrackDb = false;
  public distFromRoute = 0;
  public onRoute: boolean;

  public constructor(data: IExternalPoi) {
    super(data);
  }
}
