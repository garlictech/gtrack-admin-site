import { Poi, IPoi } from '../../../../subrepos/gtrack-common-ngx/index';
import * as _ from 'lodash';
import { read } from 'fs';

export class ExternalPoi extends Poi {
  private _inGtrackDb: boolean;

  public constructor(public data: IPoi) {
    super(data);

    this._inGtrackDb = false;
  }

  public set setInGtrackDb(val: boolean) {
    this._inGtrackDb = val;
  }

  public get isInGtrackDb(): boolean {
    return this._inGtrackDb;
  }

  public getDbObj() {
    let res = {};

    _.defaultsDeep(res, _.pick(this), ['elevation', 'lat', 'lon', 'objectType', 'title', 'types']);

    if (this[this.objectType]) {
      res[this.objectType] = {};
    } else {
      _.defaultsDeep(res[this.objectType], this[this.objectType]);
    }

    console.log('ExternalPoi getDbObj', res);
    return res;
  }
}
