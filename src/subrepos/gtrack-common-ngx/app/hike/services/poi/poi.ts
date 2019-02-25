import {
  BackgroundImageData,
  EPoiTypes,
  LocalizedItem,
  PoiData,
  TextualDescription
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import _cloneDeep from 'lodash-es/cloneDeep';

export class Poi implements PoiData {
  id: string;
  elevation: number;
  lat: number;
  lon: number;
  objectTypes: Array<EPoiTypes>;
  types: Array<string>;
  description: LocalizedItem<TextualDescription>;
  tags: Array<string>;
  backgroundImages: Array<BackgroundImageData>;

  constructor(data: PoiData) {
    const converted = _cloneDeep(data);
    Object.assign(this, converted);

    this.types = [];
    this.tags = [];
  }
}
