import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CheckpointService } from './services';

@NgModule({
  imports: [CommonModule],
  providers: [CheckpointService]
})
export class CheckpointsModule {}
