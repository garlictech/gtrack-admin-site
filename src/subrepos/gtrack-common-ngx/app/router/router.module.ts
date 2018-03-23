import { NgModule } from '@angular/core';
import { RouterStateSerializer } from '@ngrx/router-store';
import { CustomSerializer, RouterEffects, RouterSelectors } from './store';

@NgModule({
  imports: [],
  exports: [],
  providers: [
    RouterSelectors,
    RouterEffects,
    {
      provide: RouterStateSerializer,
      useClass: CustomSerializer
    }
  ],
})
export class RouterModule { }
