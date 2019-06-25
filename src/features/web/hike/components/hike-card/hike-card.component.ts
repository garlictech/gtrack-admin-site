import { HikeCardComponent as BaseComponent } from '@bit/garlictech.angular-features.common.hike';

import { Component, HostBinding, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'gtrack-hike-card',
  templateUrl: './hike-card.component.html',
  styleUrls: ['./hike-card.component.scss']
})
export class HikeCardComponent extends BaseComponent implements OnChanges {
  @HostBinding('class.card-shadow-default') hasDefaultClass: boolean;

  @Input() gtrackCardShadow: string;

  constructor() {
    super();

    this.hasDefaultClass = false;

    if (!this.gtrackCardShadow) {
      this.hasDefaultClass = true;
    }
  }

  ngOnChanges(): void {
    this.hasDefaultClass = false;
    if (!this.gtrackCardShadow) {
      this.hasDefaultClass = true;
    }
  }
}
