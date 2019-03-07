import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { GeoSearchService } from './services/geosearch.service';
import { GeoSearchEffects } from './store/effects';
import { GeoSearchSelectors } from './store/selectors';

import { EXTERNAL_GEO_SEARCH_DEPENDENCIES } from './externals';
import { GeoSearchModuleConfig } from './geosearch-module-config';

@NgModule({
  providers: [GeoSearchService, GeoSearchSelectors, GeoSearchEffects],
  imports: [EffectsModule.forFeature([GeoSearchEffects])]
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
