import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { GeoSearchService } from './services/geosearch.service';
import { GEO_SEARCH_REDUCER_TOKEN, getReducers } from './store';
import { GeoSearchEffects } from './store/effects';
import { GeoSearchSelectors } from './store/selectors';
import { featureName } from './store/state';

@NgModule({
  providers: [
    GeoSearchService,
    GeoSearchSelectors,
    GeoSearchEffects,
    {
      provide: GEO_SEARCH_REDUCER_TOKEN,
      useFactory: getReducers
    }
  ],
  imports: [EffectsModule.forFeature([GeoSearchEffects]), StoreModule.forFeature(featureName, GEO_SEARCH_REDUCER_TOKEN)]
})
export class GeoSearchModule {}
