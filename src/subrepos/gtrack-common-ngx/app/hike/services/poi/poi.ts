import { IPoi, EPoiTypes, ILocalizedItem, ITextualDescription, IBackgroundImageData } from '../../../../../provider-client';

import _cloneDeep from 'lodash-es/cloneDeep';

export class Poi implements IPoi {
  public id: string;
  public elevation: number;
  public lat: number;
  public lon: number;
  public objectType: EPoiTypes;
  public types: string[] = [];
  public description: ILocalizedItem<ITextualDescription>;
  public tags: string[] = [];
  public backgroundImages: IBackgroundImageData[];

  public constructor(data: IPoi) {
    const converted = _cloneDeep(data);
    Object.assign(this, converted);
  }
}
