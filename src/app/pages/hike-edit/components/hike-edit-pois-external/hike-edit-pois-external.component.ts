
import { Component, Input, Injector, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AdminMap, AdminMapService } from '../../../../shared/services/admin-map';
import { OsmPoiService } from '../../../../shared/services';
import { State } from '../../../../store';
import { HikeEditPoiActions } from '../../../../store/hike-edit-poi/index';

@Component({
  selector: 'gt-hike-edit-pois-external',
  templateUrl: './hike-edit-pois-external.component.html',
  providers: [
    OsmPoiService
  ]
})
export class HikeEditPoisExternalComponent implements OnInit {
  @Input() actionName: string;
  @Input() poiType: string;
  public pois: any[] = []; // STORE!!
  private _map: AdminMap;

  private _serviceMap = {
    'OsmPoiService': OsmPoiService
  };

  constructor(
    private _injector: Injector,
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _actions: HikeEditPoiActions
  ) {
    this._store.select((state: State) => state.hikeEditMap.mapId)
      .skipWhile(mapId => mapId === null)
      .take(1)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });
  }

  ngOnInit() {
    // console.log('SERVICE???', this._serviceMap[this.serviceName]);
  }

  public getPois() {
    let _bounds = this._map.routeInfo.getSearchBounds();
    console.log('bounds', _bounds);
    this._store.dispatch(this._actions[this.actionName](_bounds, (this.poiType || null)));

    /*

    bounds = RouteService.getSearchBounds()
    _removePois()

    AsyncRequestExecutor.execute scope, scope.service.get(bounds, scope.poiType)
    .then (pois) ->

      PoiService.search(bounds).then (gtrackPois) ->
        PoiEditorService.organizePois(pois, RouteService.getPath(), gtrackPois).then (organizedPois) ->
          scope.pois = _.sortBy organizedPois, (p) -> p.distFromStart
          onRoutePois = PoiEditorService.getOnroutePois scope.pois
          _.forEach onRoutePois, (p) -> p.inHike = true
          offRoutePois = PoiEditorService.getOffroutePois scope.pois
          _.forEach offRoutePois, (p) -> p.inHike = false
          _markerConfigChanged()
    */
  }

  public savePois() {
    //
  }
}
