import { Component, Input } from '@angular/core';
import { IHikeProgram } from '../../../../../provider-client';
import { faArrowRight, faSortUp, faSortDown, faClock, faTrophy } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'gtcn-hike-info',
  template: ''
})
export class HikeInfoComponent {
  @Input() public hikeProgram: IHikeProgram;
  faArrowRight = faArrowRight;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faClock = faClock;
  faTrophy = faTrophy;
}
