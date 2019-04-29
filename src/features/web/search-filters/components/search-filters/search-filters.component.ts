import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SearchFiltersSelectors } from '@bit/garlictech.angular-features.common.search-filters';
import { SearchFiltersComponent as BaseComponent } from '@features/common/search-filters';
import { faSlidersH, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gtrack-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent extends BaseComponent {
  icon: IconDefinition;
  closeIcon: IconDefinition;

  constructor(
    readonly fb: FormBuilder,
    readonly store: Store<any>,
    readonly searchFiltersSelectors: SearchFiltersSelectors
  ) {
    super(fb, store, searchFiltersSelectors);
    this.icon = faSlidersH;
    this.closeIcon = faTimes;
  }
}
