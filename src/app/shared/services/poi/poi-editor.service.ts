import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  GeometryService, ElevationService, PoiService, IconService, Poi
} from 'subrepos/gtrack-common-ngx';
import { State } from 'app/store';
import { HikeEditMapSelectors } from 'app/store/selectors/hike-edit-map';
import { HikeEditPoiSelectors } from 'app/store/selectors/hike-edit-poi';
import { ExternalPoi } from './lib/external-poi';
import { AdminMap, AdminMapService } from '../admin-map';
import { IExternalPoi, IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces/index';

import * as _ from 'lodash';
import * as turf from '@turf/turf';
import { AdminMapMarker } from 'app/shared/services/admin-map/lib/admin-map-marker';
import { IExternalPoiListContextItemState } from 'app/store/state';

@Injectable()
export class PoiEditorService {
  private _removedTypes: string[] = ['political', 'point_of_interest', 'establishment'];
  private _replaceTypes = {
    'gas_station': 'fuel',
    'grocery_or_supermarket': 'store',
    'food': 'restaurant'
  }

  constructor(
    private _store: Store<State>,
    private _geometryService: GeometryService,
    private _elevationService: ElevationService,
    private _poiService: PoiService,
    private _iconService: IconService,
    private _adminMapService: AdminMapService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
  ) {}

  public createGtrackPoi(externalPoi) {
    console.log('todo: createGtrackPoi');
    /*
    FirebaseBackend.getArray("pois").then (pois) ->
      pois.$add(externalPoi.getDbObj()).then (ref) ->
        geo = FirebaseBackend.getGeoRef "pois"
        geo.$set(ref.key(), [externalPoi.lat, externalPoi.lon]).then -> externalPoi.setInGtrackDb()
    */
  }

  private _getOnroutePois(pois: ExternalPoi[]) {
    return _.filter(pois, (p: ExternalPoi) => p.onRoute);
  }

  private _getOffroutePois(pois: ExternalPoi[]) {
    return _.filter(pois, (p: ExternalPoi) => !p.onRoute);
  }

  public organizePois(
    pois: ExternalPoi[],
    path: GeoJSON.Feature<GeoJSON.Polygon>,
    gtrackPois: ExternalPoi[]
  ) {
    let _res: ExternalPoi[] = [];

    const _smallBuffer: GeoJSON.Feature<GeoJSON.Polygon> | undefined = turf.buffer(path, 50, {units: 'meters'});
    const _bigBuffer: GeoJSON.Feature<GeoJSON.Polygon> | undefined = turf.buffer(path, 1000, {units: 'meters'});

    for (let p of pois) {
      let _point: GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> = turf.point([p.lon, p.lat]);

      if (typeof _smallBuffer !== 'undefined') {
        if (turf.inside(_point, _smallBuffer)) {
          p.onRoute = true;
        } else {
          p.onRoute = false;
        }
      }

      if (typeof _bigBuffer !== 'undefined') {
        if (turf.inside(_point, _bigBuffer)) {
          p.distFromRoute = this._geometryService.distanceFromRoute(_point!.geometry!.coordinates, path);

          this._handleTypes(p);
          this._handleTitle(p);

          if (gtrackPois) {
            this._handleGtrackPois(gtrackPois, p);
          }

          _res.push(p);
        }
      }
    }

    return this._handleElevation(_res);
  }

  /**
   * organizePois submethod
   */
  private _handleTypes(poi: ExternalPoi) {
    let _types: string[] = [];
    let _replaceTypesKeys = _.keys(this._replaceTypes);

    _.forEach(poi.types, (t) => {
      if (_replaceTypesKeys.indexOf(t) >= 0) {
        _types.push(this._replaceTypes[t]);
      } else if (this._removedTypes.indexOf(t) < 0) {
        _types.push(t);
      }
    });

    if (_types.length === 0) {
      _types.push('unknown');
    }

    poi.types = _.uniq(_types);
  }

  /**
   * organizePois submethod
   */
  private _handleTitle(poi: ExternalPoi) {
    if (!poi.title || poi.title === 'unknown') {
      let _titleParts: string[] = [];

      for (let i = 0; i < poi.types.length; i++) {
        let _t: string = poi.types[i];

        if (['atm'].indexOf(_t) >= 0) {
          _titleParts.push(_t.toUpperCase());
        } else {
          _titleParts.push(_.capitalize(_t.replace('_', ' ')));
        }
      }

      poi.title = _titleParts.join(', ');
    }
  }

  /**
   * organizePois submethod
   */
  private _handleGtrackPois(gtrackPois: ExternalPoi[], poi: ExternalPoi) {
    let _found = _.find(gtrackPois, (p: ExternalPoi) => {
      return p.objectType === poi.objectType &&
        p[p.objectType].id === poi[poi.objectType].id
    });

    if (_found) {
      poi.inGtrackDb = true;
    }
  }

  /**
   * organizePois submethod
   */
  private _handleElevation(pois: ExternalPoi[]) {
    let _poisWithoutElevation = _.filter(pois, (p: ExternalPoi) => !p.elevation);
    let _chunks: ExternalPoi[][] = _.chunk(_poisWithoutElevation, 20);

    return Observable
      .interval(100)
      .take(_chunks.length)
      .map(counter => {
        const _chunk: ExternalPoi[] = _chunks[counter];
        const _coordinates = _.map(_chunk, (p: ExternalPoi) => [p.lat, p.lon]);

        return this._elevationService.getData(_coordinates).then((data) => {
          // Update elevation only if we got all data
          if (data.length === _chunk.length) {
            for (let i = 0; i < _chunk.length; i++) {
              _chunk[i].elevation = data[i][2].toString();
            }
          }
          return Observable.of(counter);
        });
      })
      .combineAll()
      .toPromise()
      .then(() => {
        return pois;
      });
  }

  /**
   * HikeEditPoi effect submethod
   */
  public getSubdomainPois(data) {
    let pois$: Observable<IWikipediaPoi[] | IGooglePoi[] | IOsmPoi[]>;
    switch (data.subdomain) {
      case 'google':
        pois$ = this._store.select(this._hikeEditPoiSelectors.getAllGooglePois); break;
      case 'osmAmenity':
        pois$ = this._store.select(this._hikeEditPoiSelectors.getAllOsmAmenityPois); break;
      case 'osmNatural':
        pois$ = this._store.select(this._hikeEditPoiSelectors.getAllOsmNaturalPois); break;
      case 'osmRoute':
        pois$ = this._store.select(this._hikeEditPoiSelectors.getAllOsmRoutePois); break;
      default:
        pois$ = this._store.select(this._hikeEditPoiSelectors.getAllWikipediaPois); break;
    }

    return pois$.take(1).map((subdomainPoiData) => {
      return _.extend(_.cloneDeep(data), { pois: subdomainPoiData });
    });
  }

  /**
   * HikeEditPoi effect submethod
   */
  public clearSubdomainPoiMarkers(data) {
    let map$ = this._store.select(this._hikeEditMapSelectors.getHikeEditMapMapIdSelector());
    return map$.map((mapId: string) => {
      const _map: AdminMap = this._adminMapService.getMapById(mapId);

      _map.leafletMap.eachLayer(function (layer) {
        if ((<any>layer).options && (<any>layer).options.subdomain === data.subdomain) {
          (<any>layer).removeFrom(_map.leafletMap);
        }
      });

      return _.cloneDeep(data);
    });
  }

  /**
   * HikeEditPoi effect submethod
   */
  public generatePoiMarkers(data) {
    let markers: AdminMapMarker[] = [];

    for (let poi of data.pois) {
      let marker = new AdminMapMarker(
        poi.lat, poi.lon, poi.types || [], poi.title || '', this._iconService, data.subdomain, poi.id
      );
      markers.push(marker);
    }

    return _.extend(_.cloneDeep(data), { markers: markers });
  }

  /**
   * HikeEditPoi effect submethod
   */
  public getSubdomainMarkers(data) {
    let markers$: Observable<AdminMapMarker[]>;
    switch (data.subdomain) {
      case 'google':
        markers$ = this._store.select(this._hikeEditMapSelectors.getAllGoogleMarkers); break;
      case 'osmAmenity':
        markers$ = this._store.select(this._hikeEditMapSelectors.getAllOsmAmenityMarkers); break;
      case 'osmNatural':
        markers$ = this._store.select(this._hikeEditMapSelectors.getAllOsmNaturalMarkers); break;
      case 'osmRoute':
        markers$ = this._store.select(this._hikeEditMapSelectors.getAllOsmRouteMarkers); break;
      default:
        markers$ = this._store.select(this._hikeEditMapSelectors.getAllWikipediaMarkers); break;
    }

    return markers$.take(1).map((subdomainMarkerData) => {
      return _.extend(_.cloneDeep(data), { markers: subdomainMarkerData });
    });
  }

  /**
   * HikeEditPoi effect submethod
   */
  public getSubdomainContext(data) {
    let context$ = this._store.select(
      this._hikeEditPoiSelectors.getHikeEditContextSelector(data.subdomain)
    );
    return context$.map((subdomainContextData: IExternalPoiListContextItemState) => {
      return _.extend(_.cloneDeep(data), {
        showOffrouteMarkers: subdomainContextData.showOffrouteMarkers,
        showOnrouteMarkers: subdomainContextData.showOnrouteMarkers
      });
    });
  }

  /**
   * HikeEditPoi effect submethod
   */
  public handleMarkerChanged(subdomainData) {
    this._store.select(this._hikeEditMapSelectors.getHikeEditMapMapIdSelector())
      .subscribe((mapId: string) => {
        const _map: AdminMap = this._adminMapService.getMapById(mapId);

        if (subdomainData.pois) {
          const _filteredPoiIds: string[] = [];
          const _filteredPois: ExternalPoi[] = _.filter(subdomainData.pois, (p: ExternalPoi) => {
            if (typeof p.inHike !== 'undefined') {
              if (p.inHike) {
                _filteredPoiIds.push(p.id);
              }
              return p.inHike;
            } else {
              return false;
            }
          });

          // 1. Típusnak megfelelő markereket levenni a térképről
          // 2. Markerek generálása és az entity lista lecserélése (addMany)
          // 3. Láthatóság frissítése entity

          const _onRoutePois = this._getOnroutePois(_filteredPois);
          const _offRoutePois = this._getOffroutePois(_filteredPois);

          if (subdomainData.showOnrouteMarkers) {
            _.forEach(_onRoutePois, (p) => {
              // Find the poi's marker
              const marker = _.find(subdomainData.markers, (m: AdminMapMarker) => m.poiId === p.id);
              if (marker) {
                marker.addToMap(_map.leafletMap);
              }
            });
          }

          if (subdomainData.showOffrouteMarkers) {
            _.forEach(_offRoutePois, (p) => {
              // Find the poi's marker
              const marker = _.find(subdomainData.markers, (m: AdminMapMarker) => m.poiId === p.id);
              if (marker) {
                marker.addToMap(_map.leafletMap);
              }
            });
          }
        }
      });
  }

  /**
   * HikeEditPoi effect submethod
   */
  public assignGTrackPois(data) {
    return this._poiService.search(data.bounds).map((gtrackPois) => {
      return _.extend(_.cloneDeep(data), {gtrackPois: gtrackPois});
    });
  }

  /**
   * HikeEditPoi effect submethod
   */
  public assignOrganizedPois(data) {
    const _map: AdminMap = this._adminMapService.getMapById(data.mapId);
    return this
      .organizePois(data.pois, _map.routeInfo.getPath(), data.gtrackPois)
      .then((organizedPois) => {
        return _.extend(_.cloneDeep(data), {organizedPois: organizedPois});
      });
  }

  /**
   * HikeEditPoi effect submethod
   */
  public assignOnOffRoutePois(data) {
    let _pois = _.sortBy(data.organizedPois, (p: ExternalPoi) => p.distFromRoute);
    let _onRoutePois = this._getOnroutePois(_pois);
    let _offRoutePois = this._getOffroutePois(_pois);
    _.forEach(_onRoutePois, (p) => (<any>p).inHike = true);
    _.forEach(_offRoutePois, (p) => (<any>p).inHike = false);

    return _pois;
  }
}
