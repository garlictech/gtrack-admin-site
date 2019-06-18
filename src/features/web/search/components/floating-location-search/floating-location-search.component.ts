import { Component } from '@angular/core';
import { LocationSearchComponent } from '../location-search';

@Component({
  selector: 'gtrack-floating-location-search',
  templateUrl: './floating-location-search.component.html',
  styleUrls: ['./floating-location-search.component.scss']
})
export class FloatingLocationSearchComponent extends LocationSearchComponent {}
