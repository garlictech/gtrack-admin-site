import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap, combineLatest } from 'rxjs/operators';
import { hikeEditPoiActions, commonPoiActions, editedGTrackPoiActions } from '../actions';
import { OsmPoiService, OsmRoutePoiService, WikipediaPoiService, GooglePoiService, HikeProgramService } from '../../shared/services';
import { IWikipediaPoi, IOsmPoi, IGooglePoi } from '../../shared/interfaces';
import { RouteService } from 'subrepos/gtrack-common-ngx';

import _concat from 'lodash-es/concat';
import _uniqBy from 'lodash-es/uniqBy';

@Injectable()
export class HikeEditPoiEffects {
  constructor(
    private _actions$: Actions,
    private _routeService: RouteService,
    private _wikipediaPoiService: WikipediaPoiService,
    private _osmPoiService: OsmPoiService,
    private _osmRoutePoiService: OsmRoutePoiService,
    private _googlePoiService: GooglePoiService,
    private _hikeProgramService: HikeProgramService
  ) {}

  /**
   * Get pois from WikiPedia api
   */
  @Effect()
  getWikipediaPois$: Observable<any> = this._actions$
    .pipe(
      ofType(hikeEditPoiActions.GET_WIKIPEDIA_POIS),
      map((action: hikeEditPoiActions.GetWikipediaPois) => action.bounds),
      switchMap(bounds => {
        console.log('bounds', bounds);
        const boundsArr: any[] = [];
        this._routeService.splitBounds(bounds, 10000, boundsArr);

        const langs: string[] = this._hikeProgramService.getDescriptionLaguages();

        const _observables: Observable<IWikipediaPoi[]>[] = [];

        for (const lang of langs) {
          for (const _bounds of boundsArr) {
            _observables.push(this._wikipediaPoiService.get(_bounds, lang));
          }
        }

        return forkJoin(_observables)
          .map(poisArr => {
            let pois: IWikipediaPoi[] = [];
            poisArr.map((poiArr: IWikipediaPoi[]) => {
              pois = _concat(pois, poiArr);
            });
            return new hikeEditPoiActions.SetWikipediaPois(_uniqBy(pois, 'wikipedia.pageid'));
          });
      })
    );

  /**
   * Get pois from Google api
   */
  @Effect()
  getGooglePois$: Observable<any> = this._actions$
    .pipe(
      ofType(hikeEditPoiActions.GET_GOOGLE_POIS),
      map((action: hikeEditPoiActions.GetGooglePois) => action.bounds),
      switchMap(bounds => {
        const langs: string[] = this._hikeProgramService.getDescriptionLaguages();

        const _observables: Observable<IGooglePoi[]>[] = [];

        for (const lang of langs) {
          _observables.push(this._googlePoiService.get(bounds, lang));
        }

        return forkJoin(_observables)
          .map(poisArr => {
            let pois: IGooglePoi[] = [];
            poisArr.map((poiArr: IGooglePoi[]) => {
              pois = _concat(pois, poiArr);
            });
            return new hikeEditPoiActions.SetGooglePois(pois);
          });
      })
    );

  /**
   * Get pois from OSM api
   */
  @Effect()
  getOsmNaturalPois$: Observable<Action> = this._actions$
    .pipe(
      ofType(hikeEditPoiActions.GET_OSM_NATURAL_POIS),
      map((action: hikeEditPoiActions.GetOsmNaturalPois) => action.bounds),
      switchMap(bounds => {
        return this._osmPoiService
          .get(bounds, 'natural')
          .map((pois: IOsmPoi[]) => {
            return new hikeEditPoiActions.SetOsmNaturalPois(pois);
          });
      })
    );

  /**
   * Get pois from OSM api
   */
  @Effect()
  getOsmAmenityPois$: Observable<Action> = this._actions$
    .pipe(
      ofType(hikeEditPoiActions.GET_OSM_AMENITY_POIS),
      map((action: hikeEditPoiActions.GetOsmAmenityPois) => action.bounds),
      switchMap(bounds => {
        return this._osmPoiService
          .get(bounds, 'amenity')
          .map((pois: IOsmPoi[]) => {
            return new hikeEditPoiActions.SetOsmAmenityPois(pois);
          });
      })
    );

  /**
   * Get pois from OSM api
   */
  @Effect()
  getOsmRoutePois$: Observable<Action> = this._actions$
    .pipe(
      ofType(hikeEditPoiActions.GET_OSM_ROUTE_POIS),
      map((action: hikeEditPoiActions.GetOsmRoutePois) => action.bounds),
      switchMap(bounds => {
        return this._osmRoutePoiService
          .get(bounds)
          .map((pois: IOsmPoi[]) => {
            return new hikeEditPoiActions.SetOsmRoutePois(pois);
          });
      })
    );

  /**
   * Load gTrackPoi after save from servicePoi
   */
  @Effect()
  loadSavedPoi$: Observable<Action> = this._actions$
    .pipe(
      ofType<commonPoiActions.PoiSaved>(commonPoiActions.PoiActionTypes.POI_SAVED),
      map(action => new commonPoiActions.LoadPoi(action.context))
    );

  /**
   * Load gTrackPoi after modal edit
   */
  @Effect()
  loadModifiedPoi$: Observable<Action> = this._actions$
    .pipe(
      ofType<editedGTrackPoiActions.PoiSaveSuccess>(editedGTrackPoiActions.POI_SAVE_SUCCESS),
      map(action => new commonPoiActions.LoadPoi(action.poiId))
    );
}
