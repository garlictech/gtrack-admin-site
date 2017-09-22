import { Poi } from '../poi';

export class Checkpoint {
  public marker: L.Marker;
  protected _name: string;

  constructor(public poi: Poi, public index: number) {
    this._name = `Checkpoint ${index}`;
  };

  public get name(): string {
    let name = this._name;

    if (this.poi.isStart === true && this.poi.isFinish === true) {
      name = 'Start - Finish';
    } else if (this.poi.isStart === true) {
      name = 'Start';
    } else if (this.poi.isFinish === true) {
      name = 'Finish';
    }

    return name;
  }
}
