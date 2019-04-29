import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoiMapComponent, PoiPageComponent } from './components';

const COMPONENTS = [PoiPageComponent, PoiMapComponent];

@NgModule({
  imports: [CommonModule],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class PoiComponentsModule {}
