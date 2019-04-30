import { Component } from '@angular/core';

import { LocationSearchComponent as BaseComponent } from '@bit/garlictech.angular-features.common.search';

@Component({
  selector: 'gtrack-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent extends BaseComponent {}
