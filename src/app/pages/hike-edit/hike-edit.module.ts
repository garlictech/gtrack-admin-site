import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LocalizeModule } from 'subrepos/gtrack-common-ngx';
// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';

import { TableModule } from 'primeng/table';

// Components
import { FormModule, LanguageModule, HikeComponentsModule } from 'subrepos/gtrack-common-web';

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
  HikeEditPoisCollectorComponent,
  HikeEditPoisCollectorTableComponent,
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
import { SharedComponentsModule } from '../../shared/components';
import { PipesModule } from '../../shared/pipes/pipes.module';

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
  HikeEditPoisCollectorComponent,
  HikeEditPoisCollectorTableComponent,
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
    LanguageModule,
    ReactiveFormsModule,
    MapModule,
    HikeModule,
    HikeComponentsModule,
    SharedModule,
    TagInputModule,
    SharedComponentsModule,
    FontAwesomeModule,
    LocalizeModule,
    // PrimeNG
    ButtonModule,
    CardModule,
    SelectButtonModule,
    TableModule,
    AccordionModule,
    CheckboxModule,
    DialogModule,
    PipesModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
  providers: [
    GeospatialService,
    PoiMergeService
  ]
})
export class HikeEditModule {}
