import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { GeoSearchService } from './services/geosearch.service';
import { GeoSearchEffects } from './store/effects';
import { geoSearchReducer } from './store/reducer';
import { GeoSearchSelectors } from './store/selectors';
import { featureName } from './store/state';

@NgModule({
  providers: [GeoSearchService, GeoSearchSelectors, GeoSearchEffects],
  imports: [EffectsModule.forFeature([GeoSearchEffects]), StoreModule.forFeature(featureName, geoSearchReducer)]
})
export class GeoSearchModule {}
