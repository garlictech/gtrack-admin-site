import { NgModule } from '@angular/core';
import { RouterStateSerializer } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { CustomSerializer, Effects, RouterSelectors } from './store';

@NgModule({
  imports: [EffectsModule.forFeature([Effects])],
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
