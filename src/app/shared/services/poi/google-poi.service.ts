import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from 'environments/environment';
import { EPoiTypes, IBackgroundImageData, EPoiImageTypes } from 'subrepos/provider-client';
import { GoogleMapsService } from 'subrepos/gtrack-common-ngx/index';

import { IGooglePoi } from 'app/shared/interfaces';
import { LanguageService } from '../language.service';

import * as uuid from 'uuid/v1';
import * as _ from 'lodash';

@Injectable()
export class GooglePoiService {
  private _hasNextPage$: Subject<boolean> = new Subject<boolean>();
  private _placesService: google.maps.places.PlacesService;

  constructor(private _googleMapsService: GoogleMapsService) {}

  public get(bounds, lng = 'en') {
    return this._googleMapsService.map.then(() => {
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
        this._placesService.nearbySearch({ bounds: _bnds }, (result, status, pagination) => {
          for (let _point of result) {
            const _pointData: IGooglePoi = {
              id: uuid(),
              lat: _point.geometry.location.lat(),
              lon: _point.geometry.location.lng(),
              elevation: 0,
              description: {
                [LanguageService.shortToLocale(lng)]: {
                  title: _point.name || 'unknown'
                }
              },
              types: _point.types || [],
              objectType: EPoiTypes.google,
              google: {
                id: _point.place_id
              }
            };

            _pointData.types = _.map(_point.types, obj => {
              return obj === 'locality' ? 'city' : obj;
            });

            _res.push(_pointData);
          }

          if (pagination.hasNextPage) {
            // Google API:  must wait 2 sec between requests
            setTimeout(() => {
              pagination.nextPage();
            }, 500);
          } else {
            this._getPlaceInfo(_res).then(data => {
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

    return Observable.interval(200)
      .take(pois.length)
      .flatMap(idx => {
        let _googleData = pois[idx]!.google!;

        if (_googleData.id) {
          const promise = new Promise((resolve, reject) => {
            this._placesService.getDetails(
              {
                placeId: _googleData.id
              },
              (place, status) => {
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
                          url: _photo.getUrl({ maxWidth: _photo.width }),
                          width: _photo.width,
                          height: _photo.height
                        },
                        card: {
                          url: _photo.getUrl({ maxWidth: cardWidth }),
                          width: cardWidth,
                          height: Math.round((cardWidth * _photo.height) / _photo.width)
                        },
                        thumbnail: {
                          url: _photo.getUrl({ maxWidth: thumbnailWidth }),
                          width: thumbnailWidth,
                          height: Math.round((thumbnailWidth * _photo.height) / _photo.width)
                        },
                        source: {
                          type: EPoiImageTypes.google,
                          poiObjectId: _googleData.id
                        }
                      };
                      _photos.push(_photoInfo);
                    }

                    _googleData.photos = _photos;
                  }
                }

                resolve();
              }
            );
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
