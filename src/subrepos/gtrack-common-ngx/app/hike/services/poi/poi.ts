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
    let converted = _.cloneDeep(data);
    Object.assign(this, converted);
  }
}
