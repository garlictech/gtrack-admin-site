import { IPoi, EPoiTypes, ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

export class Poi implements IPoi {
  public id?: string;
  public elevation: number;
  public lat: number;
  public lon: number;
  public objectType: EPoiTypes;
  public types: string[] = [];
  public description: ILocalizedItem<ITextualDescription>;

  public constructor(data: IPoi) {
    Object.assign(this, data);
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
