import { HikeProgramStop } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

export class Checkpoint {
  protected _name: string;
  id: string;

  constructor(public stop: HikeProgramStop, public index: number) {
    this._name = `Checkpoint ${index}`;
    this.id = stop.poiId;
  }

  get name(): string {
    let name = this._name;

    if (this.stop.isStart && this.stop.isFinish) {
      name = 'Start - Finish';
    } else if (this.stop.isStart) {
      name = 'Start';
    } else if (this.stop.isFinish) {
      name = 'Finish';
    }

    return name;
  }
}
