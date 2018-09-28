import { NgModule, ModuleWithProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { ObjectMarkService } from './services';
import { DeepstreamModule } from '../deepstream';
import { ObjectMarkSelectors, ObjectMarkEffects } from './store';
import { EXTERNAL_OBJECT_MARK_DEPENDENCIES } from './externals';
import { IObjectMarkModuleConfig } from './config';

@NgModule({
  imports: [DeepstreamModule, EffectsModule.forFeature([ObjectMarkEffects])],
  exports: [],
  declarations: [],
  providers: [ObjectMarkService, ObjectMarkEffects, ObjectMarkSelectors]
})
export class ObjectMarkModule {
  static forRoot(config: IObjectMarkModuleConfig): ModuleWithProviders {
    return {
      ngModule: ObjectMarkModule,
      providers: [
        {
          provide: EXTERNAL_OBJECT_MARK_DEPENDENCIES,
          useValue: {
            storeDomain: config.storeDomain
          }
        }
      ]
    };
  }
}
