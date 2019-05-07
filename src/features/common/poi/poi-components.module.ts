import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PoiMapComponent } from './components';
import { PoiImagesToGalleryPipe, PoiImagesWithinCirclePipe } from './pipes';
import { PoiEffects, PoiSelectors } from './store';
import { poiReducer } from './store/reducer';
import { featureName } from './store/state';

const COMPONENTS = [PoiMapComponent];
const PIPES = [PoiImagesToGalleryPipe, PoiImagesWithinCirclePipe];

@NgModule({
  imports: [StoreModule.forFeature(featureName, poiReducer), EffectsModule.forFeature([PoiEffects])],
  providers: [PoiSelectors],
  declarations: [...COMPONENTS, ...PIPES],
  exports: [...COMPONENTS, ...PIPES]
})
export class PoiComponentsModule {}
