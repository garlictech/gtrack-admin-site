import { ModuleWithProviders, NgModule } from '@angular/core';
import { EXTERNAL_SEARCH_FILTERS_DEPENDENCIES } from './externals';
import { SearchFiltersModuleConfig } from './search-filters-module-config';
import { SearchFiltersSelectors } from './store';

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
