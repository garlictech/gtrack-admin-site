import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { State, hikeEditPoiActions, commonPoiActions, editedGTrackPoiActions } from '../index';
import { EditedHikeProgramSelectors } from 'app/store/selectors/';
import { OsmPoiService, OsmRoutePoiService, WikipediaPoiService, GooglePoiService } from 'app/shared/services';
import { IWikipediaPoi, IOsmPoi, IGooglePoi } from 'app/shared/interfaces';

import * as _ from 'lodash';

@Injectable()
export class HikeEditPoiEffects {
  constructor(
    private _store: Store<State>,
    private _actions$: Actions,
    private _wikipediaPoiService: WikipediaPoiService,
    private _osmPoiService: OsmPoiService,
    private _osmRoutePoiService: OsmRoutePoiService,
    private _googlePoiService: GooglePoiService,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors
  ) {}

  /**
   * Get pois from WikiPedia api
   */
  @Effect()
  getWikipediaPois$: Observable<any> = this._actions$
    .ofType(hikeEditPoiActions.GET_WIKIPEDIA_POIS)
    .map((action: hikeEditPoiActions.GetWikipediaPois) => action.bounds)
    .switchMap(bounds => {
      let boundsArr: any[] = [];
      this._wikipediaPoiService.getSearchBounds(bounds, boundsArr);

      // TODO: move lang list to common service
      let langs: string[] = [];
      this._store
        .select(this._editedHikeProgramSelectors.getDescriptionLangs)
        .take(1)
        .subscribe((langKeys: string[]) => {
          langs = langKeys.map(key => key.substr(0, 2));
        });

      const _promises: Promise<IWikipediaPoi[]>[] = [];

      for (const lang of langs) {
        for (const _bounds of boundsArr) {
          _promises.push(this._wikipediaPoiService.get(_bounds, lang));
        }
      }

      return Promise.all(_promises).then(poisArr => {
        let pois: IWikipediaPoi[] = [];
        poisArr.map((poiArr: IWikipediaPoi[]) => {
          pois = _.concat(pois, poiArr);
        });
        return new hikeEditPoiActions.SetWikipediaPois(_.uniqBy(pois, 'wikipedia.pageid'));
      });
    });

  /**
   * Get pois from Google api
   */
  @Effect()
  getGooglePois$: Observable<any> = this._actions$
    .ofType(hikeEditPoiActions.GET_GOOGLE_POIS)
    .map((action: hikeEditPoiActions.GetGooglePois) => action.bounds)
    .switchMap(bounds => {
      return this._googlePoiService.get(bounds).then((pois: IGooglePoi[]) => {
        return new hikeEditPoiActions.SetGooglePois(pois);
      });
    });

  /**
   * Get pois from OSM api
   */
  @Effect()
  getOsmNaturalPois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_OSM_NATURAL_POIS)
    .map((action: hikeEditPoiActions.GetOsmNaturalPois) => action.bounds)
    .switchMap(bounds => {
      return this._osmPoiService.get(bounds, 'natural').then((pois: IOsmPoi[]) => {
        return new hikeEditPoiActions.SetOsmNaturalPois(pois);
      });
    });

  /**
   * Get pois from OSM api
   */
  @Effect()
  getOsmAmenityPois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_OSM_AMENITY_POIS)
    .map((action: hikeEditPoiActions.GetOsmAmenityPois) => action.bounds)
    .switchMap(bounds => {
      return this._osmPoiService.get(bounds, 'amenity').then((pois: IOsmPoi[]) => {
        return new hikeEditPoiActions.SetOsmAmenityPois(pois);
      });
    });

  /**
   * Get pois from OSM api
   */
  @Effect()
  getOsmRoutePois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_OSM_ROUTE_POIS)
    .map((action: hikeEditPoiActions.GetOsmRoutePois) => action.bounds)
    .switchMap(bounds => {
      return this._osmRoutePoiService.get(bounds).then((pois: IOsmPoi[]) => {
        return new hikeEditPoiActions.SetOsmRoutePois(pois);
      });
    });

  /**
   * Load gTrackPoi after save from servicePoi
   */
  @Effect()
  loadSavedPoi$: Observable<Action> = this._actions$
    .ofType<commonPoiActions.PoiSaved>(commonPoiActions.PoiActionTypes.POI_SAVED)
    .map(action => new commonPoiActions.LoadPoi(action.context));

  /**
   * Load gTrackPoi after modal edit
   */
  @Effect()
  loadModifiedPoi$: Observable<Action> = this._actions$
    .ofType<editedGTrackPoiActions.PoiSaveSuccess>(editedGTrackPoiActions.POI_SAVE_SUCCESS)
    .map(action => new commonPoiActions.LoadPoi(action.poiId));
}
