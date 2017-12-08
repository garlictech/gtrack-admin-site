import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { ApiService } from './api.service';
import { StorageModule } from '../storage';

@NgModule({
  imports: [HttpModule, StorageModule],
  providers: [ApiService]
})
export class ApiModule {}

export { ApiService };
