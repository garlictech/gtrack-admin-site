import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State, hikeEditImageActions } from '..';
import { MapillaryService } from '../../shared/services';
import { IBackgroundImageDataStored } from '../../shared/interfaces/mapillary-image.interface';

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
    .ofType(hikeEditImageActions.GET_MAPILLARY_IMAGES)
    .map((action: hikeEditImageActions.GetMapillaryImages) => action.bounds)
    .switchMap(bounds => {
      return this._mapillaryService.get(bounds).then((images: IBackgroundImageDataStored[]) =>  {
        return new hikeEditImageActions.SetMapillaryImages(images);
      });
    });
}
