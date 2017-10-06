import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ModuleWithProviders } from '@angular/core';

import { ApiService } from './api.service';
import { StorageModule } from '../storage';

@NgModule({
  imports: [HttpModule, StorageModule],
  providers: [ApiService]
})
export class ApiModule {}

export { ApiService };
