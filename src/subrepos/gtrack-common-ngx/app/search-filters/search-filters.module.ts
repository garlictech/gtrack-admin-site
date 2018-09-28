import { NgModule, ModuleWithProviders } from '@angular/core';
import { SearchFiltersModuleConfig } from './search-filters-module-config';
import { SearchFiltersSelectors } from './store';
import { EXTERNAL_SEARCH_FILTERS_DEPENDENCIES } from './externals';

@NgModule({
  imports: [],
  providers: [SearchFiltersSelectors]
})
export class SearchFiltersModule {
  static forRoot(config: SearchFiltersModuleConfig): ModuleWithProviders {
    return {
      ngModule: SearchFiltersModule,
      providers: [
        {
          provide: EXTERNAL_SEARCH_FILTERS_DEPENDENCIES,
          useValue: {
            storeDomain: config.storeDomain
          }
        }
      ]
    };
  }
}
