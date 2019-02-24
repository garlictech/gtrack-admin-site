import { GoogleMapsService } from 'subrepos/gtrack-common-ngx';

import { Injectable } from '@angular/core';

const _parseResults = (results: Array<google.maps.GeocoderResult>) => {
  const _parts: any = {};

  for (const res of results) {
    for (const component of res.address_components) {
      for (const type of ['locality', 'country', 'administrative_area_level_1']) {
        if (component.types.indexOf(type) >= 0) {
          _parts[type] = component.long_name;
        }
        if (type === 'country') {
          _parts.country = component.short_name;
        }
      }
    }
  }

  if (_parts.administrative_area_level_1 === _parts.locality) {
    delete _parts.administrative_area_level_1;
  }

  let _ret = _parts.locality || '';

  if (_parts.country) {
    _ret += `, ${_parts.country}`;
  }

  return _ret;
};

@Injectable()
export class ReverseGeocodingService {
  constructor(private readonly _googleMapsService: GoogleMapsService) {}

  get(coordinates): Promise<any> {
    return this._googleMapsService.map.then(() => {
      const _point = new google.maps.LatLng(coordinates.lat, coordinates.lon);
      const _geocoder = new google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        _geocoder.geocode({ location: _point }, (results, error) => {
          if (results) {
            resolve(_parseResults(results));
          } else {
            reject(error);
          }
        });
      });
    });
  }
}
