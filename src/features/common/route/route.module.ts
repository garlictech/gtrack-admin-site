import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { routeReducer } from './store/reducer';
import { featureName } from './store/state';

@NgModule({
  imports: [StoreModule.forFeature(featureName, routeReducer)]
})
export class RouteComponentsModule {}
