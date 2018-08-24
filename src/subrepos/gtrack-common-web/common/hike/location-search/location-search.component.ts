import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';

import { LocationSearchComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent extends BaseComponent {

}
