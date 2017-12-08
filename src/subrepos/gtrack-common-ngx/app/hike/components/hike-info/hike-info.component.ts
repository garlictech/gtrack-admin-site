import { Component, Input } from '@angular/core';
import { IHike } from '../../services/hike';

@Component({
  selector: 'gtcn-hike-info',
  templateUrl: './hike-info.component.html',
  styleUrls: ['./hike-info.component.scss']
})
export class HikeInfoComponent {
  @Input()
  public hike: IHike;
}
