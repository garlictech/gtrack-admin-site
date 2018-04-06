import { NgModule, ModuleWithProviders } from '@angular/core';
import { DeepstreamModule } from '../deepstream';
import { GeoSearchService } from './services/geosearch.service';
import { GeoSearchSelectors } from './store/selectors';
import { GeoSearchEffects } from './store/effects';

import { EXTERNAL_GEO_SEARCH_DEPENDENCIES } from './externals';
import { GeoSearchModuleConfig } from './geosearch-module-config';

@NgModule({
  imports: [DeepstreamModule],
  providers: [GeoSearchService, GeoSearchSelectors, GeoSearchEffects]
})
export class GeoSearchModule {
  static forRoot(config: GeoSearchModuleConfig): ModuleWithProviders {
    return {
      ngModule: GeoSearchModule,
      providers: [
        {
          provide: EXTERNAL_GEO_SEARCH_DEPENDENCIES,
          useValue: {
            storeDomain: config.storeDomain
          }
        }
      ]
    };
  }
}
