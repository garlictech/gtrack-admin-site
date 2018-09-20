import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, switchMap, filter, map as rxMap } from 'rxjs/operators';
import {
  GeometryService,
  ElevationService,
  IconService,
  CenterRadius,
  GeoSearchSelectors,
  PoiSelectors
} from 'subrepos/gtrack-common-ngx';
import { IPoi, IPoiStored, EPoiTypes } from 'subrepos/provider-client';
import { State, IExternalPoiListContextItemState } from '../../../store';
import { commonGeoSearchActions } from '../../../store/actions';
import {
  HikeEditPoiSelectors,
  HikeEditRoutePlannerSelectors,
  EditedHikeProgramSelectors,
  HikeEditImageSelectors
} from '../../../store/selectors';
import { AdminMap, AdminMapMarker, RoutePlannerService } from '../admin-map';
import { IExternalPoi, IWikipediaPoi, IGooglePoi, IOsmPoi, IGTrackPoi } from '../../interfaces';
import { GooglePoiService } from './google-poi.service';
import { WikipediaPoiService } from './wikipedia-poi.service';
import { IMarkerPopupData, IBackgroundImageData } from 'subrepos/provider-client/interfaces';
import { MarkerPopupService } from 'subrepos/gtrack-common-ngx/app/map/services/map-marker/marker-popup.service';

import * as L from 'leaflet';
import 'overlapping-marker-spiderfier-leaflet';
import _defaultsDeep from 'lodash-es/defaultsDeep';
import _pick from 'lodash-es/pick';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';
import _forEach from 'lodash-es/forEach';
import _uniq from 'lodash-es/uniq';
import _includes from 'lodash-es/includes';
import _keys from 'lodash-es/keys';
import _chunk from 'lodash-es/chunk';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _assign from 'lodash-es/assign';
import _map from 'lodash-es/map';
import _sortBy from 'lodash-es/sortBy';

import turfBuffer from '@turf/buffer';
import { point as turfPoint } from '@turf/helpers';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';

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
    private _markerPopupService: MarkerPopupService,
    private _hikeEditImageSelectors: HikeEditImageSelectors,
  ) {}

  public getDbObj(poi: IExternalPoi) {
    const _poiData = {};
    _defaultsDeep(
      _poiData,
      _pick(poi, ['elevation', 'lat', 'lon', 'objectType', 'description', 'types'])
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
      _merge(poiData, {
        objectId: {
          google: poi.google.id
        }
      });

      if (poi.google.formatted_address) {
        _merge(poiData, {
          additionalData: {
            address: poi.google.formatted_address
          }
        });
      }

      if (poi.google.international_phone_number) {
        _merge(poiData, {
          additionalData: {
            phoneNumber: poi.google.international_phone_number
          }
        });
      }

      if (poi.google.opening_hours) {
        _merge(poiData, {
          additionalData: {
            openingHours: poi.google.opening_hours
          }
        });
      }

      if (poi.google.photos) {
        _merge(poiData, {
          additionalData: {
            photos: poi.google.photos
          }
        });
      }
    }
  }

  /**
   * getDbObj submethod
   */
  private _getWikipediaDbObj(poiData, poi: IWikipediaPoi) {
    if (poi.wikipedia && poi.wikipedia.pageid) {
      _merge(poiData, {
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

      if (poi.wikipedia.photos) {
        _merge(poiData, {
          additionalData: {
            photos: poi.wikipedia.photos
          }
        });
      }
    }
  }

  /**
   * getDbObj submethod
   */
  private _getOsmDbObj(poiData, poi: IOsmPoi) {
    _merge(poiData, {
      objectId: {
        osm: poi.osm.id
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
    const _pois: any[] = [];

    if (pois && pois.length > 0 && path) {
      const _smallBuffer = <GeoJSON.Feature<GeoJSON.Polygon>>turfBuffer(path, 50, {units: 'meters'});
      const _bigBuffer = <GeoJSON.Feature<GeoJSON.Polygon>>turfBuffer(path, 1000, {units: 'meters'});

      for (const p of _cloneDeep(pois)) {
        const _point = turfPoint([p.lon, p.lat]);

        if (typeof _smallBuffer !== 'undefined') {
          p.onRoute = turfBooleanPointInPolygon(_point, _smallBuffer);
        }

        if (typeof _bigBuffer !== 'undefined') {
          if (turfBooleanPointInPolygon(_point, _bigBuffer)) {
            p.distFromRoute = this._geometryService.distanceFromRoute(_point.geometry.coordinates, path);

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
      .pipe(
        select(this._editedHikeProgramSelectors.getPoiIds),
        take(1)
      )
      .subscribe((hikePoiIds: string[]) => {
        if (pois) {
          const _gTrackPois = _cloneDeep(pois);
          _gTrackPois.map((_gTrackPoi: IGTrackPoi) => {
            _gTrackPoi.inHike = _includes(hikePoiIds, _gTrackPoi.id);
          });
          _pois = _gTrackPois;
        } else {
          _pois = [];
        }
      });

    return _pois;
  }

  private _getOnroutePois(pois: IExternalPoi[]) {
    return _filter(pois, (p: IExternalPoi) => p.onRoute);
  }

  private _getOffroutePois(pois: IExternalPoi[]) {
    return _filter(pois, (p: IExternalPoi) => !p.onRoute);
  }

  /**
   * organizePois submethod
   */
  private _handleTypes(poi: IExternalPoi) {
    const _types: string[] = [];
    const _replaceTypesKeys = _keys(this._replaceTypes);

    _forEach(poi.types, t => {
      if (_replaceTypesKeys.indexOf(t) >= 0) {
        _types.push(this._replaceTypes[t]);
      } else if (this._removedTypes.indexOf(t) < 0) {
        _types.push(t);
      }
    });

    if (_types.length === 0) {
      _types.push('unknown');
    }

    poi.types = _uniq(_types);
  }

  /**
   * Set the selected flag on the service pois based on on/off route state
   */
  public assignOnOffRoutePois(pois: IExternalPoi[]) {
    const _pois = _sortBy(_cloneDeep(pois), (p: IExternalPoi) => p.distFromRoute);
    const _onRoutePois = this._getOnroutePois(_pois);
    const _offRoutePois = this._getOffroutePois(_pois);
    _forEach(_onRoutePois, p => ((<any>p).selected = true));
    _forEach(_offRoutePois, p => ((<any>p).selected = false));

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
    const _pois = _cloneDeep(pois);
    const _poisWithoutElevation = _filter(_pois, (p: IExternalPoi) => !p.elevation);
    const _chunks: IExternalPoi[][] = _chunk(_poisWithoutElevation, 500);

    if (_chunks.length > 0) {
      return Observable
        .interval(100)
        .take(_chunks.length)
        .map(counter => {
          const _chunkedPois: IExternalPoi[] = _chunks[counter];
          const _coordinates = _map(_chunkedPois, (p: IExternalPoi) => [p.lat, p.lon]);

          return this._elevationService.getData(_coordinates).then(data => {
            // Update elevation only if we got all data
            if (data.length === _chunkedPois.length) {
              for (const i in _chunkedPois) {
                if (_chunkedPois[i]) {
                  _chunkedPois[i].elevation = data[i][2];
                }
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

  public getGTrackPois() {
    const _bounds = this._routePlannerService.getSearchBounds();
    const _geo: CenterRadius = this._geometryService.getCenterRadius(_bounds);
    const _centerCoord = _geo.center.geometry.coordinates;

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
    const _pois = _cloneDeep(pois);

    for (const poi of _pois) {
      const _found = _find(gTrackPois, (gTrackPoi: IGTrackPoi) => {
        let _idCheck = false;

        if (gTrackPoi.objectType === poi.objectType) {
          if ((<any>gTrackPoi).objectType.substring(0, 3) === 'osm') {
            _idCheck = gTrackPoi.objectId.osm === (<IOsmPoi>poi).osm.id;
          } else if (gTrackPoi.objectType === EPoiTypes.google) {
            _idCheck = gTrackPoi.objectId.google === (<IGooglePoi>poi).google.id;
          } else if (gTrackPoi.objectType === EPoiTypes.wikipedia) {
            _idCheck =
              gTrackPoi.objectId.wikipedia[(<IWikipediaPoi>poi).wikipedia.lng] ===
              (<IWikipediaPoi>poi).wikipedia.pageid;
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
    const _pois = _cloneDeep(pois);

    for (const poi of _pois) {
      const _found = _find(collectedPois, (collectedPoi: any) => collectedPoi.id === poi.id);

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
          this._store.pipe(
            select(this._hikeEditPoiSelectors.getHikeEditPoiContextSelector('hike')),
            take(1)
          ),
          this._store.pipe(
            select(this._editedHikeProgramSelectors.getHikePois(this._poiSelectors.getAllPois)),
            take(1)
          ),
          this._store.pipe(
            select(this._hikeEditRoutePlannerSelectors.getPath),
            take(1)
          )
        )
        .pipe(
          filter(([hikePoiContext, pois, path]: [IExternalPoiListContextItemState, IPoiStored[], any]) => {
            return (
              (pois && pois.length > 0 && path && (<any>hikePoiContext).showOnrouteMarkers) ||
              (<any>hikePoiContext).showOffrouteMarkers
            );
          }),
          switchMap(([hikePoiContext, pois, path]: [IExternalPoiListContextItemState, IPoiStored[], any]) => {
            return Observable.of([<any>hikePoiContext, this.organizePois(pois, path)]);
          })
        )
        .subscribe(([hikePoiContext, pois]: [IExternalPoiListContextItemState, any[]]) => {
          _pois = _pois.concat(
            pois
              .map(p => _assign(p, { markerType: 'hike' }))
              .filter(p => {
                const _onRouteCheck = p.onRoute ? hikePoiContext.showOnrouteMarkers : hikePoiContext.showOffrouteMarkers;
                return !p.inHike && _onRouteCheck;
              })
          );
        });

      //
      // gTrackPois
      //

      Observable
        .combineLatest(
          this._store.pipe(
            select(this._hikeEditPoiSelectors.getHikeEditPoiContextSelector('gTrack')),
            take(1)
          ),
          this._store.pipe(
            select(this._geoSearchSelectors.getGeoSearchResults<IPoiStored>('gTrackPois', this._poiSelectors.getAllPois)),
            take(1)
          ),
          this._store.pipe(
            select(this._hikeEditRoutePlannerSelectors.getPath),
            take(1)
          )
        )
        .pipe(
          filter(([gTrackPoiContext, pois, path]: [IExternalPoiListContextItemState, IGTrackPoi[] | undefined, any]) => {
            return (
              (pois && pois.length > 0 && path && (<any>gTrackPoiContext).showOnrouteMarkers) ||
              (<any>gTrackPoiContext).showOffrouteMarkers
            );
          }),
          switchMap(
            ([gTrackPoiContext, pois, path]: [IExternalPoiListContextItemState, IGTrackPoi[] | undefined, any]) => {
              return Observable.of([<any>gTrackPoiContext, this.organizePois(<any>pois, path)]);
            }
          ),
          switchMap(([gTrackPoiContext, pois]: [IExternalPoiListContextItemState, IGTrackPoi[]]) => {
            return Observable.of([<any>gTrackPoiContext, this.handleHikeInclusion(pois)]);
          })
        )
        .subscribe(([gTrackPoiContext, pois]: [IExternalPoiListContextItemState, any[]]) => {
          _pois = _pois.concat(
            pois
              .map(p => _assign(p, { markerType: 'gTrack' }))
              .filter(p => {
                const _onRouteCheck = p.onRoute
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
          _pois = _pois.concat(pois.map(p => _assign(_cloneDeep(p), { markerType: 'collector' })));
        }
      );
      this._getVisibleServicePois(EPoiTypes.google, this._hikeEditPoiSelectors.getAllGooglePois)
        .subscribe((pois: IExternalPoi[]) => {
          _pois = _pois.concat(
            pois
              .map(p => _assign(_cloneDeep(p), { markerType: EPoiTypes.google }))
              .filter(p => !p.inCollector)
          );
        }
      );
      this._getVisibleServicePois(EPoiTypes.osmAmenity, this._hikeEditPoiSelectors.getAllOsmAmenityPois)
        .subscribe((pois: IExternalPoi[]) => {
          _pois = _pois.concat(
            pois
              .map(p => _assign(_cloneDeep(p), { markerType: EPoiTypes.osmAmenity }))
              .filter(p => !p.inCollector)
          );
        }
      );
      this._getVisibleServicePois(EPoiTypes.osmNatural, this._hikeEditPoiSelectors.getAllOsmNaturalPois)
        .subscribe((pois: IExternalPoi[]) => {
          _pois = _pois.concat(
            pois
              .map(p => _assign(_cloneDeep(p), { markerType: EPoiTypes.osmNatural }))
              .filter(p => !p.inCollector)
          );
        }
      );
      this._getVisibleServicePois(EPoiTypes.osmRoute, this._hikeEditPoiSelectors.getAllOsmRoutePois)
        .subscribe((pois: IExternalPoi[]) => {
          _pois = _pois.concat(
            pois
              .map(p => _assign(_cloneDeep(p), { markerType: EPoiTypes.osmRoute }))
              .filter(p => !p.inCollector)
          );
        }
      );
      this._getVisibleServicePois(EPoiTypes.wikipedia, this._hikeEditPoiSelectors.getAllWikipediaPois)
        .subscribe((pois: IExternalPoi[]) => {
          _pois = _pois.concat(
            pois
              .map(p => _assign(_cloneDeep(p), { markerType: EPoiTypes.wikipedia }))
              .filter(p => !p.inCollector)
          );
        }
      );

      // Generate poi markers

      const _poiMarkers = this._generatePoiMarkers(_pois, map);
      const _imageMarkers = this._generateImageMarkers(map);
      const _markers = _poiMarkers.concat(_imageMarkers);

      // Add markers to the map

      map.overlappingMarkerSpiderfier = new OverlappingMarkerSpiderfier(map.leafletMap, {
        keepSpiderfied: true
      });

      if (map.leafletMap.hasLayer(map.markersGroup)) {
        map.leafletMap.removeLayer(map.markersGroup);
      }

      if (_markers.length > 0) {
        // Add markers to group
        map.markersGroup = L.layerGroup(_map(_markers, 'marker'));
        map.leafletMap.addLayer(map.markersGroup);

        // Register marker to spiderfier
        for (const _marker of _markers) {
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
      this._store.pipe(
        select(this._hikeEditPoiSelectors.getHikeEditPoiContextSelector(subdomain)),
        take(1)
      ),
      this._store.pipe(
        select(poiSelector),
        take(1)
      )
    )
    .pipe(
      rxMap(([poiContext, pois]: [IExternalPoiListContextItemState, IExternalPoi[]]) => {
        if (poiContext.showOnrouteMarkers || poiContext.showOffrouteMarkers) {
          return pois.filter(p => {
            const _onRouteCheck = p.onRoute ? poiContext.showOnrouteMarkers : poiContext.showOffrouteMarkers;
            return !p.inGtrackDb && _onRouteCheck;
          });
        } else {
          return [];
        }
      })
    );
  }

  /**
   * refreshPoiMarkers submethod
   */
  private _generatePoiMarkers(pois, map: AdminMap) {
    const _markers: AdminMapMarker[] = [];

    for (const poi of pois) {
      const popupData: IMarkerPopupData = {
        popupComponentName: 'AdminMarkerPopupComponent',
        markerClickCallback: this._markerPopupService.onUserMarkerClick,
        closeCallback: () => {
          map.leafletMap.closePopup();
          this.refreshPoiMarkers(map);
        },
        map: map.leafletMap,
        data: _cloneDeep(poi),
      };

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

  private _generateImageMarkers(map: AdminMap) {
    const _markers: AdminMapMarker[] = [];

    this._store
      .pipe(
        select(this._hikeEditImageSelectors.getImageMarkerUrls),
        take(1)
      )
      .subscribe((images: IBackgroundImageData[]) => {
        for (const image of images) {
          const popupData: IMarkerPopupData = {
            popupComponentName: 'ImageMarkerPopupComponent',
            markerClickCallback: this._markerPopupService.onUserMarkerClick,
            closeCallback: () => {
              map.leafletMap.closePopup();
              this.refreshPoiMarkers(map);
            },
            map: map.leafletMap,
            data: _cloneDeep(image),
          };

          const _marker = new AdminMapMarker(
            image.lat,
            image.lon,
            ['photo'],
            '',
            this._iconService,
            image.original.url,
            popupData
          );
          _markers.push(_marker);
        }
      });

    return _markers;
  }
}
