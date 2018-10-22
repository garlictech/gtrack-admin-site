import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IBackgroundImageDataStored } from '../../shared/interfaces/mapillary-image.interface';
import { map, switchMap } from 'rxjs/operators';
import { hikeEditImageActions } from '../actions';
import { MapillaryService, FlickrService } from '../../shared/services';

@Injectable()
export class HikeEditImageEffects {
  constructor(
    private _actions$: Actions,
    private _mapillaryService: MapillaryService,
    private _flickrService: FlickrService
  ) {}

  /**
   * Get images from Mapillary api
   */
  @Effect()
  getMapillaryImages$: Observable<Action> = this._actions$
    .pipe(
      ofType(hikeEditImageActions.GET_MAPILLARY_IMAGES),
      map((action: hikeEditImageActions.GetMapillaryImages) => action),
      switchMap(action => {
        return this._mapillaryService
          .get(action.bounds, action.path)
          .map((images: IBackgroundImageDataStored[]) =>  {
            return new hikeEditImageActions.SetMapillaryImages(images);
          });
      })
    );

  /**
   * Get images from Flickr api
   */
  @Effect()
  getFlickrImages$: Observable<Action> = this._actions$
    .pipe(
      ofType(hikeEditImageActions.GET_FLICKR_IMAGES),
      map((action: hikeEditImageActions.GetFlickrImages) => action),
      switchMap(action => {
        return this._flickrService
          .get(action.bounds, action.path)
          .map((images: IBackgroundImageDataStored[]) =>  {
            return new hikeEditImageActions.SetFlickrImages(images);
          });
      })
    );
}
