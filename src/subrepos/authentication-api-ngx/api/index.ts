import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ApiService } from './api.service';
import { StorageModule } from '../storage';

@NgModule({
  imports: [HttpClientModule, StorageModule],
  providers: [ApiService]
})
export class ApiModule {}

export { ApiService };
