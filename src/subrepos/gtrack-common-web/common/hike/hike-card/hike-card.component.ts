import { HikeCardComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';

import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'gtrack-hike-card',
  templateUrl: './hike-card.component.html',
  styleUrls: ['./hike-card.component.scss']
})
export class HikeCardComponent extends BaseComponent {
  @HostBinding('class.card-shadow-default') hasDefaultClass: boolean;

  constructor() {
    super();
    this.hasDefaultClass = true;
  }
}
