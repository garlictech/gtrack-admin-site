import { Injectable } from '@angular/core';

import { Poi } from '../poi';
import { CheckpointSequence } from './checkpoint-sequence';
import { Checkpoint } from './checkpoint';

@Injectable()
export class CheckpointService {
  public createSequence(pois: Poi[]): CheckpointSequence {
    return new CheckpointSequence(pois);
  }
}

export {
  CheckpointSequence,
  Checkpoint
}
