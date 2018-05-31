import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconService } from './services/icon';

import { MapService, CheckpointMarker, CurrentPositionMarker, Map } from './services/map';

import { MapMarkerService, MapMarker } from './services/map-marker';

@NgModule({
  imports: [CommonModule],
  providers: [MapService, MapMarkerService, IconService]
})
export class MapModule {}

export { MapService, CheckpointMarker, CurrentPositionMarker, Map, MapMarker, MapMarkerService, IconService };
