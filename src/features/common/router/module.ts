import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { CustomSerializer, Effects } from './store';
import { featureName } from './store/state';

@NgModule({
  imports: [
    EffectsModule.forFeature([Effects]),
    StoreModule.forFeature(featureName, routerReducer),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
      stateKey: featureName
    })
  ],
  exports: []
})
export class RouterModule {}
