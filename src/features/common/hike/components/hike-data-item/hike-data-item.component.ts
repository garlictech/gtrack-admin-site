import { Component, Input } from '@angular/core';
import { HikeProgramData } from '@features/common/gtrack-interfaces';
import {
  faArrowRight,
  faClock,
  faSortDown,
  faSortUp,
  faTrophy,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'gtrack-common-hike-data-item',
  template: ''
})
export class HikeDataItemComponent {
  @Input() hikeProgram: HikeProgramData;
  faArrowRight: IconDefinition;
  faSortUp: IconDefinition;
  faSortDown: IconDefinition;
  faClock: IconDefinition;
  faTrophy: IconDefinition;

  constructor() {
    this.faArrowRight = faArrowRight;
    this.faSortUp = faSortUp;
    this.faSortDown = faSortDown;
    this.faClock = faClock;
    this.faTrophy = faTrophy;
  }
}
