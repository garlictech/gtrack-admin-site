import { NgModule, ModuleWithProviders } from '@angular/core';

import { SettingsService } from './settings-service';

@NgModule({})
export class ApiServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ApiServicesModule,
      providers: [SettingsService]
    };
  }
}

export { SettingsService };
