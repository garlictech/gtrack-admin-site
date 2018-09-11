import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconService } from './services/icon';

import { MapService, CheckpointMarker, CurrentPositionMarker, Map } from './services/map';

import { MapMarkerService, MapMarker, MarkerPopupService } from './services/map-marker';

import { LocalizeModule } from '../localize';

@NgModule({
  imports: [CommonModule, LocalizeModule],
  providers: [MapService, MapMarkerService, IconService]
})
export class MapModule {}

export {
  MapService,
  MarkerPopupService,
  CheckpointMarker,
  CurrentPositionMarker,
  Map,
  MapMarker,
  MapMarkerService,
  IconService
};
