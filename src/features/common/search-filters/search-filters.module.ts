import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SearchFiltersSelectors } from './store';
import { searchFiltersReducer } from './store/reducer';
import { featureName } from './store/state';

@NgModule({
  imports: [StoreModule.forFeature(featureName, searchFiltersReducer)],
  providers: [SearchFiltersSelectors]
})
export class SearchFiltersModule {}
