import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, takeUntil, debounceTime, switchMap, take, map } from 'rxjs/operators';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';
import { IPoiStored } from 'subrepos/provider-client';
import { AdminMap, AdminMapService } from '../../../../shared/services/admin-map';
import { PoiEditorService, HikeProgramService } from '../../../../shared/services';
import { IGTrackPoi } from '../../../../shared/interfaces';
import { State } from '../../../../store';
import { hikeEditPoiActions, commonPoiActions, editedHikeProgramActions } from '../../../../store/actions';
import * as hikeEditMapSelectors from '../../../../store/selectors/hike-edit-map';
import * as editedHikeProgramSelectors from '../../../../store/selectors/edited-hike-program';
import * as hikeEditPoiSelectors from '../../../../store/selectors/hike-edit-poi';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';

import _map from 'lodash-es/map';
import _difference from 'lodash-es/difference';
import _intersection from 'lodash-es/intersection';

@Component({
  selector: 'app-hike-edit-pois-hike',
  templateUrl: './ui.html'
})
export class HikeEditPoisHikeComponent implements OnInit, OnDestroy {
  @Input() isPlanning$: Observable<boolean>;
  public pois$: Observable<IGTrackPoi[]>;
  public showOnrouteMarkers = true;
  public showOffrouteMarkers = true;
  public displayGTrackPoiModal = false;
  public modalPoi: IGTrackPoi;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _poiEditorService: PoiEditorService,
    private _hikeProgramService: HikeProgramService,
    private _poiSelectors: PoiSelectors
  ) {}

  ngOnInit() {
    this._store
      .pipe(
        select(hikeEditMapSelectors.getMapId),
        filter(id => id !== ''),
        takeUntil(this._destroy$)
      )
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Get pois by id
    combineLatest(
      this._store.pipe(
        select(editedHikeProgramSelectors.getPoiIds),
        takeUntil(this._destroy$)
      ),
      this._store.pipe(
        select(this._poiSelectors.getPoiIds),
        takeUntil(this._destroy$)
      )
    )
      .pipe(
        debounceTime(250),
        takeUntil(this._destroy$)
      )
      .subscribe(([inHikePoiIds, inStorePoiIds]: [string[], string[]]) => {
        const missingPoiIds = _difference(inHikePoiIds, _intersection(inHikePoiIds, inStorePoiIds)).filter(
          id => id !== 'endpoint'
        );

        // Get only the not-loaded pois
        if (missingPoiIds && missingPoiIds.length > 0) {
          this._store.dispatch(new commonPoiActions.LoadPois(missingPoiIds));
        }
      });

    // Poi list
    this.pois$ = this._store.pipe(
      select(editedHikeProgramSelectors.getHikePoisCount(this._poiSelectors.getAllPois)),
      debounceTime(250),
      // takeUntil(this._destroy$),
      // switchMap(() => this._store.pipe(
      //   select(hikeEditRoutePlannerSelectors.getIsRouting),
      //   take(1)
      // )),
      // filter((routing: boolean) => !routing),
      switchMap(() => {
        return combineLatest(
          this._store.pipe(
            select(editedHikeProgramSelectors.getHikePois(this._poiSelectors.getAllPois)),
            takeUntil(this._destroy$)
          ),
          this._store.pipe(
            select(hikeEditRoutePlannerSelectors.getPath),
            takeUntil(this._destroy$)
          )
        ).pipe(
          debounceTime(250),
          filter(([pois, path]: [IPoiStored[], any]) => path && path.geometry.coordinates.length > 0),
          takeUntil(this._destroy$),
          map(([pois, path]: [IPoiStored[], any]) => {
            let _routing;
            this._store
              .pipe(
                select(hikeEditRoutePlannerSelectors.getIsRouting),
                take(1)
              )
              .subscribe((routing: boolean) => (_routing = routing));

            const _organizedPois = this._poiEditorService.organizePois(pois, path, _routing);
            const _poiIds = _map(pois, 'id');
            const _organizedPoiIds = _map(_organizedPois, 'id');
            const _removablePoiIds = _difference(_poiIds, _intersection(_poiIds, _organizedPoiIds));

            if (_removablePoiIds.length > 0) {
              this._store.dispatch(new editedHikeProgramActions.RemoveStopByPoiId(_removablePoiIds));
            }

            return _organizedPois;
          })
        );
      })
    );

    this.pois$
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe(() => {
        // Refresh markers
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    this._store
      .pipe(
        select(editedHikeProgramSelectors.getStopsCount),
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe(() => {
        this._hikeProgramService.updateHikeProgramStops();
      });

    this._store
      .pipe(
        select(hikeEditRoutePlannerSelectors.getPathLength),
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe(() => {
        this._hikeProgramService.updateHikeProgramStops();
      });

    //
    // Contexts & Refresh markers
    //

    this._store
      .pipe(
        select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('hike', 'showOnrouteMarkers')),
        takeUntil(this._destroy$)
      )
      .subscribe((value: boolean) => {
        this.showOnrouteMarkers = value;

        this.isPlanning$.pipe(take(1)).subscribe((isPlanning: boolean) => {
          if (isPlanning) {
            this._poiEditorService.refreshPoiMarkers(this._map);
          }
        });
      });

    this._store
      .pipe(
        select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('hike', 'showOffrouteMarkers')),
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe((value: boolean) => {
        this.showOffrouteMarkers = value;

        this.isPlanning$.pipe(take(1)).subscribe((isPlanning: boolean) => {
          if (isPlanning) {
            this._poiEditorService.refreshPoiMarkers(this._map);
          }
        });
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  /**
   * Show onroute markers checkbox click
   */
  public toggleOnrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers('hike'));
  }

  /**
   * Show offroute markers checkbox click
   */
  public toggleOffrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers('hike'));
  }

  public openGTrackPoiModal = (poi: IGTrackPoi) => {
    this.modalPoi = poi;
    this.displayGTrackPoiModal = true;
  }

  public closeModal = () => {
    delete this.modalPoi;
    this.displayGTrackPoiModal = false;
  }
}
