import { TagInputModule } from 'ngx-chips';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { HikeModule, SharedModule } from 'subrepos/gtrack-common-ngx';
import { GeospatialService } from 'subrepos/gtrack-common-ngx/app/shared/services/geospatial';
import { FormModule, HikeComponentsModule, LanguageModule } from 'subrepos/gtrack-common-web';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LeafletMapModule } from '@bit/garlictech.angular-features.common.leaflet-map';
import { MultiLanguageTextModule } from '@bit/garlictech.angular-features.common.multi-language-text';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { SharedComponentsModule } from '../../shared/components';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { PoiMergeService } from '../../shared/services';
import {
  BackgroundImagesComponent,
  HikeEditExternalPoiInfoComponent,
  HikeEditGeneralInfoComponent,
  HikeEditGTrackPoiInfoComponent,
  HikeEditMapComponent,
  HikeEditMergeGTrackPoiComponent,
  HikeEditOutlineComponent,
  HikeEditPhotosComponent,
  HikeEditPhotosTableComponent,
  HikeEditPoisCollectorComponent,
  HikeEditPoisCollectorTableComponent,
  HikeEditPoisComponent,
  HikeEditPoisExternalComponent,
  HikeEditPoisExternalTableComponent,
  HikeEditPoisGTrackComponent,
  HikeEditPoisGTrackTableComponent,
  HikeEditPoisHikeComponent,
  HikeEditPoisHikeTableComponent,
  HikeEditRoutePlannerComponent,
  PoiIconsComponent,
  SpecialPoiDataComponent
} from './components';
import { HikeEditComponent } from './hike-edit.component';

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
    TranslateModule,
    ReactiveFormsModule,
    LeafletMapModule,
    HikeModule,
    HikeComponentsModule,
    SharedModule,
    TagInputModule,
    SharedComponentsModule,
    FontAwesomeModule,
    LanguageModule,
    MultiLanguageTextModule,
    LeafletMapModule,
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
  providers: [GeospatialService, PoiMergeService]
})
export class HikeEditModule {}
