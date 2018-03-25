import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { EPoiTypes } from 'subrepos/provider-client';
import { GoogleMapsService } from 'subrepos/gtrack-common-ngx/index';

import { IGooglePoi } from 'app/shared/interfaces';
import { LanguageService } from '../language.service';

import { /**/ } from '@types/googlemaps';

import * as uuid from 'uuid/v1';
import * as _ from 'lodash';

@Injectable()
export class GooglePoiService {
  private _hasNextPage$: Subject<boolean> = new Subject<boolean>();
  private _placesService: google.maps.places.PlacesService;

  constructor(
    private _http: HttpClient,
    private _googleMapsService: GoogleMapsService
  ) {}

  public get(bounds, lng = 'en') {
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

        return new Promise((resolve, reject) => {
          this._placesService.nearbySearch({bounds: _bnds}, (result, status, pagination) => {
            for (let i = 0; i < result.length; i++) {
              const _point = result[i];
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
    return Observable
      .interval(200)
      .take(pois.length)
      .mergeMap((idx) => {
        let _googleData = _.cloneDeep(pois[idx]!.google!);
        if (_googleData.id) {
          this._placesService.getDetails({
            placeId: _googleData.id
          }, (place, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              return Observable.empty();
            }

            if (status === google.maps.places.PlacesServiceStatus.OK) {
              _googleData.formatted_address = place.formatted_address;
              _googleData.international_phone_number = place.international_phone_number;

              if (place.opening_hours) {
                _googleData.opening_hours = place!.opening_hours;
              }
              if (place.photos) {
                _googleData.photos = place!.photos;
              }
            }

            return Observable.empty();
          })
          return Observable.empty();
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
