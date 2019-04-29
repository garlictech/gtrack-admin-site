import { Component } from '@angular/core';
import { HikeDayComponent as BaseComponent } from '@features/common/hike';

@Component({
  selector: 'gtrack-hike-day',
  templateUrl: './hike-day.component.html'
})
export class HikeDayComponent extends BaseComponent {}
