import { Injectable } from '@angular/core';
import {
  GeometryService, ElevationService, PoiService, Poi
} from 'subrepos/gtrack-common-ngx';
import { ExternalPoi } from './external-poi';
import { AdminMap, AdminMapService } from '../admin-map';
import { Observable } from 'rxjs/Observable';
import { IExternalPoi } from 'app/shared/interfaces/index';
import { State, selectHikeEditMapMapId } from 'app/store';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as turf from '@turf/turf';

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
    private _adminMapService: AdminMapService,
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

  public getOnroutePois(pois: ExternalPoi[]) {
    return _.filter(pois, (p: ExternalPoi) => p.onRoute);
  }

  public getOffroutePois(pois: ExternalPoi[]) {
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

  public handleMarkerChanged(subdomainData) {
    this._store.select(selectHikeEditMapMapId).subscribe((mapId: string) => {
      const _map: AdminMap = this._adminMapService.getMapById(mapId);

      _map.pointMarker.removeMarkers(); // todo remove this global method

      if (subdomainData.pois) {
        const _filteredPois: ExternalPoi[] = _.filter(subdomainData.pois, (p: ExternalPoi) => {
          if (typeof p.inHike !== 'undefined') {
            return p.inHike;
          } else {
            return false;
          }
        });

        if (subdomainData.showOnrouteMarkers) {
          _map.pointMarker.addMarkers(<Poi[]>this.getOnroutePois(_filteredPois));
        } else {
          // remove inHike onroutePois
        }

        if (subdomainData.showOffrouteMarkers) {
          _map.pointMarker.addMarkers(<Poi[]>this.getOffroutePois(_filteredPois));
        } else {
          // remove inHike offroutePois
        }
      }
    });
  }

  /**
   * Effect submethod
   */
  public assignGTrackPois(data) {
    return this._poiService.search(data.bounds).map((gtrackPois) => {
      return _.extend(_.cloneDeep(data), {gtrackPois: gtrackPois});
    });
  }

  /**
   * Effect submethod
   */
  public assignOrganizedPois(data) {
    const _map: AdminMap = this._adminMapService.getMapById(data.mapId);
    return this
      .organizePois(data.pois, _map.routeInfo.getPath(), data.gtrackPois)
      .then((organizedPois) => {
        return _.extend(_.cloneDeep(data), {organizedPois: organizedPois});
      });
  }

  public assignOnOffRoutePois(data) {
    let _pois = _.sortBy(data.organizedPois, (p: ExternalPoi) => p.distFromRoute);
    let _onRoutePois = this.getOnroutePois(_pois);
    let _offRoutePois = this.getOffroutePois(_pois);
    _.forEach(_onRoutePois, (p) => (<any>p).inHike = true);
    _.forEach(_offRoutePois, (p) => (<any>p).inHike = false);

    return _pois;
  }
}
