import { NgModule, ModuleWithProviders } from '@angular/core';
import { LocationService } from './services';

import {
  UserStatusEffects,
  UserStatusSelectors
} from './store';

import { UserStatusModuleConfig } from './user-status-module-config';
import { EXTERNAL_USER_STATUS_DEPENDENCIES } from './externals';

@NgModule({
  imports: [],
  providers: [
    LocationService,
    UserStatusEffects,
    UserStatusSelectors
  ],
})
export class UserStatusModule {
  static forRoot(config: UserStatusModuleConfig): ModuleWithProviders {
    return {
      ngModule: UserStatusModule,
      providers: [
        {
          provide: EXTERNAL_USER_STATUS_DEPENDENCIES,
          useValue: {
            storeDomain: config.storeDomain
          }
        }
      ]
    };
  }
}
