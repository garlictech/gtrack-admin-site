import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExternalPoi } from './external-poi';
import { GoogleMapsService } from '../../../../subrepos/gtrack-common-ngx/index';
import { /**/ } from '@types/googlemaps';
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

@Injectable()
export class GooglePoiService {
  private _hasNextPage$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _http: HttpClient,
    private _googleMapsService: GoogleMapsService
  ) {}

  public get(bounds, lang = 'en') {
    return this._googleMapsService.map
      .then(() => {
        this._createFakeMapInstance();
        this._hasNextPage$.next(true);

        const _map = new google.maps.Map(document.getElementById('fakeMap'));
        const _srv = new google.maps.places.PlacesService(_map);
        const _bnds = new google.maps.LatLngBounds(
          new google.maps.LatLng(bounds.SouthWest.lat, bounds.SouthWest.lon),
          new google.maps.LatLng(bounds.NorthEast.lat, bounds.NorthEast.lon)
        );
        let _res = [];

        return new Promise((resolve, reject) => {
          _srv.nearbySearch({bounds: _bnds}, (result, status, pagination) => {
            for (let i = 0; i < result.length; i++) {
              const _point = result[i];
              const _pointData = {
                lat: _point.geometry.location.lat(),
                lon: _point.geometry.location.lng(),
                title: _point.name || 'unknown',
                types: _point.types || [],
                objectType: 'google',
                google: {
                  id: _point.place_id
                }
              }
              _pointData.types = _.map(_point.types, (obj) => {
                return obj === 'locality' ? 'city' : obj;
              })

              _res.push(new ExternalPoi(_pointData));
            }

            if (pagination.hasNextPage) {
              // Google API:  must wait 2 sec between requests
              setTimeout(() => {
                pagination.nextPage()
              }, 100);
            } else {
              resolve(_res);
            }
          });
        });
      });
  }

  /**
   * get() submethod
   */
  private _createFakeMapInstance() {
    let fakeDiv = document.createElement('div');
    fakeDiv.id = 'fakeMap';
    fakeDiv.style.display = 'none';
    document.body.appendChild(fakeDiv);
  }

  /**
   * get() submethod
   */
  private _removeFakeMapInstance() {
    let fakeDiv = document.getElementById('fakeMap');
    document.body.removeChild(fakeDiv);
  }
}
