import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureName } from './store/state';
import { reducer } from './store/reducer';
import { LeafletMapComponent } from './components/leaflet-map';
import { LeafletMapService } from './services/leaflet-map.service';
import { LeafletMarkerPopupService } from './services/leaflet-marker-popup.service';
import { LeafletIconService } from './services/leaflet-icon.service';
import { LeafletMapMarkerService } from './services/leaflet-map-marker.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(featureName, reducer)
  ],
  declarations: [
    LeafletMapComponent
  ],
  exports: [
    LeafletMapComponent
  ],
  providers: [
    LeafletMapService,
    LeafletMarkerPopupService,
    LeafletIconService,
    LeafletMapMarkerService
  ]
})
export class LeafletMapModule {}
