import { IPoi } from './ipoi';

export class Poi implements IPoi {
  public id: string;
  public elevation: string;
  public lat: number;
  public lon: number;
  public objectType: string;
  public title: string;
  public types: string[] = [];
  public segment: any;
  public inHike = false;
  public distanceFromOrigo = 0;
  public isStart = false;
  public isFinish = false;

  public constructor(public data: IPoi) {
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
