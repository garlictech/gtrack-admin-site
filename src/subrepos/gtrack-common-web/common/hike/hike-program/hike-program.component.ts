import { Component } from '@angular/core';

import { HikeProgramComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-hike-program',
  templateUrl: './hike-program.component.html',
  styleUrls: ['./hike-program.component.scss']
})
export class HikeProgramComponent extends BaseComponent {
  trackByFn(index: number): number {
    return index;
  }
}
