import { HikeProgram } from './hike-program';
import { Poi } from '../poi';
import { CheckpointService } from '../checkpoint';

export class HikeProgramRoundtrip extends HikeProgram {
  public constructor(pois: Poi[], checkpointService: CheckpointService) {
    super(pois, checkpointService);
    this.createClosingPoi();
  }

  protected handleStartFinish() {
    let first = this.pois[0] || null;
    let last  = this.pois[0] || null;

    if (first) {
      first.isStart = true;
    }

    if (last) {
      last.isFinish = true;
    }
  }

  private createClosingPoi() {
    this.pois.push(this.pois[0]);
  }

};
