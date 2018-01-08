import { Observable } from 'rxjs';

import { IHikeProgram, IHikeProgramData, IHikeDescription, IHikeProgramBackgroundImage, IHikeProgramStop } from './interfaces';
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
  public difficulty: string;
  public rate: string;
  public routeIcon: string;
  public elevationIcon: string;
  public routeId: string;
  public description: IHikeDescription;
  public backgroundImageUrls?: [IHikeProgramBackgroundImage];
  public offlineMap: string;
  public isRoundTrip: boolean;
  public pois: Poi[];
  public poiIds: string[];
  public stops: IHikeProgramStop[];
  public checkpoints: CheckpointSequence;

  private observable: Observable<HikeProgram>;

  private locale = 'en_US';

  constructor(data: IHikeProgramData, private _checkpointService: CheckpointService) {
    let converted = _.clone(data);
    delete converted.pois;
    Object.assign(this, converted);
    this.pois = [];
    this.poiIds = data.pois;

    this._calculatePhysicalValues();
    this._handleStartFinish();
    this.checkpoints = this._checkpointService.createSequence(this.stops);

    if (this.isRoundTrip === true && this.stops.length > 0) {
      this.stops.push(this.stops[0]);
    }
  }

  public get name(): string {
    return this.description[this.locale].name;
  }

  public get fullDescription(): string {
    return this.description[this.locale].full;
  }

  public get summary(): string {
    return this.description[this.locale].summary;
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
    let last  = this.stops[this.stops.length - 1] || null;

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
}
