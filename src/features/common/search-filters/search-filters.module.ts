import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { getReducers, SEARCH_FILTERS_REDUCER_TOKEN, SearchFiltersSelectors } from './store';
import { featureName } from './store/state';

@NgModule({
  imports: [StoreModule.forFeature(featureName, SEARCH_FILTERS_REDUCER_TOKEN)],
  providers: [
    SearchFiltersSelectors,
    {
      provide: SEARCH_FILTERS_REDUCER_TOKEN,
      useFactory: getReducers
    }
  ]
})
export class SearchFiltersModule {}
