import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule } from 'app/forms';
// Pipes
import { ObjectToArrayPipe } from 'app/shared/pipes';
import { TrustedHtmlPipe } from 'app/shared/pipes';
// Modules
import { DynamicModalService } from 'subrepos/gtrack-common-ngx';
// PrimeNG
import { ButtonModule, CardModule, SelectButtonModule, AccordionModule, CheckboxModule, DialogModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
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
  HikeEditOutlineComponent,
  HikeEditPhotosComponent,
  HikeEditPhotosTableComponent,
  PoiIconsComponent,
  SpecialPoiDataComponent,
  BackgroundImagesComponent,
  // Modals
  HikeEditExternalPoiInfoComponent,
  HikeEditGTrackPoiInfoComponent,
  HikeEditMergeGTrackPoiComponent
} from './components';
// Shared components
import { PoiMergeService } from '../../shared/services';
// gTrack common
import { MapModule, HikeModule, SharedModule } from 'subrepos/gtrack-common-ngx';
import { GeospatialService } from 'subrepos/gtrack-common-ngx/app/shared/services/geospatial';
// Lib
import { TagInputModule } from 'ngx-chips';
import { SharedComponentsModule, TableSpinnerComponent } from 'app/shared/components';
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
  HikeEditOutlineComponent,
  HikeEditPhotosComponent,
  HikeEditPhotosTableComponent,
  PoiIconsComponent,
  SpecialPoiDataComponent,
  BackgroundImagesComponent,
  // Modals
  HikeEditExternalPoiInfoComponent,
  HikeEditGTrackPoiInfoComponent,
  HikeEditMergeGTrackPoiComponent
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
    LanguageModule,
    // PrimeNG
    ButtonModule,
    CardModule,
    SelectButtonModule,
    TableModule,
    AccordionModule,
    CheckboxModule,
    DialogModule
  ],
  exports: [...COMPONENTS],
  declarations: [ObjectToArrayPipe, TrustedHtmlPipe, ...COMPONENTS],
  entryComponents: [...COMPONENTS],
  providers: [
    DynamicModalService,
    GeospatialService,
    PoiMergeService
  ]
})
export class HikeEditModule {}
