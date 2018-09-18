<<<<<<< HEAD
import {
  IPoi,
  EPoiTypes,
  ILocalizedItem,
  ITextualDescription,
  IBackgroundImageData
} from '../../../../../provider-client';

import _cloneDeep from 'lodash-es/cloneDeep';
=======
import { IPoi, EPoiTypes, ILocalizedItem, ITextualDescription, IBackgroundImageData } from '../../../../../provider-client';
import * as _ from 'lodash';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

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
