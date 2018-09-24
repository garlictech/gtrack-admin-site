import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IBackgroundImageDataStored } from '../../shared/interfaces/mapillary-image.interface';
import { map, switchMap } from 'rxjs/operators';
import { hikeEditImageActions } from '../actions';
import { MapillaryService } from '../../shared/services';

@Injectable()
export class HikeEditImageEffects {
  constructor(
    private _actions$: Actions,
    private _mapillaryService: MapillaryService
  ) {}

  /**
   * Get pois from WikiPedia api
   */
  @Effect()
  getWikipediaPois$: Observable<Action> = this._actions$
    .pipe(
      ofType(hikeEditImageActions.GET_MAPILLARY_IMAGES),
      map((action: hikeEditImageActions.GetMapillaryImages) => action.bounds),
      switchMap(bounds => {
        return this._mapillaryService.get(bounds).then((images: IBackgroundImageDataStored[]) =>  {
          return new hikeEditImageActions.SetMapillaryImages(images);
        });
      })
    );
}
