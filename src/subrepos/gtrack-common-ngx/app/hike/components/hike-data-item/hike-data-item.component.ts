import { Component, Input } from '@angular/core';
import { IHikeProgram } from '../../../../../provider-client';
import { faArrowRight, faSortUp, faSortDown, faClock, faTrophy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'gtcn-hike-data-item',
  template: ''
})
export class HikeDataItemComponent {
  @Input() public hikeProgram: IHikeProgram;
  faArrowRight = faArrowRight;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faClock = faClock;
  faTrophy = faTrophy;
}
