import { Poi } from 'subrepos/gtrack-common-ngx/index';
import { IPoi } from 'subrepos/provider-client';
import { IExternalPoi } from 'app/shared/interfaces';
import * as _ from 'lodash';
import { read } from 'fs';

export class ExternalPoi extends Poi implements IExternalPoi {
  public inGtrackDb: boolean;
  public distFromRoute: number;
  public onRoute: boolean;

  public constructor(public data: IExternalPoi) {
    super(<IPoi>data);

    this.inGtrackDb = false;
    this.distFromRoute = 0;
  }

  // todo: check this method when working. dbObj is missing in the new ExPoi class!
  public getDbObj() {
    let _res = {};

    _.defaultsDeep(_res, _.pick(this), ['elevation', 'lat', 'lon', 'objectType', 'title', 'types']);

    if (this[this.objectType]) {
      _res[this.objectType] = {};
    } else {
      _.defaultsDeep(_res[this.objectType], this[this.objectType]);
    }

    return _res;
  }
}
