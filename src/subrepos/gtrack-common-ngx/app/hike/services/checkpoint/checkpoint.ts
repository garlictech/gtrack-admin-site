import { IHikeProgramStop } from 'subrepos/provider-client';

export class Checkpoint {
  protected _name: string;
  public id: string;

  constructor(public stop: IHikeProgramStop, public index: number) {
    this._name = `Checkpoint ${index}`;
    this.id = stop.poiId;
  }

  public get name(): string {
    let name = this._name;

    if (this.stop.isStart === true && this.stop.isFinish === true) {
      name = 'Start - Finish';
    } else if (this.stop.isStart === true) {
      name = 'Start';
    } else if (this.stop.isFinish === true) {
      name = 'Finish';
    }

    return name;
  }
}
