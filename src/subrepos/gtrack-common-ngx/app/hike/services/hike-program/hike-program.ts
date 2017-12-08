import { Poi } from '../poi';
import { CheckpointService, CheckpointSequence } from '../checkpoint';

export class HikeProgram {
  public uphill: number;
  public downhill: number;
  public time: number;
  public score: number;
  public isRoundTrip = false;
  public checkpoints: CheckpointSequence;

  constructor(
    public pois: Poi[],
    private checkpointService: CheckpointService
  ) {}

  public init() {
    this.calculatePhysicalValues();
    this.handleStartFinish();
    this.checkpoints = this.checkpointService.createSequence(this.pois);
  }

  public get fullDistance(): number {
    let last: Poi = this.pois[this.pois.length - 1];
    let distance = 0;

    if (last) {
      distance = last.distanceFromOrigo;
    }

    return distance;
  }

  protected calculatePhysicalValues() {
    let lastIndex = this.pois.length - 1;
    this.pois[0].distanceFromOrigo = 0;
    this.uphill = 0;
    this.downhill = 0;
    this.time = 0;
    this.score = 0;

    this.pois.forEach((poi: Poi, index: number) => {
      let previous: Poi = this.pois[index - 1] || null;

      if (index !== lastIndex) {
        this.uphill += poi.segment.uphill || 0;
        this.downhill += poi.segment.downhill || 0;
        this.time += poi.segment.time || 0;
        this.score += poi.segment.score || 0;
      }

      if (previous) {
        poi.distanceFromOrigo = previous.distanceFromOrigo + previous.segment.distance;
      }
    });
  }

  protected handleStartFinish() {
    let first = this.pois[0] || null;
    let last  = this.pois[this.pois.length - 1] || null;

    if (first) {
      first.isStart = true;
    }

    if (last) {
      last.isFinish = true;
    }
  }

}
