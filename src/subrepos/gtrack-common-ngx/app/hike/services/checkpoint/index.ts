import { Injectable } from '@angular/core';

import { IHikeProgramStop } from '../hike-program';
import { CheckpointSequence } from './checkpoint-sequence';
import { Checkpoint } from './checkpoint';

@Injectable()
export class CheckpointService {
  public createSequence(stops: IHikeProgramStop[]): CheckpointSequence {
    return new CheckpointSequence(stops);
  }
}

export {
  CheckpointSequence,
  Checkpoint
}
