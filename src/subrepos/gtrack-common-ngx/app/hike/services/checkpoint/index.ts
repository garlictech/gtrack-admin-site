import { Injectable } from '@angular/core';
import { HikeProgramStop } from '@features/common/gtrack-interfaces';
import { Checkpoint } from './checkpoint';
import { CheckpointSequence } from './checkpoint-sequence';

@Injectable()
export class CheckpointService {
  createSequence(stops: Array<HikeProgramStop>): CheckpointSequence {
    return new CheckpointSequence(stops);
  }
}

export { CheckpointSequence, Checkpoint };
