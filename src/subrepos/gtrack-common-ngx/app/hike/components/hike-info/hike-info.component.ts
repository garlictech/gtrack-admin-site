import { Component, Input } from '@angular/core';
import { IHikeProgram } from '../../services/hike-program';

@Component({
  selector: 'gtcn-hike-info',
  templateUrl: './hike-info.component.html',
  styleUrls: ['./hike-info.component.scss']
})
export class HikeInfoComponent {
  @Input()
  public hikeProgram: IHikeProgram;
}
