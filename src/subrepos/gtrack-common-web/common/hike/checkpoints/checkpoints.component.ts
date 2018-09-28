import { Component } from '@angular/core';

import { CheckpointsComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-checkpoints',
  templateUrl: './checkpoints.component.html',
  styleUrls: ['./checkpoints.component.scss']
})
export class CheckpointsComponent extends BaseComponent {}
