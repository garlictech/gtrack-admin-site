import { Poi } from '../poi';
import { Checkpoint } from './checkpoint';

export class CheckpointSequence {
  public checkpoints: Checkpoint[];

  constructor(pois: Poi[]) {
    this.checkpoints = pois
      .filter((poi: Poi) => poi.isCheckpoint)
      .map((poi: Poi, i: number) => {
        return new Checkpoint(poi, i);
      });
  }

  public get first(): Checkpoint {
    return this.checkpoints[0] || null;
  }

  public indexOf(checkpoint: Checkpoint): number {
    let pois  = this.checkpoints.map((point) => point.poi.id);
    let index = -1;

    if (checkpoint && checkpoint.poi && checkpoint.poi.id) {
      let id = checkpoint.poi.id;
      index = pois.indexOf(id);
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
