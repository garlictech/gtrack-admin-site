import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconService } from './services/icon';

import { IconComponent } from './components/icon';

import {
  MapService,
  CheckpointMarker,
  CurrentPositionMarker,
  Map
} from './services/map';

import { MapMarkerService, MapMarker } from './services/map-marker';

import { LeafletComponent, Center } from './components/leaflet';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    LeafletComponent,
    IconComponent
  ],
  declarations: [
    LeafletComponent,
    IconComponent
  ],
  providers: [
    MapService,
    MapMarkerService,
    IconService
  ],
})
export class MapModule { }

export {
  MapService,
  CheckpointMarker,
  CurrentPositionMarker,
  Map,
  LeafletComponent,
  Center,
  MapMarker,
  MapMarkerService,
  IconService,
  IconComponent
}
