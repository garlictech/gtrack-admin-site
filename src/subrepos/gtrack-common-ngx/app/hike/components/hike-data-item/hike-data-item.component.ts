import { Component, Input } from '@angular/core';
import { IHikeProgram } from '../../services/hike-program';

@Component({
  selector: 'gtcn-hike-data-item',
  templateUrl: './hike-data-item.component.html',
  styleUrls: ['./hike-data-item.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HikeDataItemComponent {
  @Input()
  public hikeProgram: IHikeProgram;
}
