import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { getReducers, ROUTE_REDUCER_TOKEN, RouteEffects, RouteSelectors } from './store';
import { featureName } from './store/state';

@NgModule({
  imports: [StoreModule.forFeature(featureName, ROUTE_REDUCER_TOKEN), EffectsModule.forFeature([RouteEffects])],
  providers: [
    RouteSelectors,
    {
      provide: ROUTE_REDUCER_TOKEN,
      useFactory: getReducers
    }
  ]
})
export class RouteComponentsModule {}
