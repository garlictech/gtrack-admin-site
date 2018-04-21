import { Observable } from 'rxjs';

import {
  IHikeProgram,
  ILocalizedItem,
  ITextualDescription,
  IHikeProgramBackgroundImage,
  IHikeProgramStop
} from 'subrepos/provider-client';
import { CheckpointSequence, CheckpointService } from '../checkpoint';
import { Poi } from '../poi';
import * as _ from 'lodash';

export class HikeProgram implements IHikeProgram {
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
  public backgroundImageUrls?: [IHikeProgramBackgroundImage];
  public offlineMap?: string;
  public isRoundTrip: boolean;
  public pois: string[];
  public stops: IHikeProgramStop[];
  public checkpoints: CheckpointSequence;

  private observable: Observable<HikeProgram>;

  private locale = 'en_US';

  constructor(data: IHikeProgram, private _checkpointService: CheckpointService) {
    let converted = _.cloneDeep(data);
    Object.assign(this, converted);

    this._calculatePhysicalValues();
    this._handleStartFinish();
    this.checkpoints = this._checkpointService.createSequence(this.stops);

    if (this.isRoundTrip === true && this.stops.length > 0) {
      this.stops.push(this.stops[0]);
    }
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

    if (this.isRoundTrip === true) {
      last = first;
    }

    if (first) {
      first.isStart = true;
    }

    if (last) {
      last.isFinish = true;
    }
  }

  public toObject(): IHikeProgram {
    let data: IHikeProgram = {
      distance: this.distance,
      isRoundTrip: this.isRoundTrip,
      uphill: this.uphill,
      downhill: this.downhill,
      time: this.time,
      score: this.score,
      location: this.location,
      difficulty: this.difficulty,
      backgroundImageUrls: this.backgroundImageUrls,
      rate: this.rate,
      routeIcon: this.routeIcon,
      elevationIcon: this.elevationIcon,
      routeId: this.routeId,
      description: this.description,
      offlineMap: this.offlineMap,
      pois: this.pois,
      stops: this.stops
    };

    return data;
  }
}
