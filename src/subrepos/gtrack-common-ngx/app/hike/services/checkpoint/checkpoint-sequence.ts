import { IHikeProgramStop } from '../../../../../provider-client';
import { Checkpoint } from './checkpoint';

export class CheckpointSequence {
  public checkpoints: Checkpoint[];

  constructor(stops: IHikeProgramStop[]) {
    this.checkpoints = stops
      // .filter(stop => stop.isCheckpoint)
      .map((stop, i) => {
        return new Checkpoint(stop, i);
      });
  }

  public get first(): Checkpoint {
    return this.checkpoints[0] || null;
  }

  public indexOf(checkpoint: Checkpoint): number {
    let stops  = this.checkpoints.map(point => point.stop.poiId);
    let index = -1;

    if (checkpoint && checkpoint.stop && checkpoint.stop.poiId) {
      let id = checkpoint.stop.poiId;
      index = stops.indexOf(id);
    }

    return index;
  }

  public getNextCheckpoint(checkpoint: Checkpoint): (Checkpoint|null) {
    let index = this.indexOf(checkpoint);
    let nextCheckpoint: (Checkpoint|null) = null;

    if (index > -1) {
      let next = index + 1;

      if (next < this.checkpoints.length) {
        nextCheckpoint = this.checkpoints[next];
      }
    }

    return nextCheckpoint;
  }

  public isLast(checkpoint: Checkpoint): boolean {
    let index = this.indexOf(checkpoint);

    return (index > -1 && (index === this.checkpoints.length - 1));
  }
}
