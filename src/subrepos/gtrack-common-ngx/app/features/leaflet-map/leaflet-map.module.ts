import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureName } from './store/state';
import { reducer } from './store/reducer';
import { LeafletMapComponent } from './components/leaflet-map';

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
  ]
})
export class LeafletMapModule {}
