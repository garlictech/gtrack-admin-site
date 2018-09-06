import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  GeometryService,
  ElevationService,
  IconService,
  CenterRadius,
  GeoSearchSelectors,
  PoiSelectors
} from 'subrepos/gtrack-common-ngx';
import { IPoi, IPoiStored, EPoiTypes } from 'subrepos/provider-client';
import { State, IExternalPoiListContextItemState, commonGeoSearchActions } from '../../../store';
import {
  HikeEditPoiSelectors,
  HikeEditRoutePlannerSelectors,
  EditedHikeProgramSelectors
} from '../../../store/selectors';
import { AdminMap, AdminMapMarker, RoutePlannerService } from '../admin-map';
import { IExternalPoi, IWikipediaPoi, IGooglePoi, IOsmPoi, IGTrackPoi } from '../../interfaces';
import { GooglePoiService } from './google-poi.service';
import { WikipediaPoiService } from './wikipedia-poi.service';
import { IMarkerPopupData } from 'subrepos/provider-client/interfaces';
import { MarkerPopupService } from 'subrepos/gtrack-common-ngx/app/map/services/map-marker/marker-popup.service';

import * as L from 'leaflet';
import 'overlapping-marker-spiderfier-leaflet';
import * as _ from 'lodash';
import * as turf from '@turf/turf';

declare const OverlappingMarkerSpiderfier;

@Injectable()
export class PoiEditorService {
  private _removedTypes: string[] = ['political', 'point_of_interest', 'establishment'];
  private _replaceTypes = {
    gas_station: 'fuel',
    grocery_or_supermarket: 'store',
    food: 'restaurant'
  };

  constructor(
    private _store: Store<State>,
    private _geometryService: GeometryService,
    private _routePlannerService: RoutePlannerService,
    private _elevationService: ElevationService,
    private _iconService: IconService,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _geoSearchSelectors: GeoSearchSelectors,
    private _poiSelectors: PoiSelectors,
    private _googlePoiService: GooglePoiService,
    private _wikipediaPoiService: WikipediaPoiService,
    private _markerPopupService: MarkerPopupService
  ) {}

  public getDbObj(poi: IExternalPoi) {
    let _poiData = {};
    _.defaultsDeep(
      _poiData,
      _.pick(poi, ['elevation', 'lat', 'lon', 'objectType', 'description', 'types'])
    );

    if (poi.objectType.indexOf(EPoiTypes.google) >= 0) {
      this._getGoogleDbObj(_poiData, <IGooglePoi>poi);
    }
    if (poi.objectType.indexOf(EPoiTypes.wikipedia) >= 0) {
      this._getWikipediaDbObj(_poiData, <IWikipediaPoi>poi);
    }
    if (
      poi.objectType.indexOf(EPoiTypes.osmAmenity) >= 0 ||
      poi.objectType.indexOf(EPoiTypes.osmNatural) >= 0 ||
      poi.objectType.indexOf(EPoiTypes.osmRoute) >= 0
    ) {
      this._getOsmDbObj(_poiData, <IOsmPoi>poi);
    }

    return <IPoi>_poiData;
  }

  /**
   * getDbObj submethod
   */
  private _getGoogleDbObj(poiData: any, poi: IGooglePoi) {
    if (poi.google && poi.google.id) {
      _.merge(poiData, {
        objectId: {
          google: poi.google.id
        }
      });

      if (poi.google.formatted_address) {
        _.merge(poiData, {
          additionalData: {
            address: poi.google.formatted_address
          }
        });
      }

      if (poi.google.international_phone_number) {
        _.merge(poiData, {
          additionalData: {
            phoneNumber: poi.google.international_phone_number
          }
        });
      }

      if (poi.google.opening_hours) {
        _.merge(poiData, {
          additionalData: {
            openingHours: poi.google.opening_hours
          }
        });
      }
    }

    return poiData;
  }

  /**
   * getDbObj submethod
   */
  private _getWikipediaDbObj(poiData, poi: IWikipediaPoi) {
    if (poi.wikipedia && poi.wikipedia.pageid) {
      _.merge(poiData, {
        objectId: {
          wikipedia: {
            [<string>poi.wikipedia.lng]: poi.wikipedia.pageid
          }
        },
        additionalData: {
          wikipedia: {
            [<string>poi.wikipedia.lng]: {
              url: poi.wikipedia.url
            }
          }
        }
      });
    }
  }

  /**
   * getDbObj submethod
   */
  private _getOsmDbObj(poiData, poi: IOsmPoi) {
    _.merge(poiData, {
      objectId: {
        osm: poi.osm!.id
      }
    });
  }

  /**
   * Set the pois' onRoute property
   */
  public organizePois(
    pois: IExternalPoi[] | IGTrackPoi[],
    path: GeoJSON.Feature<GeoJSON.LineString>,
    isGTrackPoi: Boolean = false
  ) {
    let _pois: any[] = [];

    if (pois && pois.length > 0 && path) {
      const _smallBuffer = <GeoJSON.Feature<GeoJSON.Polygon>>turf.buffer(path, 50, {units: 'meters'});
      const _bigBuffer = <GeoJSON.Feature<GeoJSON.Polygon>>turf.buffer(path, 1000, {units: 'meters'});

      for (let p of _.cloneDeep(pois)) {
        let _point = turf.point([p.lon, p.lat]);

        if (typeof _smallBuffer !== 'undefined') {
          p.onRoute = turf.inside(_point, _smallBuffer);
        }

        if (typeof _bigBuffer !== 'undefined') {
          if (turf.inside(_point, _bigBuffer)) {
            p.distFromRoute = this._geometryService.distanceFromRoute(_point!.geometry!.coordinates, path);

            if (!isGTrackPoi) {
              this._handleTypes(<IExternalPoi>p);
            }

            _pois.push(p);
          }
        }
      }
    }

    return _pois;
  }

  /**
   * HikeEditPoi effect submethod - for gTrack pois
   */
  public handleHikeInclusion(pois: IGTrackPoi[]) {
    let _pois;

    this._store
      .select(this._editedHikeProgramSelectors.getPoiIds)
      .take(1)
      .subscribe((hikePoiIds: string[]) => {
        if (pois) {
          let _gTrackPois = _.cloneDeep(pois);
          _gTrackPois.map((_gTrackPoi: IGTrackPoi) => {
            _gTrackPoi.inHike = _.includes(hikePoiIds, _gTrackPoi.id);
          });
          _pois = _gTrackPois;
        } else {
          _pois = [];
        }
      });

    return _pois;
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

    _.forEach(poi.types, t => {
      if (_replaceTypesKeys.indexOf(t) >= 0) {
        _types.push(this._replaceTypes[t]);
      } else if (this._removedTypes.indexOf(t) < 0) {
        _types.push(t);
      }
    });

    if (_types.length === 0) {
      _types.push('unknown');
    }

    poi.types = _.uniq(_types);
  }

  /**
   * Set the selected flag on the service pois based on on/off route state
   */
  public assignOnOffRoutePois(pois: IExternalPoi[]) {
    let _pois = _.sortBy(_.cloneDeep(pois), (p: IExternalPoi) => p.distFromRoute);
    let _onRoutePois = this._getOnroutePois(_pois);
    let _offRoutePois = this._getOffroutePois(_pois);
    _.forEach(_onRoutePois, p => ((<any>p).selected = true));
    _.forEach(_offRoutePois, p => ((<any>p).selected = false));

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

    if (_chunks.length > 0) {
      return Observable.interval(100)
        .take(_chunks.length)
        .map(counter => {
          const _chunk: IExternalPoi[] = _chunks[counter];
          const _coordinates = _.map(_chunk, (p: IExternalPoi) => [p.lat, p.lon]);

          return this._elevationService.getData(_coordinates).then(data => {
            // Update elevation only if we got all data
            if (data.length === _chunk.length) {
              for (let i in _chunk) {
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
      } else {
        return Observable.of(_pois);
      }
  }

  public handlePoiDetails(pois, subdomain) {
    return new Promise((resolve) => {
      switch (subdomain) {
        case EPoiTypes.google:
          this._googlePoiService
            .getPoiDetails(pois)
            .then((detailedPois: IGooglePoi[]) => {
              resolve(detailedPois);
            });
          break;
        case EPoiTypes.wikipedia:
          this._wikipediaPoiService
            .getPoiDetails(pois)
            .then((detailedPois: IWikipediaPoi[]) => {
              resolve(detailedPois);
            });
          break;
        default:
          resolve(pois);
          break;
      }
    });
  }

  public getGTrackPois(map) {
    let _bounds = this._routePlannerService.getSearchBounds();
    let _geo: CenterRadius = this._geometryService.getCenterRadius(_bounds);
    let _centerCoord = _geo!.center!.geometry!.coordinates;

    if (_centerCoord) {
      this._store.dispatch(
        new commonGeoSearchActions.SearchInCircle(
          {
            table: 'pois',
            circle: {
              radius: _geo.radius,
              center: [_centerCoord[0], _centerCoord[1]]
            }
          },
          'gTrackPois'
        )
      );
    }
  }

  /**
   * Update inGtrackDb property on the given poi
   */
  public handleGTrackPois(pois: IGooglePoi[] | IWikipediaPoi[] | IOsmPoi[], gTrackPois: IGTrackPoi[]) {
    let _pois = _.cloneDeep(pois);

    for (let poi of _pois) {
      const _found = _.find(gTrackPois, (gTrackPoi: IGTrackPoi) => {
        let _idCheck = false;

        if (gTrackPoi.objectType === poi.objectType) {
          if ((<any>gTrackPoi).objectType.substring(0, 3) === 'osm') {
            _idCheck = gTrackPoi.objectId!.osm === (<IOsmPoi>poi).osm!.id;
          } else if (gTrackPoi.objectType === EPoiTypes.google) {
            _idCheck = gTrackPoi.objectId!.google === (<IGooglePoi>poi).google!.id;
          } else if (gTrackPoi.objectType === EPoiTypes.wikipedia) {
            _idCheck =
              gTrackPoi.objectId!.wikipedia[(<IWikipediaPoi>poi).wikipedia!.lng!] ===
              (<IWikipediaPoi>poi).wikipedia!.pageid;
          }

          return _idCheck;
        } else {
          return false;
        }
      });

      if (_found) {
        poi.inGtrackDb = true;
      } else {
        poi.inGtrackDb = false;
      }
    }

    return _pois;
  }

  /**
   * Update inCollector property on the given poi
   */
  public handleInCollectorPois(pois: IGooglePoi[] | IWikipediaPoi[] | IOsmPoi[], collectedPois: any[]) {
    let _pois = _.cloneDeep(pois);

    for (let poi of _pois) {
      const _found = _.find(collectedPois, (collectedPoi: any) => collectedPoi.id === poi.id);

      if (_found) {
        poi.inCollector = true;
      } else {
        poi.inCollector = false;
      }
    }

    return _pois;
  }

  public refreshPoiMarkers(map: AdminMap) {
    if (map) {
      let _pois: any[] = [];

      //
      // Hike pois
      //

      Observable
        .combineLatest(
          this._store.select(this._hikeEditPoiSelectors.getHikeEditPoiContextSelector('hike')).take(1),
          this._store.select(this._editedHikeProgramSelectors.getHikePois<IPoiStored>(this._poiSelectors.getAllPois)).take(1),
          this._store.select(this._hikeEditRoutePlannerSelectors.getPath).take(1)
        )
        .filter(([hikePoiContext, pois, path]: [IExternalPoiListContextItemState, IPoiStored[], any]) => {
          return (
            (pois && pois.length > 0 && path && (<any>hikePoiContext).showOnrouteMarkers) ||
            (<any>hikePoiContext).showOffrouteMarkers
          );
        })
        .switchMap(([hikePoiContext, pois, path]: [IExternalPoiListContextItemState, IPoiStored[], any]) => {
          return Observable.of([<any>hikePoiContext, this.organizePois(pois, path)]);
        })
        .subscribe(([hikePoiContext, pois]: [IExternalPoiListContextItemState, any[]]) => {
          _pois = _pois.concat(
            pois
              .map(p => _.assign(p, { markerType: 'hike' }))
              .filter(p => {
                let _onRouteCheck = p.onRoute ? hikePoiContext.showOnrouteMarkers : hikePoiContext.showOffrouteMarkers;
                return !p.inHike && _onRouteCheck;
              })
          );
        });

      //
      // gTrackPois
      //

      Observable
        .combineLatest(
          this._store.select(this._hikeEditPoiSelectors.getHikeEditPoiContextSelector('gTrack')).take(1),
          this._store
            .select(this._geoSearchSelectors.getGeoSearchResults<IPoiStored>('gTrackPois', this._poiSelectors.getAllPois))
            .take(1),
          this._store.select(this._hikeEditRoutePlannerSelectors.getPath).take(1)
        )
        .filter(([gTrackPoiContext, pois, path]: [IExternalPoiListContextItemState, IGTrackPoi[] | undefined, any]) => {
          return (
            (pois && pois.length > 0 && path && (<any>gTrackPoiContext).showOnrouteMarkers) ||
            (<any>gTrackPoiContext).showOffrouteMarkers
          );
        })
        .switchMap(
          ([gTrackPoiContext, pois, path]: [IExternalPoiListContextItemState, IGTrackPoi[] | undefined, any]) => {
            return Observable.of([<any>gTrackPoiContext, this.organizePois(<any>pois, path)]);
          }
        )
        .switchMap(([gTrackPoiContext, pois]: [IExternalPoiListContextItemState, IGTrackPoi[]]) => {
          return Observable.of([<any>gTrackPoiContext, this.handleHikeInclusion(pois)]);
        })
        .subscribe(([gTrackPoiContext, pois]: [IExternalPoiListContextItemState, any[]]) => {
          _pois = _pois.concat(
            pois
              .map(p => _.assign(p, { markerType: 'gTrack' }))
              .filter(p => {
                let _onRouteCheck = p.onRoute
                  ? gTrackPoiContext.showOnrouteMarkers
                  : gTrackPoiContext.showOffrouteMarkers;
                return !p.inHike && _onRouteCheck;
              })
          );
        });

      //
      // Service pois
      //

      this._getVisibleServicePois('collector', this._hikeEditPoiSelectors.getAllCollectorPois)
        .subscribe((pois: any[]) => {
          _pois = _pois.concat(pois.map(p => _.assign(_.cloneDeep(p), { markerType: 'collector' })));
        }
      );
      this._getVisibleServicePois(EPoiTypes.google, this._hikeEditPoiSelectors.getAllGooglePois)
        .subscribe((pois: IExternalPoi[]) => {
          _pois = _pois.concat(
            pois
              .map(p => _.assign(_.cloneDeep(p), { markerType: EPoiTypes.google }))
              .filter(p => !p.inCollector)
          );
        }
      );
      this._getVisibleServicePois(EPoiTypes.osmAmenity, this._hikeEditPoiSelectors.getAllOsmAmenityPois)
        .subscribe((pois: IExternalPoi[]) => {
          _pois = _pois.concat(
            pois
              .map(p => _.assign(_.cloneDeep(p), { markerType: EPoiTypes.osmAmenity }))
              .filter(p => !p.inCollector)
          );
        }
      );
      this._getVisibleServicePois(EPoiTypes.osmNatural, this._hikeEditPoiSelectors.getAllOsmNaturalPois)
        .subscribe((pois: IExternalPoi[]) => {
          _pois = _pois.concat(
            pois
              .map(p => _.assign(_.cloneDeep(p), { markerType: EPoiTypes.osmNatural }))
              .filter(p => !p.inCollector)
          );
        }
      );
      this._getVisibleServicePois(EPoiTypes.osmRoute, this._hikeEditPoiSelectors.getAllOsmRoutePois)
        .subscribe((pois: IExternalPoi[]) => {
          _pois = _pois.concat(
            pois
              .map(p => _.assign(_.cloneDeep(p), { markerType: EPoiTypes.osmRoute }))
              .filter(p => !p.inCollector)
          );
        }
      );
      this._getVisibleServicePois(EPoiTypes.wikipedia, this._hikeEditPoiSelectors.getAllWikipediaPois)
        .subscribe((pois: IExternalPoi[]) => {
          _pois = _pois.concat(
            pois
              .map(p => _.assign(_.cloneDeep(p), { markerType: EPoiTypes.wikipedia }))
              .filter(p => !p.inCollector)
          );
        }
      );

      //
      // Generate markers
      //

      const _markers = this._generatePoiMarkers(_pois, map);

      map.overlappingMarkerSpiderfier = new OverlappingMarkerSpiderfier(map.leafletMap, {
        keepSpiderfied: true
      });

      if (map.leafletMap.hasLayer(map.markersGroup)) {
        map.leafletMap.removeLayer(map.markersGroup);
      }

      if (_markers.length > 0) {
        // Add markers to group
        map.markersGroup = L.layerGroup(_.map(_markers, 'marker'));
        map.leafletMap.addLayer(map.markersGroup);

        // Register marker to spiderfier
        for (let _marker of _markers) {
          map.overlappingMarkerSpiderfier.addMarker(_marker.marker);
        }

        // Currently unused
        // map.overlappingMarkerSpiderfier.addListener('click', function(marker) {
        //   console.log('spiderify clic');
        // });
        // map.overlappingMarkerSpiderfier.addListener('spiderfy', function(marker) {
        //   console.log('spiderify spiderfy');
        // });
      }
    }
  }

  /**
   * refreshPoiMarkers submethod
   */
  private _getVisibleServicePois(subdomain, poiSelector) {
    return Observable.combineLatest(
      this._store.select(this._hikeEditPoiSelectors.getHikeEditPoiContextSelector(subdomain)).take(1),
      this._store.select(poiSelector).take(1)
    ).map(([poiContext, pois]: [IExternalPoiListContextItemState, IExternalPoi[]]) => {
      if (poiContext.showOnrouteMarkers || poiContext.showOffrouteMarkers) {
        return pois.filter(p => {
          let _onRouteCheck = p.onRoute ? poiContext.showOnrouteMarkers : poiContext.showOffrouteMarkers;
          return !p.inGtrackDb && _onRouteCheck;
        });
      } else {
        return [];
      }
    });
  }

  /**
   * refreshPoiMarkers submethod
   */
  private _generatePoiMarkers(pois, map: AdminMap) {
    const _markers: AdminMapMarker[] = [];

    for (let poi of pois) {
      const popupData: IMarkerPopupData = {
        popupComponentName: 'AdminMarkerPopupComponent',
        markerClickCallback: this._markerPopupService.onUserMarkerClick,
        closeCallback: () => {
          map.leafletMap.closePopup();
          this.refreshPoiMarkers(map);
        },
        map: map.leafletMap,
        data: _.cloneDeep(poi),
      }
      const _marker = new AdminMapMarker(
        poi.lat,
        poi.lon,
        poi.types || [],
        '',
        this._iconService,
        poi.id,
        popupData
      );
      _markers.push(_marker);
    }

    return _markers;
  }
}
