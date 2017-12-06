import { Component, Input } from '@angular/core';
import { IHike } from '../../services/hike';

@Component({
  selector: 'gtcn-hike-program',
  templateUrl: './hike-program.component.html',
  styleUrls: ['./hike-program.component.scss']
})
export class HikeProgramComponent {
  @Input()
  public hike: IHike;
}
