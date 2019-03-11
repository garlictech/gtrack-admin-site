// tslint:disable:no-property-initializers
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { BackgroundImageDataStored } from '../../shared/interfaces/mapillary-image.interface';
import { FlickrService, MapillaryService } from '../../shared/services';
import { hikeEditImageActions } from '../actions';

@Injectable()
export class HikeEditImageEffects {
  /**
   * Get images from Mapillary api
   */
  @Effect() getMapillaryImages$: Observable<Action> = this._actions$.pipe(
    ofType(hikeEditImageActions.GET_MAPILLARY_IMAGES),
    map((action: hikeEditImageActions.GetMapillaryImages) => action),
    switchMap(action =>
      this._mapillaryService
        .get(action.bounds, action.path)
        .map((images: Array<BackgroundImageDataStored>) => new hikeEditImageActions.SetMapillaryImages(images))
    )
  );

  /**
   * Get images from Flickr api
   */
  @Effect() getFlickrImages$: Observable<Action> = this._actions$.pipe(
    ofType(hikeEditImageActions.GET_FLICKR_IMAGES),
    map((action: hikeEditImageActions.GetFlickrImages) => action),
    switchMap(action =>
      this._flickrService
        .get(action.bounds, action.path)
        .map((images: Array<BackgroundImageDataStored>) => new hikeEditImageActions.SetFlickrImages(images))
    )
  );
  constructor(
    private readonly _actions$: Actions,
    private readonly _mapillaryService: MapillaryService,
    private readonly _flickrService: FlickrService
  ) {}
}
