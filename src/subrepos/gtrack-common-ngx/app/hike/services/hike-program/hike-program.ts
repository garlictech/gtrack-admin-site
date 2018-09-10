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
    const converted = _.cloneDeep(data);
    Object.assign(this, converted);

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

  private _handleStartFinish() {
    const first = this.stops[0] || null;
    const last = this.stops[this.stops.length - 1] || null;

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
    const data: IHikeProgramStored = {
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
      checkpoints: this.checkpoints,
      state: this.state
    };

    return data;
  }
}
