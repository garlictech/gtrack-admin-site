import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { EPoiTypes, IBackgroundImageData, EPoiImageTypes } from 'subrepos/provider-client';
import {
  GoogleMapsService,
  GeometryService,
  CenterRadius,
  defaultSharedConfig
} from 'subrepos/gtrack-common-ngx';

import { IGooglePoi } from '../../interfaces';
import { LanguageService } from '../language.service';

import * as uuid from 'uuid/v1';
import * as _ from 'lodash';

const PURE_PLACE_API_URL = 'https://maps.googleapis.com/maps/api/place';
const PLACE_API_URL = `https://cors-anywhere.herokuapp.com/${PURE_PLACE_API_URL}`;

@Injectable()
export class GooglePoiService {
  private _hasNextPage$: Subject<boolean> = new Subject<boolean>();
  private _placesService: google.maps.places.PlacesService;

  constructor(
    private _http: HttpClient,
    private _googleMapsService: GoogleMapsService,
    private _geometryService: GeometryService
  ) {}

  public get_old(bounds, lng = 'en') {
    return this._googleMapsService.map
      .then(() => {
        this._hasNextPage$.next(true);

        const _map = new google.maps.Map(document.getElementById('fakeMap'));
        const _bnds = new google.maps.LatLngBounds(
          new google.maps.LatLng(bounds.SouthWest.lat, bounds.SouthWest.lon),
          new google.maps.LatLng(bounds.NorthEast.lat, bounds.NorthEast.lon)
        );
        let _res: IGooglePoi[] = [];

        this._placesService = new google.maps.places.PlacesService(_map);

        // https://developers.google.com/maps/documentation/javascript/places#places_photos
        return new Promise((resolve, reject) => {
          this._placesService.nearbySearch({bounds: _bnds}, (result, status, pagination) => {
            for (let _point of result) {
              const _pointData: IGooglePoi = {
                id: uuid(),
                lat: _point.geometry.location.lat(),
                lon: _point.geometry.location.lng(),
                elevation: 0,
                description: {
                  [LanguageService.shortToLocale(lng)]: {
                    title: _point.name || 'unknown',
                  }
                },
                types: _point.types || [],
                objectType: EPoiTypes.google,
                google: {
                  id: _point.place_id
                }
              }

              _pointData.types = _.map(_point.types, (obj) => {
                return obj === 'locality' ? 'city' : obj;
              })

              _res.push(_pointData);
            }

            if (pagination.hasNextPage) {
              // Google API:  must wait 2 sec between requests
              setTimeout(() => {
                pagination.nextPage()
              }, 500);
            } else {
              this._getPlaceInfo(_res).then((data) => {
                resolve(data);
              });
            }
          });
        });
      });
  }

  /**
   * get() submethod
   */
  private _getPlaceInfo(pois: IGooglePoi[]) {
    const thumbnailWidth = 320;
    const cardWidth = 640;

    return Observable
      .interval(200)
      .take(pois.length)
      .flatMap((idx) => {
        let _googleData = pois[idx]!.google!;

        if (_googleData.id) {
          const promise = new Promise((resolve, reject) => {
            this._placesService.getDetails({
              placeId: _googleData.id
            }, (place, status) => {
              if (status !== google.maps.places.PlacesServiceStatus.OK) {
                console.log('ERROR', status);
                resolve();
              }

              if (status === google.maps.places.PlacesServiceStatus.OK) {
                _googleData.formatted_address = place.formatted_address;
                _googleData.international_phone_number = place.international_phone_number;

                if (place.opening_hours) {
                  _googleData.opening_hours = place!.opening_hours;
                }

                const _photos: IBackgroundImageData[] = [];
                if (place.photos) {
                  let _placePhotos = place.photos;
                  if (environment.googlePhotoLimit) {
                    _placePhotos = _.take(_placePhotos, environment.googlePhotoLimit);
                  }

                  for (let _photo of _placePhotos) {
                    const _photoInfo: IBackgroundImageData = {
                      title: _photo.html_attributions[0] || '',
                      original: {
                        url: _photo.getUrl({'maxWidth': _photo.width}),
                        width: _photo.width,
                        height: _photo.height
                      },
                      card: {
                        url: _photo.getUrl({'maxWidth': cardWidth}),
                        width: cardWidth,
                        height: Math.round((cardWidth * _photo.height) / _photo.width)
                      },
                      thumbnail: {
                        url: _photo.getUrl({'maxWidth': thumbnailWidth}),
                        width: thumbnailWidth,
                        height: Math.round((thumbnailWidth * _photo.height) / _photo.width)
                      },
                      source: {
                        type: EPoiImageTypes.google,
                        poiObjectId: _googleData.id
                      }
                    }
                    _photos.push(_photoInfo);
                  }

                  _googleData.photos = _photos;
                }
              }

              resolve();
            });
          });

          return Observable.of(promise);
        } else {
          return Observable.empty();
        }
      })
      .combineAll()
      .toPromise()
      .then(() => {
        return pois;
      });
  }

  public get(bounds, lng = 'en') {
    const geo: CenterRadius = this._geometryService.getCenterRadius(bounds);

    return new Promise((resolve, reject) => {
      this._batchGet(this._getOnePage, {
        geo: geo,
        lng: lng,
        results: []
      }).then(_res => {
        resolve(_res);
      });
    });
  }

  private _getOnePage = params => {
    let request = `${PLACE_API_URL}/nearbysearch/json?location=${params.geo!.center!.geometry!.coordinates![1]},${
      params.geo!.center!.geometry!.coordinates![0]
    }&radius=${params.geo!.radius!}&key=${defaultSharedConfig.googleMaps.key}`;

    if (params.pageToken) {
      request += `&pagetoken=${params.pageToken}`;
    }

    return this._http
      .get(request)
      .toPromise()
      .then((data: any) => {
        // DOC: https://developers.google.com/places/web-service/search

        const _res: IGooglePoi[] = [];
        for (let _point of data.results) {
          const _pointData: IGooglePoi = {
            id: uuid(),
            lat: _point.geometry.location.lat,
            lon: _point.geometry.location.lng,
            elevation: 0,
            description: {
              [LanguageService.shortToLocale(params.lng)]: {
                title: _point.name || 'unknown',
                summary: '',
                fullDescription: ''
              }
            },
            types: _point.types || [],
            objectType: EPoiTypes.google,
            google: {
              id: _point.place_id
            },
            selected: false
          };

          _pointData.types = _.map(_point.types, obj => {
            return obj === 'locality' ? 'city' : obj;
          });

          _res.push(_pointData);
        }

        let result: any = {
          data: _res
        };

        if (data.next_page_token) {
          result.nextParams = {
            pageToken: data.next_page_token
          };
        }
        return result;
      });
  };

  private _batchGet(getter, params) {
    return getter(params).then(result => {
      params.results = params.results.concat(result.data);

      if (!result.nextParams) {
        return params.results;
      } else {
        params.pageToken = result.nextParams.pageToken;
        return this._batchGet(getter, params);
      }
    });
  }

  /**
   * get() submethod
   */
  public getPoiDetails(pois: IGooglePoi[]) {
    const thumbnailWidth = 320;
    const cardWidth = 640;

    return Observable.interval(500)
      .take(pois.length)
      .flatMap(idx => {
        let _googleData = pois[idx]!.google!;

        if (_googleData.id) {
          const request = `${PLACE_API_URL}/details/json?placeid=${_googleData.id}&key=${
            defaultSharedConfig.googleMaps.key
          }`;

          const promise = this._http
            .get(request)
            .toPromise()
            .then((data: any) => {
              if (data.status !== google.maps.places.PlacesServiceStatus.OK) {
                console.log('ERROR', status);
                return;
              }

              if (data.status === google.maps.places.PlacesServiceStatus.OK) {
                _googleData.formatted_address = data.result.formatted_address;
                _googleData.international_phone_number = data.result.international_phone_number;

                if (data.result.opening_hours) {
                  _googleData.opening_hours = data.result!.opening_hours;
                }

                const _photos: IBackgroundImageData[] = [];
                if (data.result.photos) {
                  let _placePhotos = data.result.photos;
                  if (environment.googlePhotoLimit) {
                    _placePhotos = _.take(_placePhotos, environment.googlePhotoLimit);
                  }

                  for (let _photo of _placePhotos) {
                    const _photoInfo: IBackgroundImageData = {
                      title: _photo.html_attributions[0] || '',
                      original: {
                        url: `${PURE_PLACE_API_URL}/photo?maxwidth=${_photo.width}&photoreference=${
                          _photo.photo_reference
                        }&key=${defaultSharedConfig.googleMaps.key}`,
                        width: _photo.width,
                        height: _photo.height
                      },
                      card: {
                        url: `${PURE_PLACE_API_URL}/photo?maxwidth=${cardWidth}&photoreference=${
                          _photo.photo_reference
                        }&key=${defaultSharedConfig.googleMaps.key}`,
                        width: cardWidth,
                        height: Math.round((cardWidth * _photo.height) / _photo.width)
                      },
                      thumbnail: {
                        url: `${PURE_PLACE_API_URL}/photo?maxwidth=${thumbnailWidth}&photoreference=${
                          _photo.photo_reference
                        }&key=${defaultSharedConfig.googleMaps.key}`,
                        width: thumbnailWidth,
                        height: Math.round((thumbnailWidth * _photo.height) / _photo.width)
                      },
                      source: {
                        type: EPoiImageTypes.google,
                        poiObjectId: _googleData.id,
                        photoReference: _photo.photo_reference
                      }
                    };
                    _photos.push(_photoInfo);
                  }

                  _googleData.photos = _photos;
                }
              }
            });

          return Observable.of(promise);
        } else {
          return Observable.empty();
        }
      })
      .combineAll()
      .toPromise()
      .then(() => {
        return pois;
      });
  }
}
