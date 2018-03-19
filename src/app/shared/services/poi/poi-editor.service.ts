import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  GeometryService, ElevationService, PoiService, IconService, Poi, CenterRadius
} from 'subrepos/gtrack-common-ngx';
import {
  State, IExternalPoiListContextItemState, commonGeoSearchActions
} from 'app/store';
import {
  HikeEditMapSelectors, HikeEditPoiSelectors, HikeEditGeneralInfoSelectors,
} from 'app/store/selectors';
import { ExternalPoi, GooglePoi, OsmPoi, WikipediaPoi } from './lib';
import { AdminMap, AdminMapService, AdminMapMarker } from '../admin-map';
import {
  IExternalPoi, IWikipediaPoi, IGooglePoi, IOsmPoi, IGTrackPoi
} from 'app/shared/interfaces/index';
import { IPoi } from 'subrepos/provider-client';

import * as _ from 'lodash';
import * as uuid from 'uuid/v1';
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
    private _iconService: IconService,
    private _adminMapService: AdminMapService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
  ) {}

  public getDbObj(poi: IExternalPoi) {
    let _poiData = {
      id: uuid()
    };
    _.defaultsDeep(
      _poiData,
      _.pick(poi, ['elevation', 'lat', 'lon', 'objectType', 'distFromRoute', 'description', 'types'])
    );

    switch (poi.objectType) {
      case 'google':
        this._getGoogleDbObj(_poiData, <GooglePoi>poi);
        break;
      case 'wikipedia':
        this._getWikipediaDbObj(_poiData, <WikipediaPoi>poi);
        break;
      case 'osmAmenity':
      case 'osmNatural':
      case 'osmRoute':
        this._getOsmDbObj(_poiData, <OsmPoi>poi);
        break;
    }

    return (<IPoi>_poiData);
  }

  /**
   * getDbObj submethod
   */
  private _getGoogleDbObj(poiData: any, poi: GooglePoi) {
    if (poi.google && poi.google.id) {
      poiData.objectId = {
        google: poi.google.id
      };

      poiData.additionalData = {};

      if (poi.google.formatted_address) {
        poiData.additionalData.address = poi.google.formatted_address;
      }

      if (poi.google.international_phone_number) {
        poiData.additionalData.phoneNumber = poi.google.international_phone_number;
      }

      if (poi.google.opening_hours) {
        poiData.additionalData.openingHours = poi.google.opening_hours;
      }
    }

    return poiData;
  }

  /**
   * getDbObj submethod
   */
  private _getWikipediaDbObj(poiData, poi: WikipediaPoi) {
    if (poi.wikipedia && poi.wikipedia.pageid) {
      poiData.objectId = {
        wikipedia: {
          [(<string>poi.wikipedia.lng)]: poi.wikipedia.pageid
        }
      };

      poiData.additionalData = {
        url: poi.wikipedia.url
      };
    }
  }

  /**
   * getDbObj submethod
   */
  private _getOsmDbObj(poiData, poi: OsmPoi) {
    poiData.objectId = {
      osm: poi.osm.id
    };
  }

  /**
   * Set the pois' onRoute property
   */
  public organizePois (
    pois: IExternalPoi[] | IGTrackPoi[],
    path: GeoJSON.Feature<GeoJSON.Polygon>,
    isGTrackPoi: Boolean = false
  ) {
    let _pois: any[] = [];

    if (path) {
      const _smallBuffer: GeoJSON.Feature<GeoJSON.Polygon> | undefined = turf.buffer(path, 50, {units: 'meters'});
      const _bigBuffer: GeoJSON.Feature<GeoJSON.Polygon> | undefined = turf.buffer(path, 1000, {units: 'meters'});

      for (let p of _.cloneDeep(pois)) {
        let _point: GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> = turf.point([p.lon, p.lat]);

        if (typeof _smallBuffer !== 'undefined') {
          p.onRoute = turf.inside(_point, _smallBuffer);
        }

        if (typeof _bigBuffer !== 'undefined') {
          if (turf.inside(_point, _bigBuffer)) {
            p.distFromRoute = this._geometryService.distanceFromRoute(_point!.geometry!.coordinates, path);

            if (!isGTrackPoi) {
              this._handleTypes(<IExternalPoi>p);
              this._handleTitle(<IExternalPoi>p);
            }

            _pois.push(p);
          }
        }
      }
    }

    return Observable.of(_pois);
  }

  /**
   * HikeEditPoi effect submethod - for gTrack pois
   */
  public handleHikeInclusion(pois: IGTrackPoi[]) {
    return this._store.select(this._hikeEditGeneralInfoSelectors.getPois)
      .take(1)
      .map((hikePois: string[]) => {
        if (pois) {
          let gTrackPois = _.cloneDeep(pois);
          gTrackPois.map((gTrackPoi: IGTrackPoi) => {
            gTrackPoi.inHike = _.includes(hikePois, gTrackPoi.id);
          });
          return gTrackPois;
        } else {
          return [];
        }
      });
  }

  private _getOnroutePois(pois: IExternalPoi[]) {
    return _.filter(pois, (p: IExternalPoi) => p.onRoute);
  }

  private _getOffroutePois(pois: IExternalPoi[]) {
    return _.filter(pois, (p: IExternalPoi) => !p.onRoute);
  }

  /**
   * organizePois submethod
   */
  private _handleTypes(poi: IExternalPoi) {
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
  private _handleTitle(poi: IExternalPoi) {
    /*
    TODO: Handle ILocalizedItem description
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
    */
  }

  /**
   * Set the inHike flag on the service pois based on on/off route state
   */
  public assignOnOffRoutePois(pois: IExternalPoi[]) {
    let _pois = _.sortBy(_.cloneDeep(pois), (p: IExternalPoi) => p.distFromRoute);
    let _onRoutePois = this._getOnroutePois(_pois);
    let _offRoutePois = this._getOffroutePois(_pois);
    _.forEach(_onRoutePois, (p) => (<any>p).inHike = true);
    _.forEach(_offRoutePois, (p) => (<any>p).inHike = false);

    return Observable.of(_pois);
  }

  /**
   * Get elevation data for pois
   */
  public handleElevation(pois: IExternalPoi[]) {
    // Google Elevation Service
    // 2,500 free requests per day
    // 512 locations per request.
    // 50 requests per second
    let _pois = _.cloneDeep(pois);
    let _poisWithoutElevation = _.filter(_pois, (p: IExternalPoi) => !p.elevation);
    let _chunks: IExternalPoi[][] = _.chunk(_poisWithoutElevation, 500);

    return Observable
      .interval(100)
      .take(_chunks.length)
      .map(counter => {
        const _chunk: IExternalPoi[] = _chunks[counter];
        const _coordinates = _.map(_chunk, (p: IExternalPoi) => [p.lat, p.lon]);

        return this._elevationService.getData(_coordinates).then((data) => {
          // Update elevation only if we got all data
          if (data.length === _chunk.length) {
            for (let i = 0; i < _chunk.length; i++) {
              _chunk[i].elevation = data[i][2];
            }
          }
          return Observable.of(counter);
        });
      })
      .combineAll()
      .map(() => {
        return _pois;
      });
  }

  public getGTrackPois(map) {
    let _bounds = map.routeInfo.getSearchBounds();
    let _geo: CenterRadius = this._geometryService.getCenterRadius(_bounds);
    let _centerCoord = _geo!.center!.geometry!.coordinates;

    if (_centerCoord) {
      this._store.dispatch(new commonGeoSearchActions.SearchInCircle({
        table: 'pois',
        circle: {
          radius: _geo.radius,
          center: [_centerCoord[0], _centerCoord[1]]
        }
      }, 'gTrackPois'));
    }
  }
  /**
   * Update inGtrackDb property on the given poi
   */
  public handleGTrackPois(pois: GooglePoi[] | WikipediaPoi[] | OsmPoi[], gTrackPois: IPoi[], ) {
    let _pois = _.cloneDeep(pois);

    for (let poi of _pois) {
      const _found = _.find(gTrackPois, (gTrackPoi: IGTrackPoi) => {
        let _idCheck = false;

        if (gTrackPoi.objectType === poi.objectType) {
          if (gTrackPoi.objectType.substring(0, 3) === 'osm') {
            _idCheck = gTrackPoi.objectId!.osm === (<OsmPoi>poi).osm.id;
          } else if (gTrackPoi.objectType === 'google') {
            _idCheck = gTrackPoi.objectId!.google === (<GooglePoi>poi).google.id;
          } else if (gTrackPoi.objectType === 'wikipedia') {
            _idCheck = gTrackPoi.objectId!.wikipedia[
              (<WikipediaPoi>poi).wikipedia.lng!
            ] === (<WikipediaPoi>poi).wikipedia.pageid;
          }

          return _idCheck;
        } else {
          return false;
        }
      });

      if (_found) {
        poi.inGtrackDb = true;
      }
    }

    return _pois;
  }

  /**
   * HikeEditPoi effect submethod
   */
  /*
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
      case 'wikipedia':
        pois$ = this._store.select(this._hikeEditPoiSelectors.getAllWikipediaPois); break;
      default:
        pois$ = Observable.of([]); break;
    }

    return pois$.take(1).map((subdomainPoiData) => {
      return _.extend(_.cloneDeep(data), { pois: subdomainPoiData });
    });
  }
  */

  /**
   * HikeEditPoi effect submethod
   */
  /*
  public clearSubdomainPoiMarkers(data) {
    let map$ = this._store.select(this._hikeEditMapSelectors.getMapId);

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
  */

  /**
   * HikeEditPoi effect submethod
   */
  /*
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
  */

  /**
   * HikeEditPoi effect submethod
   */
  /*
  public getSubdomainMarkers(data) {
    let markers$: Observable<AdminMapMarker[]>;
    switch (data.subdomain) {
      case 'google':
        markers$ = this._store.select(this._hikeEditMapSelectors.getAllGoogleMarkers);
        break;
      case 'osmAmenity':
        markers$ = this._store.select(this._hikeEditMapSelectors.getAllOsmAmenityMarkers); break;
      case 'osmNatural':
        markers$ = this._store.select(this._hikeEditMapSelectors.getAllOsmNaturalMarkers); break;
      case 'osmRoute':
        markers$ = this._store.select(this._hikeEditMapSelectors.getAllOsmRouteMarkers); break;
      case 'wikipedia':
        markers$ = this._store.select(this._hikeEditMapSelectors.getAllWikipediaMarkers); break;
      default:
        markers$ = this._store.select(this._hikeEditMapSelectors.getAllGTrackMarkers);
        break;
    }

    return markers$.take(1).map((subdomainMarkerData) => {
      return _.extend(_.cloneDeep(data), { markers: subdomainMarkerData });
    });
  }
  */

  /**
   * HikeEditPoi effect submethod
   */
  /*
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
  */
  /**
   * HikeEditPoi effect submethod
   */
  /*
  public handleMarkerChanged(subdomainData) {
    this._store.select(this._hikeEditMapSelectors.getMapId)
      .take(1)
      .subscribe((mapId: string) => {
        const _map: AdminMap = this._adminMapService.getMapById(mapId);

        if (subdomainData.pois) {
          const _filteredPoiIds: string[] = [];
          const _filteredPois: ExternalPoi[] = _.filter(subdomainData.pois, (p: ExternalPoi) => {
            if (typeof p.inHike !== 'undefined') {
              if (p.inHike && p.id) {
                _filteredPoiIds.push(p.id);
              }
              return p.inHike;
            } else {
              return false;
            }
          });

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
  */
}
