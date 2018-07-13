import { Observable } from 'rxjs';

import {
  IHikeProgramStored,
  ILocalizedItem,
  ITextualDescription,
  IHikeProgramStop,
  EObjectState,
  IBackgroundImageData
} from '../../../../../provider-client';

import { CheckpointSequence, CheckpointService } from '../checkpoint';
import { Poi } from '../poi';
import * as _ from 'lodash';

export class HikeProgram implements IHikeProgramStored {
  public id: string;
  public distance: number;
  public uphill: number;
  public downhill: number;
  public time: number;
  public score: number;
  public location: string;
  public difficulty: number;
  public rate?: string;
  public routeIcon: string;
  public elevationIcon: string;
  public routeId: string;
  public description: ILocalizedItem<ITextualDescription>;
  public backgroundImages?: IBackgroundImageData[];
  public offlineMap?: string;
  public isRoundTrip: boolean;
  public timestamp: number;
  public stops: IHikeProgramStop[];
  public checkpoints: CheckpointSequence;
  public state: EObjectState;
  private observable: Observable<HikeProgram>;

  private locale = 'en_US';

  constructor(data: IHikeProgramStored, private _checkpointService: CheckpointService) {
    let converted = _.cloneDeep(data);
    Object.assign(this, converted);

    this._calculatePhysicalValues();
    this._handleStartFinish();
    this.checkpoints = this._checkpointService.createSequence(this.stops);
  }

  public get title(): string {
    return this.description[this.locale].title;
  }

  public get fullDescription(): string {
    return this.description[this.locale].fullDescription || '';
  }

  public get summary(): string {
    return this.description[this.locale].summary || '';
  }

  private _calculatePhysicalValues() {
    this.uphill = 0;
    this.downhill = 0;
    this.time = 0;
    this.score = 0;

    if (this.stops instanceof Array) {
      let lastIndex = this.stops.length - 1;

      this.stops.forEach((stop, index) => {
        if (index !== lastIndex) {
          this.uphill += stop.segment.uphill || 0;
          this.downhill += stop.segment.downhill || 0;
          this.time += stop.segment.time || 0;
          this.score += stop.segment.score || 0;
        }
      });
    }
  }

  private _handleStartFinish() {
    let first = this.stops[0] || null;
    let last = this.stops[this.stops.length - 1] || null;

    first.poiId = 'endpoint-first';
    last.poiId = 'endpoint-last';

    if (first) {
      first.isStart = true;

      if (this.isRoundTrip === true) {
        first.isFinish = true;
      }
    }

    if (last) {
      last.isFinish = true;

      if (this.isRoundTrip === true) {
        last.isStart = true;
      }
    }
  }

  public toObject(): IHikeProgramStored {
    let data: IHikeProgramStored = {
      id: this.id,
      distance: this.distance,
      isRoundTrip: this.isRoundTrip,
      uphill: this.uphill,
      downhill: this.downhill,
      time: this.time,
      score: this.score,
      location: this.location,
      difficulty: this.difficulty,
      backgroundImages: this.backgroundImages,
      rate: this.rate,
      routeIcon: this.routeIcon,
      elevationIcon: this.elevationIcon,
      routeId: this.routeId,
      description: this.description,
      offlineMap: this.offlineMap,
      timestamp: this.timestamp,
      stops: this.stops,
      state: this.state
    };

    return data;
  }
}
