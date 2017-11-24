import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Pipes
import { ObjectToArrayPipe } from '../../shared/pipes';
// Components
import { HikeEditComponent } from './hike-edit.component';
import {
  HikeEditGeneralInfoComponent,
  HikeEditMapComponent,
  HikeEditRoutePlanningComponent,
  HikeEditPoisComponent,
  HikeEditPoisGTrackComponent,
  HikeEditPoisExternalComponent,
  HikeEditPoisExternalTableComponent,
  PoiIconsComponent,
  SpecialPoiDataComponent
} from './components';
// Shared components
import { AdminLeafletComponent } from '../../shared/components/admin-leaflet';
// gTrack common
import { CommonModule as GtCommonModule } from '../../../subrepos/gtrack-common-ngx';

const COMPONENTS = [
  HikeEditComponent,
  HikeEditGeneralInfoComponent,
  HikeEditMapComponent,
  HikeEditRoutePlanningComponent,
  HikeEditPoisComponent,
  HikeEditPoisGTrackComponent,
  HikeEditPoisExternalComponent,
  HikeEditPoisExternalTableComponent,
  PoiIconsComponent,
  SpecialPoiDataComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    GtCommonModule
  ],
  exports: [
    ...COMPONENTS
  ],
  declarations: [
    AdminLeafletComponent,
    ObjectToArrayPipe,
    ...COMPONENTS
  ],
  entryComponents: [...COMPONENTS]
})
export class HikeEditModule {}
