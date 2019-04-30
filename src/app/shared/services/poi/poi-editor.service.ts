import { BIG_BUFFER_SIZE, SMALL_BUFFER_SIZE } from 'app/config';
import * as L from 'leaflet';
import _assign from 'lodash-es/assign';
import _chunk from 'lodash-es/chunk';
import _cloneDeep from 'lodash-es/cloneDeep';
import _defaultsDeep from 'lodash-es/defaultsDeep';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _forEach from 'lodash-es/forEach';
import _includes from 'lodash-es/includes';
import _intersection from 'lodash-es/intersection';
import _keys from 'lodash-es/keys';
import _map from 'lodash-es/map';
import _merge from 'lodash-es/merge';
import _pick from 'lodash-es/pick';
import _sortBy from 'lodash-es/sortBy';
import _uniq from 'lodash-es/uniq';
import { combineLatest, interval, Observable, of } from 'rxjs';
import { combineAll, debounceTime, filter, map as rxMap, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ElevationService } from '@bit/garlictech.angular-features.common.elevation';
import { CenterRadius, GeometryService } from '@bit/garlictech.angular-features.common.geometry';
import { GeoSearchSelectors } from '@bit/garlictech.angular-features.common.geosearch';
import { GeospatialService } from '@bit/garlictech.angular-features.common.geospatial';
import {
  BackgroundImageData,
  EPoiTypes,
  MarkerPopupData,
  PoiData,
  PoiStored
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import {
  LeafletMapMarkerService,
  LeafletMapService,
  LeafletMarkerPopupService
} from '@bit/garlictech.angular-features.common.leaflet-map/services';
import { EMarkerType } from '@bit/garlictech.angular-features.common.leaflet-map/interfaces';
import { LeafletMapMarker } from '@bit/garlictech.angular-features.common.leaflet-map/services/lib';
import { PoiSelectors } from '@bit/garlictech.angular-features.common.poi';
import { select, Store } from '@ngrx/store';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import turfBuffer from '@turf/buffer';
import { point as turfPoint } from '@turf/helpers';

import { ExternalPoiListContextItemState, State } from '../../../store';
import { commonGeoSearchActions } from '../../../store/actions';
import * as editedHikeProgramSelectors from '../../../store/selectors/edited-hike-program';
import * as hikeEditImageSelectors from '../../../store/selectors/hike-edit-image';
import * as hikeEditPoiSelectors from '../../../store/selectors/hike-edit-poi';
import * as hikeEditRoutePlannerSelectors from '../../../store/selectors/hike-edit-route-planner';
import { ExternalPoi, GooglePoi, GTrackPoi, OsmPoi, WikipediaPoi } from '../../interfaces';
import { RoutePlannerService } from '../admin-map';
import { GooglePoiService } from './google-poi.service';
import { WikipediaPoiService } from './wikipedia-poi.service';

type ExternalPois = Array<GooglePoi> | Array<WikipediaPoi> | Array<OsmPoi>;

/**
 * getDbObj submethod
 */
const _getGoogleDbObj = (poiData: any, poi: GooglePoi): void => {
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
};

/**
 * getDbObj submethod
 */
const _getWikipediaDbObj = (poiData, poi: WikipediaPoi): void => {
  if (poi.wikipedia && poi.wikipedia.pageid) {
    _merge(poiData, {
      objectId: {
        wikipedia: {
          [poi.wikipedia.lng]: poi.wikipedia.pageid
        }
      },
      additionalData: {
        wikipedia: {
          [poi.wikipedia.lng]: {
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
};

/**
 * getDbObj submethod
 */
const _getOsmDbObj = (poiData, poi: OsmPoi): void => {
  _merge(poiData, {
    objectId: {
      osm: poi.osm.id
    }
  });
};

const _getOnroutePois = (pois: Array<ExternalPoi>): Array<ExternalPoi> => _filter(pois, (p: ExternalPoi) => p.onRoute);

const _getOffroutePois = (pois: Array<ExternalPoi>): Array<ExternalPoi> =>
  _filter(pois, (p: ExternalPoi) => !p.onRoute);

@Injectable()
export class PoiEditorService {
  private _markersGroup: L.LayerGroup;
  private readonly _removedTypes: Array<string>;
  private readonly _replaceTypes: any;

  constructor(
    private readonly _store: Store<State>,
    private readonly _geometryService: GeometryService,
    private readonly _geospatialService: GeospatialService,
    private readonly _routePlannerService: RoutePlannerService,
    private readonly _elevationService: ElevationService,
    private readonly _leafletMapMarkerService: LeafletMapMarkerService,
    private readonly _geoSearchSelectors: GeoSearchSelectors,
    private readonly _poiSelectors: PoiSelectors,
    private readonly _googlePoiService: GooglePoiService,
    private readonly _wikipediaPoiService: WikipediaPoiService,
    private readonly _markerPopupService: LeafletMarkerPopupService,
    private readonly _leafletMapService: LeafletMapService
  ) {
    this._removedTypes = ['political', 'point_of_interest', 'establishment'];
    this._replaceTypes = {
      gas_station: 'fuel',
      grocery_or_supermarket: 'store',
      food: 'restaurant'
    };
  }

  getDbObj(poi: ExternalPoi): PoiData {
    const _poiData = {};
    _defaultsDeep(_poiData, _pick(poi, ['id', 'lat', 'lon', 'elevation', 'objectTypes', 'description', 'types']));

    if (poi.objectTypes.indexOf(EPoiTypes.google) >= 0) {
      _getGoogleDbObj(_poiData, poi as GooglePoi);
    }
    if (poi.objectTypes.indexOf(EPoiTypes.wikipedia) >= 0) {
      _getWikipediaDbObj(_poiData, poi as WikipediaPoi);
    }
    if (
      poi.objectTypes.indexOf(EPoiTypes.osmAmenity) >= 0 ||
      poi.objectTypes.indexOf(EPoiTypes.osmNatural) >= 0 ||
      poi.objectTypes.indexOf(EPoiTypes.osmRoute) >= 0
    ) {
      _getOsmDbObj(_poiData, poi as OsmPoi);
    }

    return _poiData as PoiData;
  }

  /**
   * WikipediaPoi
   * Set the pois' onRoute property
   */
  organizePois(
    pois: Array<ExternalPoi> | Array<GTrackPoi>,
    path: GeoJSON.Feature<GeoJSON.LineString>,
    forceAdd = false
  ): Array<ExternalPoi> | Array<GTrackPoi> {
    const _pois: Array<any> = [];

    if (pois && pois.length > 0 && path) {
      const _smallBuffer = turfBuffer(path, SMALL_BUFFER_SIZE, { units: 'meters' }) as GeoJSON.Feature<GeoJSON.Polygon>;
      const _bigBuffer = turfBuffer(path, BIG_BUFFER_SIZE, { units: 'meters' }) as GeoJSON.Feature<GeoJSON.Polygon>;

      for (const p of _cloneDeep(pois)) {
        const _point = turfPoint([p.lon, p.lat]);

        if (typeof _bigBuffer !== 'undefined' && (turfBooleanPointInPolygon(_point, _bigBuffer) || forceAdd)) {
          if (typeof _smallBuffer !== 'undefined') {
            p.onRoute = turfBooleanPointInPolygon(_point, _smallBuffer);
          }
          p.distFromRoute = this._geometryService.distanceFromRoute(_point.geometry.coordinates, path);

          this._handleTypes(p as ExternalPoi);

          _pois.push(p);
        }
      }
    }

    return _pois;
  }

  /**
   * Filter poi photos based on their distance from the path
   */
  organizePoiPhotos(
    photos: Array<BackgroundImageData>,
    path: GeoJSON.Feature<GeoJSON.LineString>
  ): Array<BackgroundImageData> {
    const _photos: Array<any> = [];

    if (photos && photos.length > 0 && path) {
      const _smallBuffer = turfBuffer(path, SMALL_BUFFER_SIZE, { units: 'meters' }) as GeoJSON.Feature<GeoJSON.Polygon>;
      const _bigBuffer = turfBuffer(path, BIG_BUFFER_SIZE, { units: 'meters' }) as GeoJSON.Feature<GeoJSON.Polygon>;

      for (const _photo of _cloneDeep(photos)) {
        const _point = turfPoint([_photo.lon, _photo.lat]);

        if (typeof _bigBuffer !== 'undefined' && turfBooleanPointInPolygon(_point, _bigBuffer)) {
          if (typeof _smallBuffer !== 'undefined') {
            (_photo as any).onRoute = turfBooleanPointInPolygon(_point, _smallBuffer);
          }
          _photos.push(_photo);
        }
      }
    }

    return _photos;
  }

  /**
   * HikeEditPoi effect submethod - for gTrack pois
   */
  handleHikeInclusion(pois: Array<GTrackPoi>): Array<GTrackPoi> {
    let _pois;

    this._store
      .pipe(
        select(editedHikeProgramSelectors.getPoiIds),
        take(1)
      )
      .subscribe((hikePoiIds: Array<string>) => {
        if (pois) {
          const _gTrackPois = _cloneDeep(pois);
          _gTrackPois.forEach((_gTrackPoi: GTrackPoi) => {
            _gTrackPoi.inHike = _includes(hikePoiIds, _gTrackPoi.id);
          });
          _pois = _gTrackPois;
        } else {
          _pois = [];
        }
      });

    return _pois;
  }

  /**
   * Update gTrackPois DistanceFromOrigo value
   */
  getGTrackPoiDistanceFromOrigo(pois: Array<GTrackPoi>, path: GeoJSON.Feature<GeoJSON.LineString>): Array<GTrackPoi> {
    if (pois.length > 0 && path && path.geometry && path.geometry.coordinates.length > 0) {
      for (const poi of pois) {
        poi.distFromOrigo = this._geospatialService.distanceOnLine(
          path.geometry.coordinates[0],
          [poi.lon, poi.lat],
          path
        );
      }
    }

    return pois;
  }

  /**
   * Set the selected flag on the service pois based on on/off route state
   */
  assignOnOffRoutePois(pois: Array<ExternalPoi>): Observable<Array<ExternalPoi>> {
    const _pois = _sortBy(_cloneDeep(pois), (p: ExternalPoi) => p.distFromRoute);
    const _onRoutePois = _getOnroutePois(_pois);
    const _offRoutePois = _getOffroutePois(_pois);
    _forEach(_onRoutePois, p => ((p as any).selected = true));
    _forEach(_offRoutePois, p => ((p as any).selected = false));

    return of(_pois);
  }

  /**
   * Get elevation data for pois
   */
  handleElevation(pois: Array<ExternalPoi>): Observable<Array<ExternalPoi>> {
    // Google Elevation Service
    // 2,500 free requests per day
    // 512 locations per request.
    // 50 requests per second
    const _pois = _cloneDeep(pois);
    const _poisWithoutElevation = _filter(_pois, (p: ExternalPoi) => !p.elevation);
    const _chunks: Array<Array<ExternalPoi>> = _chunk(_poisWithoutElevation, 500);

    if (_chunks.length > 0) {
      return interval(100).pipe(
        take(_chunks.length),
        rxMap(async counter => {
          const _chunkedPois: Array<ExternalPoi> = _chunks[counter];
          const _coordinates = _map(_chunkedPois, (p: ExternalPoi) => [p.lat, p.lon]);

          return this._elevationService.getData(_coordinates).then(data => {
            // Update elevation only if we got all data
            if (data.length === _chunkedPois.length) {
              _chunkedPois.forEach((_chunkedPoi, i) => {
                _chunkedPoi.elevation = data[i][2];
              });
            }

            return of(counter);
          });
        }),
        combineAll(),
        rxMap(() => _pois)
      );
    } else {
      return of(_pois);
    }
  }

  async handlePoiDetails(pois: Array<ExternalPoi>, subdomain: EPoiTypes): Promise<any> {
    return new Promise(resolve => {
      switch (subdomain) {
        case EPoiTypes.google:
          this._googlePoiService.getPoiDetails(pois).then(
            (detailedPois: Array<GooglePoi>) => {
              resolve(detailedPois);
            },
            () => {
              /**/
            }
          );
          break;
        case EPoiTypes.wikipedia:
          this._wikipediaPoiService.getPoiDetails(pois).then(
            (detailedPois: Array<WikipediaPoi>) => {
              resolve(detailedPois);
            },
            () => {
              /**/
            }
          );
          break;
        default:
          resolve(pois);
          break;
      }
    });
  }

  getGTrackPois(): void {
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
  handleGTrackPois(pois: ExternalPois, gTrackPois: Array<GTrackPoi>): ExternalPois {
    const _pois = _cloneDeep(pois);

    for (const poi of _pois) {
      const _found = _find(gTrackPois, (gTrackPoi: GTrackPoi) => {
        let _idCheck = false;

        const _commonObjectTypes = _intersection(
          Array.isArray(gTrackPoi.objectTypes) ? gTrackPoi.objectTypes : [gTrackPoi.objectTypes],
          Array.isArray(poi.objectTypes) ? poi.objectTypes : [poi.objectTypes]
        );

        if (_commonObjectTypes.length > 0) {
          for (const objectType of _commonObjectTypes) {
            if (objectType.substring(0, 3) === 'osm') {
              _idCheck = gTrackPoi.objectId.osm === (poi as OsmPoi).osm.id ? true : _idCheck;
            } else if (objectType === EPoiTypes.google) {
              _idCheck = gTrackPoi.objectId.google === (poi as GooglePoi).google.id ? true : _idCheck;
            } else if (objectType === EPoiTypes.wikipedia) {
              _idCheck =
                gTrackPoi.objectId.wikipedia[(poi as WikipediaPoi).wikipedia.lng] ===
                (poi as WikipediaPoi).wikipedia.pageid
                  ? true
                  : _idCheck;
            }

            if (_idCheck) {
              break;
            }
          }
        }

        return _idCheck;
      });

      poi.inGtrackDb = typeof _found !== 'undefined';
    }

    return _pois;
  }

  /**
   * Update inCollector property on the given poi
   */
  handleInCollectorPois(
    pois: Array<GooglePoi> | Array<WikipediaPoi> | Array<OsmPoi>,
    collectedPois: Array<any>
  ): Array<GooglePoi> | Array<WikipediaPoi> | Array<OsmPoi> {
    const _pois = _cloneDeep(pois);

    for (const poi of _pois) {
      const _found = _find(collectedPois, (collectedPoi: any) => collectedPoi.id === poi.id);

      poi.inCollector = typeof _found !== 'undefined';
    }

    return _pois;
  }

  refreshPoiMarkers(): void {
    let _pois: Array<any> = [];

    //
    // Hike pois
    //

    combineLatest(
      this._store.pipe(
        select(hikeEditPoiSelectors.getHikeEditPoiContextSelector('hike')),
        take(1)
      ),
      this._store.pipe(
        select(editedHikeProgramSelectors.getHikePois(this._poiSelectors.getAllPois)),
        take(1)
      ),
      this._store.pipe(
        select(hikeEditRoutePlannerSelectors.getPath),
        take(1)
      )
    )
      .pipe(
        debounceTime(250),
        filter(
          ([hikePoiContext, pois, path]: [ExternalPoiListContextItemState, Array<PoiStored>, any]) =>
            (pois && pois.length > 0 && path && (hikePoiContext as any).showOnrouteMarkers) ||
            (hikePoiContext as any).showOffrouteMarkers
        ),
        switchMap(([hikePoiContext, pois, path]: [ExternalPoiListContextItemState, Array<PoiStored>, any]) =>
          of([hikePoiContext as any, this.organizePois(pois, path)])
        )
      )
      .subscribe(([hikePoiContext, pois]: [ExternalPoiListContextItemState, Array<any>]) => {
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

    combineLatest(
      this._store.pipe(
        select(hikeEditPoiSelectors.getHikeEditPoiContextSelector('gTrack')),
        take(1)
      ),
      this._store.pipe(
        select(this._geoSearchSelectors.getGeoSearchResults<PoiStored>('gTrackPois', this._poiSelectors.getAllPois)),
        take(1)
      ),
      this._store.pipe(
        select(hikeEditRoutePlannerSelectors.getPath),
        take(1)
      )
    )
      .pipe(
        debounceTime(250),
        filter(
          ([gTrackPoiContext, pois, path]: [ExternalPoiListContextItemState, Array<GTrackPoi> | undefined, any]) =>
            (pois && pois.length > 0 && path && (gTrackPoiContext as any).showOnrouteMarkers) ||
            (gTrackPoiContext as any).showOffrouteMarkers
        ),
        switchMap(
          ([gTrackPoiContext, pois, path]: [ExternalPoiListContextItemState, Array<GTrackPoi> | undefined, any]) =>
            of([gTrackPoiContext as any, this.organizePois(pois as any, path)])
        ),
        switchMap(([gTrackPoiContext, pois]: [ExternalPoiListContextItemState, Array<GTrackPoi>]) =>
          of([gTrackPoiContext as any, this.handleHikeInclusion(pois)])
        )
      )
      .subscribe(([gTrackPoiContext, pois]: [ExternalPoiListContextItemState, Array<any>]) => {
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

    this._getVisibleServicePois('collector', hikeEditPoiSelectors.getAllCollectorPois).subscribe((pois: Array<any>) => {
      _pois = _pois.concat(pois.map(p => _assign(_cloneDeep(p), { markerType: 'collector' })));
    });
    this._getVisibleServicePois(EPoiTypes.google, hikeEditPoiSelectors.getAllGooglePois).subscribe(
      (pois: Array<ExternalPoi>) => {
        _pois = _pois.concat(
          pois.map(p => _assign(_cloneDeep(p), { markerType: EPoiTypes.google })).filter(p => !p.inCollector)
        );
      }
    );
    this._getVisibleServicePois(EPoiTypes.osmAmenity, hikeEditPoiSelectors.getAllOsmAmenityPois).subscribe(
      (pois: Array<ExternalPoi>) => {
        _pois = _pois.concat(
          pois.map(p => _assign(_cloneDeep(p), { markerType: EPoiTypes.osmAmenity })).filter(p => !p.inCollector)
        );
      }
    );
    this._getVisibleServicePois(EPoiTypes.osmNatural, hikeEditPoiSelectors.getAllOsmNaturalPois).subscribe(
      (pois: Array<ExternalPoi>) => {
        _pois = _pois.concat(
          pois.map(p => _assign(_cloneDeep(p), { markerType: EPoiTypes.osmNatural })).filter(p => !p.inCollector)
        );
      }
    );
    this._getVisibleServicePois(EPoiTypes.osmRoute, hikeEditPoiSelectors.getAllOsmRoutePois).subscribe(
      (pois: Array<ExternalPoi>) => {
        _pois = _pois.concat(
          pois.map(p => _assign(_cloneDeep(p), { markerType: EPoiTypes.osmRoute })).filter(p => !p.inCollector)
        );
      }
    );
    this._getVisibleServicePois(EPoiTypes.wikipedia, hikeEditPoiSelectors.getAllWikipediaPois).subscribe(
      (pois: Array<ExternalPoi>) => {
        _pois = _pois.concat(
          pois.map(p => _assign(_cloneDeep(p), { markerType: EPoiTypes.wikipedia })).filter(p => !p.inCollector)
        );
      }
    );

    // Generate poi markers
    const _poiMarkers = this._generatePoiMarkers(_pois);
    const _imageMarkers = this._generateImageMarkers();
    const _markers = _poiMarkers.concat(_imageMarkers);

    // Add markers to the map
    this._leafletMapService.removeLayer(this._markersGroup);

    if (_markers.length > 0) {
      this._markersGroup = this._leafletMapService.createMarkersGroup(_map(_markers, 'marker'));
      this._leafletMapService.addLayer(this._markersGroup);

      // Register marker to spiderfier
      this._leafletMapService.refreshSpiderfierMarkers(_markers.map(m => m.marker), EMarkerType.POI);
    }
  }

  /**
   * organizePois submethod
   */
  private _handleTypes(poi: ExternalPoi): void {
    const _types: Array<string> = [];
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
   * refreshPoiMarkers submethod
   */
  private _getVisibleServicePois(subdomain, poiSelector): Observable<Array<ExternalPoi>> {
    return combineLatest(
      this._store.pipe(
        select(hikeEditPoiSelectors.getHikeEditPoiContextSelector(subdomain)),
        take(1)
      ),
      this._store.pipe(
        select(poiSelector),
        take(1)
      )
    ).pipe(
      rxMap(([poiContext, pois]: [ExternalPoiListContextItemState, Array<ExternalPoi>]) => {
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
  private _generatePoiMarkers(pois): Array<LeafletMapMarker> {
    const _markers: Array<LeafletMapMarker> = [];

    for (const poi of pois) {
      const popupData: MarkerPopupData = {
        popupComponentName: 'AdminMarkerPopupComponent',
        markerClickCallback: this._markerPopupService.onUserMarkerClick,
        closeCallback: () => {
          this._leafletMapService.leafletMap.closePopup();
          this.refreshPoiMarkers();
        },
        map: this._leafletMapService.leafletMap,
        data: _cloneDeep(poi)
      };

      const _marker = this._leafletMapMarkerService.create(
        poi.lat,
        poi.lon,
        poi.types || [],
        '',
        {
          poiId: poi.id
        },
        popupData
      );
      (_marker as any).marker.options.type = EMarkerType.POI;

      _markers.push(_marker);
    }

    return _markers;
  }

  private _generateImageMarkers(): Array<LeafletMapMarker> {
    const _markers: Array<LeafletMapMarker> = [];

    combineLatest(
      this._store.pipe(
        select(editedHikeProgramSelectors.getBackgroundOriginalUrls()),
        take(1)
      ),
      this._store.pipe(
        select(hikeEditImageSelectors.getImageMarkerImages),
        take(1)
      )
    ).subscribe(([bgImageUrls, markerImages]: [Array<string>, Array<BackgroundImageData>]) => {
      for (const image of markerImages) {
        const popupData: MarkerPopupData = {
          popupComponentName: 'ImageMarkerPopupComponent',
          markerClickCallback: this._markerPopupService.onUserMarkerClick,
          closeCallback: () => {
            this._leafletMapService.leafletMap.closePopup();
            this.refreshPoiMarkers();
          },
          map: this._leafletMapService.leafletMap,
          data: _cloneDeep(image)
        };

        const _marker = this._leafletMapMarkerService.create(
          image.lat,
          image.lon,
          ['photo'],
          '',
          {
            imageUrl: image.original.url
          },
          popupData
        );
        (_marker.marker as any).options.type = EMarkerType.IMAGE;

        if (bgImageUrls.includes(image.original.url)) {
          _marker.toggleHighlight();
        }

        _markers.push(_marker);
      }
    });

    return _markers;
  }
}
