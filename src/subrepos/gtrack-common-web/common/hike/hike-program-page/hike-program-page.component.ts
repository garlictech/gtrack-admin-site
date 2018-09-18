import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { HikeProgram } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-hike-program-page',
  templateUrl: './hike-program-page.component.html',
  styleUrls: ['./hike-program-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HikeProgramPageComponent {
  @Input()
  public hikeProgram: HikeProgram;
}
