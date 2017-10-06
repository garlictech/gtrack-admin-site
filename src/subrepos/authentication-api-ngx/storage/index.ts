import { NgModule } from '@angular/core';

import { LocalStorage } from './local-storage.service';
import { SessionStorage } from './session-storage.service';
import { Storage } from './storage.interface';

@NgModule({
  imports: [],
  exports: [],
  providers: [LocalStorage]
})
export class StorageModule {}

export { LocalStorage, SessionStorage, Storage };
