import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { RouteEffects, RouteSelectors } from './store';
import { routeReducer } from './store/reducer';
import { featureName } from './store/state';

@NgModule({
  imports: [StoreModule.forFeature(featureName, routeReducer), EffectsModule.forFeature([RouteEffects])],
  providers: [RouteSelectors]
})
export class RouteComponentsModule {}
