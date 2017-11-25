import { NgModule } from '@angular/core';
import { IconService } from './services/icon';

import {
  MapService,
  CheckpointMarker,
  CurrentPositionMarker,
  Map
} from './services/map';

import { MapMarkerService, MapMarker } from './services/map-marker';

import { LeafletComponent, Center } from './components/leaflet';

@NgModule({
  imports: [],
  exports: [
    LeafletComponent
  ],
  declarations: [
    LeafletComponent
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
  IconService
}
