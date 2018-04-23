import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule } from 'subrepos/forms-ngx';
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
  HikeEditPoisHikeComponent,
  HikeEditPoisHikeTableComponent,
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
import { SharedComponentsModule } from 'app/shared/components';
import { LanguageModule } from 'app/language';

const COMPONENTS = [
  HikeEditComponent,
  HikeEditGeneralInfoComponent,
  HikeEditMapComponent,
  HikeEditRoutePlannerComponent,
  HikeEditPoisComponent,
  HikeEditPoisGTrackComponent,
  HikeEditPoisGTrackTableComponent,
  HikeEditPoisHikeComponent,
  HikeEditPoisHikeTableComponent,
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
    FormModule,
    ReactiveFormsModule,
    MapModule,
    HikeModule,
    SharedModule,
    TagInputModule,
    SharedComponentsModule,
    LanguageModule
  ],
  exports: [...COMPONENTS],
  declarations: [AdminLeafletComponent, ObjectToArrayPipe, ...COMPONENTS],
  entryComponents: [...COMPONENTS],
  providers: [DynamicModalService]
})
export class HikeEditModule {}
