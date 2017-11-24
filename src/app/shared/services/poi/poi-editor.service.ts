import { Injectable } from '@angular/core';
import { GeometryService, ElevationService } from '../../../../subrepos/gtrack-common-ngx';
import { ExternalPoi } from './external-poi';
import { AdminMap } from '../admin-map/admin-map';
import * as _ from 'lodash';
import * as turf from '@turf/turf';
import { Observable } from 'rxjs/Observable';
import { IExternalPoi } from '../../interfaces/index';

@Injectable()
export class PoiEditorService {
  private _removedTypes: string[] = ['political', 'point_of_interest', 'establishment'];
  private _replaceTypes = {
    'gas_station': 'fuel',
    'grocery_or_supermarket': 'store',
    'food': 'restaurant'
  }

  constructor(
    private _geometryService: GeometryService,
    private _elevationService: ElevationService
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

  public getOnroutePois(pois) {
    return _.filter(pois, (p: ExternalPoi) => p.onRoute);
  }

  public getOffroutePois(pois) {
    return _.filter(pois, (p: ExternalPoi) => !p.onRoute);
  }

  public organizePois(pois, path, gtrackPois) {
    let _res = [];

    const _smallBuffer: GeoJSON.Feature<GeoJSON.Polygon> = turf.buffer(path, 50, 'meters');
    const _bigBuffer: GeoJSON.Feature<GeoJSON.Polygon> = turf.buffer(path, 1000, 'meters');

    for (let p of pois) {
      let _point = turf.point([p.lon, p.lat]);

      if (turf.inside(_point, _smallBuffer)) {
        p.onRoute = true;
      } else {
        p.onRoute = false;
      }

      if (turf.inside(_point, _bigBuffer)) {
        p.distFromRoute = this._geometryService.distanceFromRoute(_point.geometry.coordinates, path);

        this._handleTypes(p);
        this._handleTitle(p);

        if (gtrackPois) {
          this._handleGtrackPois(gtrackPois, p);
        }

        _res.push(p);
      }
    }

    return this._handleElevation(_res);
  }

  /**
   * organizePois submethod
   */
  private _handleTypes(poi) {
    let _types = [];
    let _replaceTypesKeys = _.keys(this._replaceTypes);
    _.forEach(poi.types, (t) => {
      if (_replaceTypesKeys.indexOf(t) >= 0) {
        _types.push(this._replaceTypes[_replaceTypesKeys.indexOf(t)]);
      } else if (this._removedTypes.indexOf(t) < 0) {
        _types.push(t);
      }
    });

    poi.types = _.uniq(_types);
  }

  /**
   * organizePois submethod
   */
  private _handleTitle(poi) {
    if (!poi.title || poi.title === 'unknown') {
      let _titleParts = [];

      for (let i = 0; i < poi.types.length; i++) {
        let _t = poi.types[i];

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
  private _handleGtrackPois(gtrackPois, poi: ExternalPoi) {
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
  private _handleElevation(pois) {
    let _poisWithoutElevation = _.filter(pois, (p: ExternalPoi) => !p.elevation);
    let _chunks = _.chunk(_poisWithoutElevation, 20);

    return Observable
      .interval(100)
      .take(_chunks.length)
      .map(counter => {
        const _chunk = _chunks[counter];
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

  public handleMarkerChanged(subdomainData, map: AdminMap) {
    map.pointMarker.removeMarkers(); // todo remove this global method

    if (subdomainData.pois) {
      const _filteredPois = _.filter(subdomainData.pois, (p: IExternalPoi) => p.inHike);

      if (subdomainData.showOnrouteMarkers) {
        map.pointMarker.addMarkers(this.getOnroutePois(_filteredPois));
      } else {
        // remove inHike onroutePois
      }

      if (subdomainData.showOffrouteMarkers) {
        map.pointMarker.addMarkers(this.getOffroutePois(_filteredPois));
      } else {
        // remove inHike offroutePois
      }
    }
  }
}
