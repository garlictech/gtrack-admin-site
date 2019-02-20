import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { StorageModule } from '../storage';
import { ApiService } from './api.service';

@NgModule({
  imports: [HttpClientModule, StorageModule],
  providers: [ApiService]
})
export class ApiModule {}

export { ApiService };
