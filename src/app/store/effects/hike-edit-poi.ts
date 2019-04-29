// tslint:disable:no-property-initializers
import _concat from 'lodash-es/concat';
import _uniqBy from 'lodash-es/uniqBy';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { RouteService } from '@features/common/route';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { GooglePoi, OsmPoi, WikipediaPoi } from '../../shared/interfaces';
import { GooglePoiService, HikeProgramService, OsmPoiService, WikipediaPoiService } from '../../shared/services';
import { commonPoiActions, editedGTrackPoiActions, hikeEditPoiActions } from '../actions';

@Injectable()
export class HikeEditPoiEffects {
  /**
   * Get pois from WikiPedia api
   */
  @Effect() getWikipediaPois$: Observable<any> = this._actions$.pipe(
    ofType(hikeEditPoiActions.GET_WIKIPEDIA_POIS),
    map((action: hikeEditPoiActions.GetWikipediaPois) => action.bounds),
    switchMap(bounds => {
      const boundsArr: Array<any> = [];
      this._routeService.splitBounds(bounds, 10000, boundsArr);

      const langs: Array<string> = this._hikeProgramService.getDescriptionLanguages();
      const _observables: Array<Observable<Array<WikipediaPoi>>> = [];

      for (const lang of langs) {
        for (const _bounds of boundsArr) {
          _observables.push(this._wikipediaPoiService.get(_bounds, lang));
        }
      }

      return forkJoin(_observables).map(poisArr => {
        let pois: Array<WikipediaPoi> = [];
        poisArr.forEach((poiArr: Array<WikipediaPoi>) => {
          pois = _concat(pois, poiArr);
        });

        return new hikeEditPoiActions.SetWikipediaPois(_uniqBy(pois, 'wikipedia.pageid'));
      });
    })
  );

  /**
   * Get pois from Google api
   */
  @Effect() getGooglePois$: Observable<any> = this._actions$.pipe(
    ofType(hikeEditPoiActions.GET_GOOGLE_POIS),
    map((action: hikeEditPoiActions.GetGooglePois) => action.bounds),
    switchMap(bounds => {
      const langs: Array<string> = this._hikeProgramService.getDescriptionLanguages();

      return this._googlePoiService
        .get(bounds, langs)
        .map((pois: Array<GooglePoi>) => new hikeEditPoiActions.SetGooglePois(pois));
    })
  );

  /**
   * Get pois from OSM api
   */
  @Effect() getOsmNaturalPois$: Observable<Action> = this._actions$.pipe(
    ofType(hikeEditPoiActions.GET_OSM_NATURAL_POIS),
    map((action: hikeEditPoiActions.GetOsmNaturalPois) => action.bounds),
    switchMap(bounds =>
      this._osmPoiService
        .get(bounds, 'natural')
        .map((pois: Array<OsmPoi>) => new hikeEditPoiActions.SetOsmNaturalPois(pois))
    )
  );

  /**
   * Get pois from OSM api
   */
  @Effect() getOsmAmenityPois$: Observable<Action> = this._actions$.pipe(
    ofType(hikeEditPoiActions.GET_OSM_AMENITY_POIS),
    map((action: hikeEditPoiActions.GetOsmAmenityPois) => action.bounds),
    switchMap(bounds =>
      this._osmPoiService
        .get(bounds, 'amenity')
        .map((pois: Array<OsmPoi>) => new hikeEditPoiActions.SetOsmAmenityPois(pois))
    )
  );

  /**
   * Load gTrackPoi after save from servicePoi
   */
  @Effect() loadSavedPoi$: Observable<Action> = this._actions$.pipe(
    ofType<commonPoiActions.PoiSaved>(commonPoiActions.PoiActionTypes.POI_SAVED),
    map(action => new commonPoiActions.LoadPoi(action.context))
  );

  /**
   * Load gTrackPoi after modal edit
   */
  @Effect() loadModifiedPoi$: Observable<Action> = this._actions$.pipe(
    ofType<editedGTrackPoiActions.PoiSaveSuccess>(editedGTrackPoiActions.POI_SAVE_SUCCESS),
    map(action => new commonPoiActions.LoadPoi(action.poiId))
  );
  constructor(
    private readonly _actions$: Actions,
    private readonly _routeService: RouteService,
    private readonly _wikipediaPoiService: WikipediaPoiService,
    private readonly _osmPoiService: OsmPoiService,
    // private _osmRoutePoiService: OsmRoutePoiService,
    private readonly _googlePoiService: GooglePoiService,
    private readonly _hikeProgramService: HikeProgramService
  ) {}
}
