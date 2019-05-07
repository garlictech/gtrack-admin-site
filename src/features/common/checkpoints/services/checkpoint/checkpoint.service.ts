import { Injectable } from '@angular/core';
import { HikeProgramStop } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { Checkpoint } from '../../lib/checkpoint';
import { CheckpointSequence } from '../../lib/checkpoint-sequence';

@Injectable({
  providedIn: 'root'
})
export class CheckpointService {
  createSequence(stops: Array<HikeProgramStop>): CheckpointSequence {
    return new CheckpointSequence(stops);
  }
}

export { CheckpointSequence, Checkpoint };
