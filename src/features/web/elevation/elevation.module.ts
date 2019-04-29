import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ElevationProfileComponent } from './components/elevation-profile/elevation-profile.component';

const COMPONENTS = [ElevationProfileComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class ElevationModule {}
