import { Component } from '@angular/core';
import { HikeSettingsComponent as BaseComponent } from '@bit/garlictech.angular-features.common.hike';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { faCog, faTachometerAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gtrack-hike-settings',
  templateUrl: './hike-settings.component.html',
  styleUrls: ['./hike-settings.component.scss']
})
export class HikeSettingsComponent extends BaseComponent {
  calendarIcon: IconDefinition;
  speedIcon: IconDefinition;
  settingsIcon: IconDefinition;

  constructor(store: Store<any>) {
    super(store);
    this.calendarIcon = faCalendarAlt;
    this.speedIcon = faTachometerAlt;
    this.settingsIcon = faCog;
  }
}
