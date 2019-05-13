import { ModuleWithProviders, NgModule } from '@angular/core';
import { DeepstreamModule } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { EffectsModule } from '@ngrx/effects';

import { ObjectMarkModuleConfig } from './config';
import { EXTERNAL_OBJECT_MARK_DEPENDENCIES } from './externals';
import { ObjectMarkService } from './services';
import { ObjectMarkEffects, ObjectMarkSelectors } from './store';

@NgModule({
  imports: [DeepstreamModule, EffectsModule.forFeature([ObjectMarkEffects])],
  exports: [],
  declarations: [],
  providers: [ObjectMarkService, ObjectMarkEffects, ObjectMarkSelectors]
})
export class ObjectMarkModule {
  static forRoot(config: ObjectMarkModuleConfig): ModuleWithProviders {
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
