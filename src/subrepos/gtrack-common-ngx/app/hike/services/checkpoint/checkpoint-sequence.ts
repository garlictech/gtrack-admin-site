import { HikeProgramStop } from '@features/common/gtrack-interfaces';
import { Checkpoint } from './checkpoint';

export class CheckpointSequence {
  checkpoints: Array<Checkpoint>;

  constructor(stops: Array<HikeProgramStop>) {
    this.checkpoints = stops
      // .filter(stop => stop.isCheckpoint)
      .map((stop, i) => new Checkpoint(stop, i));
  }

  get first(): Checkpoint {
    return this.checkpoints[0] || undefined;
  }

  indexOf(checkpoint: Checkpoint): number {
    const stops = this.checkpoints.map(point => point.stop.poiId);
    let index = -1;

    if (checkpoint && checkpoint.stop && checkpoint.stop.poiId) {
      const id = checkpoint.stop.poiId;
      index = stops.indexOf(id);
    }

    return index;
  }

  getNextCheckpoint(checkpoint: Checkpoint): Checkpoint | null {
    const index = this.indexOf(checkpoint);
    let nextCheckpoint: Checkpoint | null;

    if (index > -1) {
      const next = index + 1;

      if (next < this.checkpoints.length) {
        nextCheckpoint = this.checkpoints[next];
      }
    }

    return nextCheckpoint;
  }

  isLast(checkpoint: Checkpoint): boolean {
    const index = this.indexOf(checkpoint);

    return index > -1 && index === this.checkpoints.length - 1;
  }
}
