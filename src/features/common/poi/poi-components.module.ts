import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PoiMapComponent } from './components';
import { PoiImagesToGalleryPipe, PoiImagesWithinCirclePipe } from './pipes';
import { getReducers, POI_REDUCER_TOKEN, PoiEffects, PoiSelectors } from './store';
import { featureName } from './store/state';

const COMPONENTS = [PoiMapComponent];
const PIPES = [PoiImagesToGalleryPipe, PoiImagesWithinCirclePipe];

@NgModule({
  imports: [StoreModule.forFeature(featureName, POI_REDUCER_TOKEN), EffectsModule.forFeature([PoiEffects])],
  providers: [
    PoiSelectors,
    {
      provide: POI_REDUCER_TOKEN,
      useFactory: getReducers
    }
  ],
  declarations: [...COMPONENTS, ...PIPES],
  exports: [...COMPONENTS, ...PIPES]
})
export class PoiComponentsModule {}
