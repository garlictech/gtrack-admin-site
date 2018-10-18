import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, of, interval, Observable } from 'rxjs';
import { take, flatMap, combineAll } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { EPoiTypes, IBackgroundImageData, EPoiImageTypes, ETextualDescriptionType } from 'subrepos/provider-client';
import {
  GeometryService,
  CenterRadius,
  defaultSharedConfig
} from 'subrepos/gtrack-common-ngx';

import { IGooglePoi } from '../../interfaces';
import { LanguageService } from '../language.service';

import * as uuid from 'uuid/v1';
import _map from 'lodash-es/map';
import _take from 'lodash-es/take';

const PURE_PLACE_API_URL = 'https://maps.googleapis.com/maps/api/place';
const PLACE_API_URL = `https://cors-anywhere.herokuapp.com/${PURE_PLACE_API_URL}`;

declare const google;

@Injectable()
export class GooglePoiService {
  constructor(
    private _http: HttpClient,
    private _geometryService: GeometryService
  ) {}

  public get(bounds, langs = ['en']) {
    const geo: CenterRadius = this._geometryService.getCenterRadius(bounds);

    const promise: Promise<IGooglePoi[]> = new Promise((resolve) => {
      this._batchGet(this._getOnePage, {
        geo: geo,
        langs: langs,
        results: []
      }).then(_res => {
        resolve(_res);
      });
    });

    return Observable.fromPromise(promise);
  }

  private _getOnePage = (params) => {
    // tslint:disable:max-line-length
    let request = `${PLACE_API_URL}/nearbysearch/json?location=${params.geo.center.geometry.coordinates[1]},${
      params.geo.center.geometry.coordinates[0]
    }&radius=${params.geo.radius}&key=${defaultSharedConfig.googleMaps.key}`;
    // tslint:enable:max-line-length

    if (params.pageToken) {
      request += `&pagetoken=${params.pageToken}`;
    }

    return this._http
      .get(request)
      .toPromise()
      .then((data: any) => {
        // DOC: https://developers.google.com/places/web-service/search

        const _res: IGooglePoi[] = [];
        for (const _point of data.results) {
          const _pointData: IGooglePoi = {
            id: uuid(),
            lat: _point.geometry.location.lat,
            lon: _point.geometry.location.lng,
            elevation: 0,
            description: {
              [LanguageService.shortToLocale(params.langs[0] || 'en')]: {
                title: _point.name || LanguageService.pascalize(_point.types[0]) || 'unknown',
                summary: '',
                fullDescription: '',
                type: ETextualDescriptionType.markdown
              }
            },
            types: _point.types || [],
            objectTypes: [EPoiTypes.google],
            google: {
              id: _point.place_id
            },
            selected: false
          };

          _pointData.types = _map(_point.types, obj => {
            return obj === 'locality' ? 'city' : obj;
          });

          _res.push(_pointData);
        }

        const result: any = {
          data: _res
        };

        if (data.next_page_token) {
          result.nextParams = {
            pageToken: data.next_page_token
          };
        }
        return result;
      });
  }

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
   * handlePoiDetails() submethod
   */
  public getPoiDetails(pois: IGooglePoi[]) {
    const thumbnailWidth = 320;
    const cardWidth = 640;

    return interval(500)
      .pipe(
        take(pois.length),
        flatMap(idx => {
          const _googleData = pois[idx].google;

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
                    _googleData.opening_hours = data.result.opening_hours;
                  }

                  const _photos: IBackgroundImageData[] = [];
                  if (data.result.photos) {
                    let _placePhotos = data.result.photos;
                    if (environment.googlePhotoLimit) {
                      _placePhotos = _take(_placePhotos, environment.googlePhotoLimit);
                    }

                    for (const _photo of _placePhotos) {
                      const _photoInfo: IBackgroundImageData = {
                        title: _photo.html_attributions[0] || '',
                        lat: pois[idx].lat,
                        lon: pois[idx].lon,
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

            return of(promise);
          } else {
            return EMPTY;
          }
        }),
        combineAll()
      )
      .toPromise()
      .then(() => {
        return pois;
      });
  }
}
