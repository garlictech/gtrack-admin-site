import { IPoi, EPoiTypes, ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';
import * as _ from 'lodash';

export class Poi implements IPoi {
  public id: string;
  public elevation: number;
  public lat: number;
  public lon: number;
  public objectType: EPoiTypes;
  public types: string[] = [];
  public description: ILocalizedItem<ITextualDescription>;
  public tags: string[] = [];

  public constructor(data: IPoi) {
    // Temporary fix for copying isCheckpoint getter
    _.assign(this, _.omit(data, ['isCheckpoint']));
  }

  public setToCheckpoint() {
    if (this.isCheckpoint !== true) {
      this.types = this.types || [];
      this.types.push('checkpoint');
    }
  }

  public get isCheckpoint(): boolean {
    return (this.types instanceof Array && this.types.indexOf('checkpoint') > -1);
  }
}
