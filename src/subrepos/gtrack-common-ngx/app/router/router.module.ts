import { NgModule } from '@angular/core';
import { RouterModule as AngularRouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer } from '@ngrx/router-store';
import { CustomSerializer, Effects, RouterSelectors } from './store';

@NgModule({
  imports: [EffectsModule.forFeature([Effects]), AngularRouterModule],
  exports: [],
  providers: [
    RouterSelectors,
    {
      provide: RouterStateSerializer,
      useClass: CustomSerializer
    }
  ]
})
export class RouterModule {}
