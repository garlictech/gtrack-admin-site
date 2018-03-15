import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Pipes
import { ObjectToArrayPipe } from 'app/shared/pipes';
// Modules
import { DynamicModalService } from 'subrepos/gtrack-common-ngx';
// Components
import { HikeEditComponent } from './hike-edit.component';
import {
  HikeEditGeneralInfoComponent,
  HikeEditMapComponent,
  HikeEditRoutePlannerComponent,
  HikeEditPoisComponent,
  HikeEditPoisGTrackComponent,
  HikeEditPoisGTrackTableComponent,
  HikeEditPoisExternalComponent,
  HikeEditPoisExternalTableComponent,
  PoiIconsComponent,
  SpecialPoiDataComponent,
  // Modals
  HikeEditExternalPoiInfoComponent,
  HikeEditGTrackPoiInfoComponent
} from './components';
// Shared components
import { AdminLeafletComponent } from 'app/shared/components/admin-leaflet';
// gTrack common
import { MapModule, HikeModule, SharedModule } from 'subrepos/gtrack-common-ngx';
// Lib
import { TagInputModule } from 'ngx-chips';

const COMPONENTS = [
  HikeEditComponent,
  HikeEditGeneralInfoComponent,
  HikeEditMapComponent,
  HikeEditRoutePlannerComponent,
  HikeEditPoisComponent,
  HikeEditPoisGTrackComponent,
  HikeEditPoisGTrackTableComponent,
  HikeEditPoisExternalComponent,
  HikeEditPoisExternalTableComponent,
  PoiIconsComponent,
  SpecialPoiDataComponent,
  // Modals
  HikeEditExternalPoiInfoComponent,
  HikeEditGTrackPoiInfoComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MapModule,
    HikeModule,
    SharedModule,
    // Lib
    TagInputModule
  ],
  exports: [
    ...COMPONENTS
  ],
  declarations: [
    AdminLeafletComponent,
    ObjectToArrayPipe,
    ...COMPONENTS
  ],
  entryComponents: [
    ...COMPONENTS
  ],
  providers: [
    DynamicModalService
  ]
})
export class HikeEditModule {}
