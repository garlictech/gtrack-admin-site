import { Component } from '@angular/core';

import { CheckpointsComponent as BaseComponent } from '@features/common/hike';

@Component({
  selector: 'gtrack-checkpoints',
  templateUrl: './checkpoints.component.html',
  styleUrls: ['./checkpoints.component.scss']
})
export class CheckpointsComponent extends BaseComponent {
  trackByFn(index: number): number {
    return index;
  }
}
