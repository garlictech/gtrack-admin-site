import { LocationSearchComponent as BaseComponent } from '../location-search';

import { Component } from '@angular/core';
@Component({
  selector: 'gtrack-fixed-location-search',
  templateUrl: './fixed-location-search.component.html',
  styleUrls: ['./fixed-location-search.component.scss']
})
export class FixedLocationSearchComponent extends BaseComponent {}
