import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoordinatePipe, DifficultyPipe, DistancePipe, DurationPipe } from './pipes';

const PIPES = [CoordinatePipe, DifficultyPipe, DistancePipe, DurationPipe];

@NgModule({
  imports: [CommonModule],
  declarations: [...PIPES],
  exports: [...PIPES]
})
export class UtilsModule {}
