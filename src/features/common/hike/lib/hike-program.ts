import _cloneDeep from 'lodash-es/cloneDeep';

import { CheckpointSequence } from '@features/common/checkpoints/lib/checkpoint-sequence';
import { CheckpointService } from '@features/common/checkpoints/services/checkpoint/checkpoint.service';
import {
  BackgroundImageData,
  EObjectState,
  HikeProgramStop,
  HikeProgramStored,
  LocalizedItem,
  TextualDescription
} from '@features/common/gtrack-interfaces';

export class HikeProgram implements HikeProgramStored {
  get title(): string {
    return this.description[this.locale].title;
  }

  get fullDescription(): string {
    return this.description[this.locale].fullDescription || '';
  }

  get summary(): string {
    return this.description[this.locale].summary || '';
  }
  id: string;
  distance: number;
  uphill: number;
  downhill: number;
  time: number;
  reverseTime: number;
  score: number;
  reverseScore: number;
  location: string;
  difficulty: number;
  rate?: string;
  routeIcon: string;
  elevationIcon: string;
  routeId: string;
  description: LocalizedItem<TextualDescription>;
  teaser: LocalizedItem<TextualDescription>;
  backgroundImages?: Array<BackgroundImageData>;
  offlineMap?: string;
  isRoundTrip: boolean;
  timestamp: number;
  feature: boolean;
  stops: Array<HikeProgramStop>;
  reverseStops: Array<HikeProgramStop>;
  checkpoints: CheckpointSequence;
  state: EObjectState;
  reversed: boolean;

  private readonly locale: string;

  constructor(data: HikeProgramStored, private readonly _checkpointService: CheckpointService) {
    const converted = _cloneDeep(data);
    Object.assign(this, converted);

    this._handleStartFinish();
    this.checkpoints = this._checkpointService.createSequence(this.stops);

    this.reversed = false;
    this.locale = 'en_US';
  }

  toObject(): HikeProgramStored {
    return {
      id: this.id,
      distance: this.distance,
      isRoundTrip: this.isRoundTrip,
      uphill: this.uphill,
      downhill: this.downhill,
      time: this.time,
      reverseTime: this.reverseTime,
      score: this.score,
      reverseScore: this.reverseScore,
      location: this.location,
      difficulty: this.difficulty,
      backgroundImages: this.backgroundImages,
      rate: this.rate,
      routeIcon: this.routeIcon,
      elevationIcon: this.elevationIcon,
      routeId: this.routeId,
      description: this.description,
      teaser: this.teaser,
      offlineMap: this.offlineMap,
      timestamp: this.timestamp,
      stops: this.stops,
      reverseStops: this.reverseStops,
      // checkpoints: this.checkpoints,
      state: this.state,
      feature: this.feature
    };
  }

  private _handleStartFinish(): void {
    const first = this.stops[0] || undefined;
    const last = this.stops[this.stops.length - 1] || undefined;

    first.poiId = 'endpoint-first';
    last.poiId = 'endpoint-last';

    if (first) {
      first.isStart = true;

      if (this.isRoundTrip) {
        first.isFinish = true;
      }
    }

    if (last) {
      last.isFinish = true;

      if (this.isRoundTrip) {
        last.isStart = true;
      }
    }
  }
}
