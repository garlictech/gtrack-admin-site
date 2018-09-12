import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';

import { SearchResultsMapComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-search-results-map',
  templateUrl: './search-results-map.component.html',
  styleUrls: ['./search-results-map.component.scss']
})
export class SearchResultsMapComponent extends BaseComponent {}
