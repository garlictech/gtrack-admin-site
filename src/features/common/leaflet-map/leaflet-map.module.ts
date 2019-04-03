import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnerModule } from '@bit/garlictech.angular-features.web.spinner/spinner.module';
import { StoreModule } from '@ngrx/store';
import { LeafletMapComponent } from './components/leaflet-map';
import { reducer } from './store/reducer';
import { featureName } from './store/state';
@NgModule({
  imports: [CommonModule, StoreModule.forFeature(featureName, reducer), SpinnerModule],
  declarations: [LeafletMapComponent],
  exports: [LeafletMapComponent]
})
export class LeafletMapModule {}
