// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, editedHikeProgramActions } from 'app/store';
import { IGTrackPoi } from 'app/shared/interfaces';
import { LanguageService } from 'app/shared/services';
import { IDynamicComponentModalConfig, DynamicModalService } from 'subrepos/gtrack-common-ngx';
import { HikeEditRoutePlannerSelectors } from '../../../../../store/selectors';
import { GeospatialService } from 'subrepos/gtrack-common-ngx/app/shared/services/geospatial';

@Component({
  selector: 'hike-edit-pois-gtrack-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisGTrackTableComponent {
  @Input() pois$: IGTrackPoi[];
  @Input() onRouteCheck: boolean;

  constructor(
    private _store: Store<State>,
    private _dynamicModalService: DynamicModalService,
    private _geospatialService: GeospatialService,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
  ) {}

  public addPoi($event, poi: IGTrackPoi) {
    $event.stopPropagation();

    this._store
      .select(this._hikeEditRoutePlannerSelectors.getRoute)
      .take(1)
      .subscribe((route) => {
        const stop = {
          distanceFromOrigo: this._geospatialService.distanceOnLine(
            [route.features[1].geometry.coordinates[0], route.features[1].geometry.coordinates[1]],
            [poi.lon, poi.lat],
            route.features[0]
          ),
          onRoute: poi.onRoute || false,
          poiId: poi.id,
          lat: poi.lat,
          lon: poi.lon,
          segment: { // TODO: w/ turf
            uphill: 0,
            downhill: 0,
            distance: 0,
            score: 0,
            time: 0
          }
        }

        this._store.dispatch(new editedHikeProgramActions.AddStop(stop));
      });
  }

  public openModal($event, poi: IGTrackPoi) {
    $event.stopPropagation();

    const modalConfig: IDynamicComponentModalConfig = {
      component: {
        contentComponentName: 'HikeEditGTrackPoiInfoComponent',
        data: {
          poiId: <string>poi.id
        }
      },
      modal: {
        title: LanguageService.translateDescription(poi.description, 'title'),
        className: 'modal-lg',
        hasFooter: false
      }
    };
    this._dynamicModalService.showComponentModal(modalConfig);
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }
}
