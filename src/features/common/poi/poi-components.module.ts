import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { PoiMapComponent } from './components';
import { PoiImagesToGalleryPipe, PoiImagesWithinCirclePipe } from './pipes';
import { poiReducer } from './store/reducer';
import { featureName } from './store/state';

const COMPONENTS = [PoiMapComponent];
const PIPES = [PoiImagesToGalleryPipe, PoiImagesWithinCirclePipe];

@NgModule({
  imports: [StoreModule.forFeature(featureName, poiReducer)],
  declarations: [...COMPONENTS, ...PIPES],
  exports: [...COMPONENTS, ...PIPES]
})
export class HikeComponentsModule {}
