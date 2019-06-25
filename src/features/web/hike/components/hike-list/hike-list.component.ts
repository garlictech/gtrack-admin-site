import { Component } from '@angular/core';
import { HikeListComponent as BaseComponent } from '@bit/garlictech.angular-features.common.hike';
import { faBars, faMapMarkedAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gtrack-hike-list',
  templateUrl: './hike-list.component.html',
  styleUrls: ['./hike-list.component.scss']
})
export class HikeListComponent extends BaseComponent {
  listIcon: IconDefinition;
  mapIcon: IconDefinition;

  constructor(store: Store<any>) {
    super(store);
    this.listIcon = faBars;
    this.mapIcon = faMapMarkedAlt;
  }
}
